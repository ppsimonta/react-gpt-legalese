const gptTokenizer = require('gpt-tokenizer/model/gpt-3.5-turbo');
const dotenv = require("dotenv");
const {Configuration, OpenAIApi} = require('openai');

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

async function generateExplanation(wss, array, tokenLimit) {
    let chatMessages = [];
    let completedTextArray = [];
    
    // Insert instruction to prompt
    for (const [index, string] of array.entries()) {

        // Delete old messages starting with the oldest when context limit is reached
        while (gptTokenizer.isWithinTokenLimit(chatMessages, tokenLimit) === false) {
            chatMessages.splice(2, 2);
        }

        if (index == 0) {
            chatMessages.push({role: "user", content: `TL;DR: \n\n${string}`});
        }
        else {
            chatMessages.push({role: "user", content: `${string}`});
        }

        // Ask GPT for a completion and save it as the "text" variable
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chatMessages
            });
        const text = completion.data.choices[0].message.content;
        chatMessages.push({role: "assistant", content: text});

        completedTextArray.push(text.trim())
        console.log(`GPT explanation layer... ${Math.round((completedTextArray.length/array.length) * 100)}%`);
        sendWebSocketMessage(wss, { progress: Math.round(((completedTextArray.length/array.length) * 100)), description: "Generating brief overview..."})
    }

    // Generation should be finished here
    console.log("GPT explanation layer finished");
    return completedTextArray;
};

async function generateAction(wss, array, tokenLimit) {
    let chatMessages = [];
    let completedTextArray = [];
    
    // Insert instruction to prompt
    for (const [index, string] of array.entries()) {

        if (index == 0) {
            chatMessages.push({role: "user", content: `In a few sentences, tell me what I need to do to follow these terms, or if nothing is required on my part in this just tell me that no action is required on my part.\n\n${string}`});
        }
        else {
            chatMessages.push({role: "user", content: `${string}`});
        }

        // Ask GPT for a completion and save it as the "text" variable
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chatMessages
            });
        const text = completion.data.choices[0].message.content;
        chatMessages.push({role: "assistant", content: text});

        completedTextArray.push(text.trim())
        console.log(`GPT action layer... ${Math.round((completedTextArray.length/array.length) * 100)}%`);
        sendWebSocketMessage(wss, { progress: Math.round(((completedTextArray.length/array.length) * 100)), description: "Generating required actions..."})
    }

    // Generation should be finished here
    console.log("GPT action layer finished");
    return completedTextArray;
};

function sendWebSocketMessage(wss, message) {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
  }

module.exports = {
    generateExplanation,
    generateAction,
    sendWebSocketMessage
};