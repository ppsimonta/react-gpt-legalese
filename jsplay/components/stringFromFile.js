const fs = require('fs');

async function getContent(src) {
    const doc = await pdfjs.getDocument(src).promise;
    const numPages = doc.numPages;
    const textContents = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await doc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = processTextContent(textContent);
        textContents.push(pageText);
    }

    return textContents;
}

function processTextContent(textContent) {
    const textItems = textContent.items;
    let processedText = '';

    for (let i = 0; i < textItems.length; i++) {
        const item = textItems[i];

        // Handle line breaks
        if (i > 0 && item.transform[5] !== textItems[i - 1].transform[5]) {
            processedText += '\n';
        }

        processedText += item.str;
    }

    return processedText.trim();
}

async function getItems(src) {
    const content = await getContent(src);
    const items = content.flatMap((pageContent) => pageContent.split('\n'));

    let stitchedText = "";
    items.forEach((item) => {
        stitchedText = `${stitchedText}${item}\n`;
    });

    return stitchedText;
}

function readLocalTextFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
        reject(new Error(`Failed to read file: ${filePath}`));
      } else {
        resolve(data);
      }
    });
  });
}

async function stringFromFile(file, fileType) {
  
    let string = "";

    // If PDF, extract text
    if (fileType === "pdf") {
        string = await getItems(`./uploads/${file}`);
        console.log("Extracted text from pdf");
    }

    // If txt, extract text
    if (fileType === "txt") {
        string = await readLocalTextFile(`./uploads/${file}`);
        console.log("Extracted text from txt");
    }

    return string;
};

module.exports = stringFromFile;