// Import for saving files
import fs from 'node:fs';
import https from 'node:https';

// Fetch Memes Website
const fetchedHTML = await fetch(
  'https://memegen-link-examples-upleveled.netlify.app/',
)
  .then(function (response) {
    return response.text();
  })
  .catch(function (err) {
    console.log('Fetch Error', err);
  });

// Split fetchedHTML into lines by '\'
const splitHTML = fetchedHTML.split('\n');

// Create Image URL List
const imgUrlList = [];

// Search for '<img src' in every line until 10 URLs are saved in imgUrlList
for (const line of splitHTML) {
  if (line.includes('<img src') && imgUrlList.length < 10) {
    imgUrlList.push(line);
  }
}

// Loop to split imgUrlList, to receive only the clean image URLs
const cleanImgUrlList = [];

for (const line of imgUrlList) {
  const urlSplit = line.split('"');
  const cleanUrl = urlSplit[1];
  cleanImgUrlList.push(cleanUrl);
}
// Create a folder if it doesn't exist already
const folderName = './memes';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

// Function to download image with URL
function downloadMemes(url, imageName) {
  if (typeof imageName === 'string') {
    const file = fs.createWriteStream(imageName);
    https.get(url, (response) => {
      response.pipe(file);

      file.on('error', (err) => {
        console.log('Error written to the stream.');
        console.log(err);
      });

      file.on('finish', () => {
        file.close();
        console.log(`Image downloaded as ${imageName}`);
      });
    });
  }
}
let count = 1;

// Loop the function
for (const url of cleanImgUrlList) {
  let imageName = '';
  if (count < 10) {
    // For the first 9 downloads create file name 01.jpg, 02.jpg, 03.jpg, etc.
    imageName = `./memes/0${count}.jpg`;
  } else {
    // After the first 9 downloads create file name 10.jpg
    imageName = `./memes/${count}.jpg`;
  }
  downloadMemes(url, imageName);
  count = count + 1;
}
