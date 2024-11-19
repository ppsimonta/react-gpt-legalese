# AI legal text summarization with PDF and TXT upload

## Installation

Requirements:

- MySQL
- Node
- Optionally [https://github.com/oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui) for generating text on a local language model. Just download any model from HuggingFace etc. and enable the API extension.
    - Local model support is buggy and the code for using the API is interpreted from examples which are lacking. 

Rename the `.env.example` file to `.env` and replace the default environment variables with your preferred values.

1. Install node dependencies for the back-end:
```bash
cd jsplay
npm install
```

2. Install node dependencies for the front-end:
```bash
cd reactjs
npm install
```

3. Execute the database creation script `database.sql`

## Running

Both servers need to be running to use the app. Additionally, if MySQL is not running as a service remember to start it.

1. Starting the back-end:
    ```bash
    cd jsplay
    node index.js
    ```

2. Starting the front-end:
    ```bash
    cd reactjs
    npm run start
    ```

# About

## Functionality

This app allows the user to upload PDF or TXT files whose content will automatically get sliced to fit the context limit of GPT-3, GPT-4 or any future revision of the language model and the text will be summarized in two stages; a brief overview and a paragraph explaining the user what action is required on their part of the terms of service or contract.

The chat window runs on GPT-4 and uploaded documents are summarized with GPT-3. This is to prevent hitting the rate limit on longer text files. Altough GPT-4's context limit is longer than GPT-3's, the API allows short bursts more frequently with the older model, whereas the newer GPT-4 would get rate limited in the case of a very long piece of text.

## Local language models

### HuggingFace open LLM leaderboard

Language models that are available on HuggingFace are ranked on their performance. 

[https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard)

The links in this section point to models that end in "GPTQ" which are GPU optimized models. In most cases replacing the suffix with "HF" or "GGML" will lead to a version of the model that can be run with both the GPU and the CPU or even CPU only.

### Recommended models

- [TheBloke/Llama-2-13B-chat-GPTQ](https://huggingface.co/TheBloke/Llama-2-13B-chat-GPTQ)

    [Installation guide video](https://youtu.be/BtYT5cxLf0g) for the Oobabooga WebUI

- [TheBloke/WizardLM-7B-uncensored-GPTQ](https://huggingface.co/TheBloke/WizardLM-7B-uncensored-GPTQ)

    [Installation guide video](https://youtu.be/WeR0x2H7kLM) for the Oobabooga WebUI

- [TheBloke/stable-vicuna-13B-GPTQ](https://huggingface.co/TheBloke/stable-vicuna-13B-GPTQ)
    
    [Installation guide video](https://youtu.be/QeBmeHg8s5Y) for the Oobabooga WebUI

**The instruction format is not set by default. Please change it from None to the model you are using to get better results. `instruction_template` and other advanced settings may also be tweaked in `localGeneration.js`** 

## Proposed changes

### Automatic highlight regions

In its current form, the database saves the summarized version of a PDF or TXT file as a string, where data about which section corresponds to which part in the summary is lost. However, the outcoming response from the server is not just a string with line breaks, but an array of shorter sliced sections of the original document. The `ResultView.js` component is capable of displaying the array, and in fact, assigns a different highlight color to each section that is summarized.

With the dawn of GPT-4 the amount of sections in which the text has to be divided decreased to the point where the whole document can sometimes be sent without slicing. In those cases the issue is the same even if the database implementation were to store arrays.

### Illustrations

We wanted to include image detection in which the AI would explain and "unfold" what a given illustration would mean in a contract, but at the early developmental stage we had no access to GPT-4, much less to its multimodal capabilities that were announced later on. The ability for GPT-4 to see pictures in PDF documents was not able to be programmed in using the API.

Another idea was to use AI to create illustrative graphs or instructions along with the action layer part of the summary. Diffusion based algorithms aren't able to follow prompts well enough, and any attempt at describing an illustration in the generation prompt will end up outputting a nonsensical illustration that incorporates some of the words included in the prompt. Add-ons were introduced to give GPT-4 the ability to create Excel tables, run software and search the web, but all the above require the OpenAI ChatGPT front-end to be used. Any equivalent would need to be coded to the app and require explaining the commands that GPT would then use in the prompt.

### Local language models

There is an issue where the original document may leak into the summary column. This is likely due to implementing the message history incorrectly. The API in [https://github.com/oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui) appends messages by the user and from the AI onto a single array. We discovered that long messages would get sliced into multiple array entries, where it would be difficult to pick out the AI responses from the user input.

Using a low-performing model will cause very poor results including hallucination of details and getting stuck looping words.
