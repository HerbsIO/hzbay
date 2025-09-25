const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Path to JSON file of scraped listings
const filePath = './server/scripts/ebay_listings_categorizedddd.json';

// Function to make a string URL-friendly while preserving file extension
const makeUrlFriendly = (str) => {
  const ext = path.extname(str);
  const fileName = path.basename(str, ext);
  let urlFriendlyName = fileName.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');

  // Remove trailing hyphens
  urlFriendlyName = urlFriendlyName.replace(/-+$/, '');
  if(urlFriendlyName.charAt(urlFriendlyName.length) === '.') {
    urlFriendlyName = urlFriendlyName.slice(0, -1);
  }
  return urlFriendlyName + ext;
};

// Function to download an image
const downloadImage = async (url, dest) => {
  const writer = fs.createWriteStream(dest);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    if (response.status !== 200) {
      throw new Error(`Failed to download ${url}, HTTP status ${response.status}`);
    }

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    throw error; // Rethrow the error to handle it in the main script
  }
};

// Read the JSON file
fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  let jsonData;
  try {
    jsonData = JSON.parse(data);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return;
  }

  // Iterate over each category and product
  for (const category in jsonData) {
    for (const product of jsonData[category]) {
      const productName = product.shortTitle;
      const productDirName = createUrlFriendlyName(productName);
      const productDir = path.join(__dirname, 'server', 'scripts', 'images', productDirName);

      // Create a directory for the product if it doesn't exist
      if (!fs.existsSync(productDir)) {
        fs.mkdirSync(productDir, { recursive: true });
      }

      // Download each image
      for (let i = 0; i < product.images.length; i++) {
        const imageUrl = product.images[i];
        const imageName = `image${i + 1}${path.extname(imageUrl)}`;
        const imageFileName = imageName;
        
        const imageDest = path.join(productDir, imageFileName);

        try {
          await downloadImage(imageUrl, imageDest);
          console.log(`Downloaded ${imageUrl} to ${imageDest}`);
        } catch (err) {
          console.error(`Error downloading ${imageUrl}:`, err);
        }
      }
    }
  }

  console.log('All images downloaded successfully.');
});
function createUrlFriendlyName(name) {
  // Remove leading and trailing spaces, convert to lower case
  let urlFriendly = name.trim().toLowerCase();

  // Replace spaces and non-alphanumeric characters with hyphens
  urlFriendly = urlFriendly.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

  // Replace multiple hyphens with a single hyphen
  urlFriendly = urlFriendly.replace(/-+/g, '-');
  if (urlFriendly.charAt(urlFriendly.length - 1) === '.') {
    // Remove the trailing decimal point
    urlFriendly = urlFriendly.slice(0, -1);
  }
  return urlFriendly;
}
