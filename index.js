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
let imgUrlList = [];
//Search for '<img src' in every line until 10 URLs are saved in imgUrlList
for (let line of splitHTML) {
  if (line.includes('<img src') && imgUrlList.length < 10) {
    imgUrlList.push(line);
  }
}
// console.log(imgUrlList.length);

// Loop to split imgUrlList, to receive only the image URLs in clean
let cleanImgUrlList = [];

for (let line of imgUrlList) {
  const urlSplit = line.split('"');
  let cleanUrl = urlSplit[1];
  cleanImgUrlList.push(cleanUrl);
}
//Create a folder if it doesn't exist already
const folderName = './memes';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

// Download image with exact URL
function downloadMemes(url, imageName) {
  const file = fs.createWriteStream(imageName);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Image downloaded as ${imageName}`);
    });
  });
}
let count = 1;

for (let url of cleanImgUrlList) {
  let imageName = '';
  if (count < 10) {
    imageName = `./memes/0${count}.jpg`;
  } else {
    imageName = `./memes/${count}.jpg`;
  }
  downloadMemes(url, imageName);
  count = count + 1;
}
