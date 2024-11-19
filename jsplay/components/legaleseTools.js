const gptTokenizer = require('gpt-tokenizer/model/text-davinci-003');
const openAIGeneration = require("../components/openAIGeneration.js");
const localGeneration = require("../components/localGeneration.js");

function stringToArrayWithinTokenLimit(wss, string, tokenLimit) {
    let startCharacter = 0;
    let endCharacter = 1;
    let processedTextArray = [];
    let processedText = "";

    while (endCharacter < string.length) {
        while (gptTokenizer.isWithinTokenLimit(processedText, tokenLimit) !== false && endCharacter < string.length) {
            endCharacter = endCharacter + 10;
            processedText = string.slice(startCharacter, endCharacter);
        }
        processedTextArray.push(processedText);
        startCharacter = endCharacter;
        processedText = "";
        console.log(`Slicing... ${Math.round((endCharacter/(string.length)) * 100)}%`);
        sendWebSocketMessage(wss, { progress: Math.round((endCharacter/(string.length)) * 100), description: "Slicing text to pieces for processing..."})
    }
    console.log("Sliced text to fit token limit");
    return processedTextArray;
};

async function generateExplanation(wss, array, model, tokenLimit) {

    if (model == "openai") {
        return await openAIGeneration.generateExplanation(wss, array, tokenLimit);
    }
    else if (model == "local") {
        return await localGeneration.generateExplanation(wss, array, tokenLimit);
    }
};

async function generateAction(wss, array, model, tokenLimit) {
    if (model == "openai") {
        return await openAIGeneration.generateAction(wss, array, tokenLimit);
    }
    else if (model == "local") {
        return await localGeneration.generateAction(wss, array, tokenLimit);
    }
};

function sendWebSocketMessage(wss, message) {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
  }

module.exports = {
    stringToArrayWithinTokenLimit,
    generateExplanation,
    generateAction,
    sendWebSocketMessage
};