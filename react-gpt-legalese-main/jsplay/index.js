const dotenv = require("dotenv")
dotenv.config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
pdfjs = require("pdfjs-dist/build/pdf");
const path = require('path');
const multer = require('multer');
const upload = multer({dest: './uploads/'});
const fs = require('fs');
const gptTokenizer = require('gpt-tokenizer/model/gpt-4');
const mysql = require('mysql');
const WebSocket = require('ws');

// Custom components
const legaleseTools = require("./components/legaleseTools.js");
const stringFromFile = require("./components/stringFromFile.js");
let selectedOption = "openai";

function createConnection() {
    return mysql.createConnection({
      host: "localhost",
      user: 'root',
      password: '',
      database: "chatbot_db",
      port: process.env.DB_PORT
    });
  }


// Save to database
function saveToDatabase(processedTextArray, completedTextArray, actionTextArray) {
    const connection = createConnection();
  
    try {
      connection.connect();
      console.log('Connected to database');
  
      const originalText = processedTextArray.join('');
      const explanationText = completedTextArray.join('\n\n');
      const actionText = actionTextArray.join('\n\n');
  
      const query = "INSERT INTO questions_answers (original_text, explanation_text, action_text) VALUES ?";
      const values = [[originalText, explanationText, actionText]];
  
      connection.query(query, [values]);
      console.log("Question and answer saved to database");
  
      return getLastInsertedId(connection);
      
    } catch (error) {
      console.error("Error saving question and answer to database:", error);
      throw error;
    } finally {
      connection.end();
      console.log('Database connection closed');
    }
  }
  
  // Get last inserted id
  function getLastInsertedId(connection) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id FROM questions_answers ORDER BY id DESC LIMIT 1';
      connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const lastInsertedId = results[0].id;
          resolve(lastInsertedId);
        }
      });
    });
  }

// OpenAI configuration
const {Configuration, OpenAIApi} = require('openai');
const { get } = require("http");
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

//setup server
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 8080;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

const wss = new WebSocket.Server({ server });

let chatMessages = [];

//endpoint for chatgpt
app.post("/chat", async (req, res) => {

  if (req.body.message) {
    chatMessages.push({role: "user", content: req.body.message})

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: chatMessages
    });

    chatMessages.push({role: "assistant", content: completion.data.choices[0].message.content})
  };

  if (req.body.command == "clear") {
    chatMessages = [];
  };

  res.json(chatMessages);
});

//endpoint for choosing model

app.post('/selectedOption', (req, res) => {
  selectedOption = req.body.selectedOption;

  res.json({selectedOption: selectedOption});
});

// Endpoint for file uploading
app.post("/upload", upload.single("img"), async (req, res) => {
    let fileType = req.file.mimetype.split("/")[1];
    
    console.log(selectedOption)
    // Fix plaintext files
    if (fileType === "plain") {
        fileType = "txt";
    }

    let newFileName = req.file.filename + "." + fileType;
    
    fs.rename(`./uploads/${req.file.filename}`, `./uploads/${newFileName}`, async function(){
        console.log("callback"); 

        // Extract text contents
        const string = await stringFromFile(newFileName, fileType);

        // Slice text strings to an array of shorter items
        const processedTextArray = legaleseTools.stringToArrayWithinTokenLimit(wss, string, 2048);

        // Generate completions
        const explanationTextArray = await legaleseTools.generateExplanation(wss, processedTextArray, selectedOption, 4096);
        const otherProcessedTextArray = legaleseTools.stringToArrayWithinTokenLimit(wss, explanationTextArray.join("\n\n"), 2048);
        const actionTextArray = await legaleseTools.generateAction(wss, otherProcessedTextArray, selectedOption, 4096);

         // Save to database
        const lastInsertedId = await saveToDatabase(processedTextArray, explanationTextArray, actionTextArray);
        console.log("Last inserted id: " + lastInsertedId)

        // Send response
        let response = {
            original_layer: processedTextArray,
            explanation_layer: explanationTextArray,
            action_layer: actionTextArray,
            last_inserted_id: lastInsertedId
        };
        res.json(response);
        console.log("Response sent");

       
        
        // Delete uploaded file
        fs.unlink(`./uploads/${newFileName}`, async (err) => {
        if (err) {
          console.error(err)
          return
        }
        else {
            console.log("Uploaded file successfully removed")
        }
      })

      
    });
})

app.get('/datahistoryall', (req, res) => {
    const connection = createConnection();
  
    const query = 'SELECT * FROM questions_answers';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Virhe tiedon hakemisessa: ' + error.stack);
        res.status(500).json({ error: 'Virhe tiedon hakemisessa' });
      } else {
        // Return data in JSON format
        res.json(results);
      }
  
      connection.end();
      console.log('Database connection closed');
    });
  });


  app.get('/datahistory/:id', (req, res) => {
    const connection = createConnection();
    const questionId = req.params.id;
  
    const query = 'SELECT * FROM questions_answers WHERE id = ?';
    connection.query(query, [questionId], (error, results) => {
      if (error) {
        console.error('Virhe tiedon hakemisessa: ' + error.stack);
        res.status(500).json({ error: 'Virhe tiedon hakemisessa' });
      } else {
        if (results.length > 0) {
          // Return data in JSON format
          res.json(results[0]);
        } else {
          res.status(404).json({ error: 'Kysymystä ei löytynyt' });
        }
      }

      app.delete('/datahistory/:id', (req, res) => {
        const connection = createConnection();
        const questionId = req.params.id;
      
        const query = 'DELETE FROM questions_answers WHERE id = ?';
        connection.query(query, [questionId], (error, results) => {
          if (error) {
            console.error('Virhe tiedon poistamisessa: ' + error.stack);
            res.status(500).json({ error: 'Virhe tiedon poistamisessa' });
          } else {
            if (results.affectedRows > 0) {
              res.json({ message: 'Tieto poistettu onnistuneesti' });
            } else {
              res.status(404).json({ error: 'Kysymystä ei löytynyt' });
            }
          }
        });
      });
  
      connection.end();
      console.log('Database connection closed');
    });
  });
