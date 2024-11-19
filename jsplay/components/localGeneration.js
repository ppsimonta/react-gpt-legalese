const axios = require('axios');

// For local streaming, the websockets are hosted without SSL - http://
const HOST = '127.0.0.1:5000';
const URI = `http://${HOST}/api/v1/chat`;

// For reverse-proxied streaming, the remote will likely host with SSL - https://
// const URI = 'https://your-uri-here.trycloudflare.com/api/v1/chat';

async function generateExplanation(wss, array, tokenLimit) {
    let chatMessages = { internal: [], visible: [] };
    let completedTextArray = [];
    
    // Insert instruction to prompt
    for (const [index, string] of array.entries()) {

        if (index == 0) {
            promptInstruction = `TL;DR:\n\n${string}`;
        }
        else {
            promptInstruction = `${string}`;
        }

        // Ask Language Model for a completion and save it as the "response" variable
        const response = await createCompletion(promptInstruction, chatMessages);
        chatMessages = response.data.results[0].history;

        completedTextArray.push(response.data.results[0].history.visible[response.data.results[0].history.visible.length - 1][1].trim())
        console.log(`Language Model explanation layer... ${Math.round((completedTextArray.length/array.length) * 100)}%`);
        sendWebSocketMessage(wss, { progress: Math.round(((completedTextArray.length/array.length) * 100)), description: "Generating brief overview..."})
    }

    // Generation should be finished here
    console.log("Language Model explanation layer finished");
    return completedTextArray;
};

async function generateAction(wss, array, tokenLimit) {
    let chatMessages = { internal: [], visible: [] };
    let completedTextArray = [];

    // Insert last summary as context and inject instruction to prompt
    for (const [index, string] of array.entries()) {

        promptInstruction = `In a few sentences, tell me what I need to do to follow these terms, or if nothing is required on my part in this just tell me that no action is required on my part.\n\n${string}`

        // Ask Language Model for a completion and save it as the "response" variable
        const response = await createCompletion(promptInstruction, chatMessages);
        chatMessages = response.data.results[0].history;

        completedTextArray.push(response.data.results[0].history.visible[response.data.results[0].history.visible.length - 1][1].trim())
        console.log(`Language Model action layer... ${Math.round((completedTextArray.length/array.length) * 100)}%`);
        sendWebSocketMessage(wss, { progress: Math.round(((completedTextArray.length/array.length) * 100)), description: "Generating required actions..."})
    }

    // Generation should be finished here
    console.log("Language Model action layer finished");
    return completedTextArray;
};

function sendWebSocketMessage(wss, message) {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
  }

async function createCompletion(userInput, history) {
const request = {
    user_input: userInput,
    max_new_tokens: 250,
    history: history,
    mode: 'instruct', // Valid options: 'chat', 'chat-instruct', 'instruct'
    character: 'Example',
    instruction_template: 'None', // 'Alpaca', 'Guanaco', 'WizardLM', 'Vicuna-v1.1', 'Wizard-Mega', 'Llama-v2' etc...
    your_name: 'You',
    regenerate: false,
    _continue: false,
    stop_at_newline: false,
    chat_generation_attempts: 1,
    chat_instruct_command: 'Continue the chat dialogue below. Write a single reply for the character "".\n\n',
    preset: 'None',
    do_sample: true,
    temperature: 0.7,
    top_p: 0.1,
    typical_p: 1,
    epsilon_cutoff: 0, // In units of 1e-4
    eta_cutoff: 0, // In units of 1e-4
    tfs: 1,
    top_a: 0,
    repetition_penalty: 1.18,
    repetition_penalty_range: 0,
    top_k: 40,
    min_length: 0,
    no_repeat_ngram_size: 0,
    num_beams: 1,
    penalty_alpha: 0,
    length_penalty: 1,
    early_stopping: false,
    mirostat_mode: 0,
    mirostat_tau: 5,
    mirostat_eta: 0.1,
    seed: -1,
    add_bos_token: true,
    truncation_length: 4096,
    ban_eos_token: false,
    skip_special_tokens: true,
    stopping_strings: [],
};

try {
    const response = await axios.post(URI, request);

    if (response.status === 200) {
    const result = response.data.results[0].history;
    // console.log(JSON.stringify(result, null, 4));
    // console.log();
    console.log(`\n${result.visible[result.visible.length - 1][1]}\n`);
    return response;
    }
} catch (error) {
    console.error('An error occurred:', error.message);
}
}

module.exports = {
    generateExplanation,
    generateAction,
    sendWebSocketMessage
};