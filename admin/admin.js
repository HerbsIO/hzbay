const path = require('path');
const multer = require('multer');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const checkPasscode = require('./passcodeAuth');
const PASSCODE = '1234';

let listings = require('../listings_categorized.json');
let sources = require('./sources.json');
const { v4: uuidv4 } = require('uuid');


function decodeString(encodedStr) {
  // Initialize default values
  let color = null;
  const sizesPricesObj = {};

  // Split the string by ';'
  const segments = encodedStr.split(';').filter(Boolean);

  // Iterate through each segment to parse attributes
  segments.forEach(segment => {
    if (segment.startsWith('color=')) {
      // Extract color information
      const colorPart = segment.replace(/^color=/, '');
      const colorPairs = colorPart.split(',');
      colorPairs.forEach(pair => {
        const [colorName, price] = pair.split(':');
        if (price) {
          sizesPricesObj[colorName] = parseFloat(price);
        }
      });
      // Set color to the first color name found (if applicable)
      if (colorPairs.length > 0) {
        color = colorPairs[0].split(':')[0]; // Get the first color name
      }
    } else if (segment.startsWith('sizes=')) {
      // Extract sizes and prices
      const sizesPart = segment.replace(/^sizes=/, '');
      const sizesPairs = sizesPart.split(',');
      sizesPairs.forEach(pair => {
        const [size, price] = pair.split(':');
        if (size && price) {
          sizesPricesObj[size] = parseFloat(price);
        }
      });
    }
  });

  // Return the resulting object
  return {
    color: color,
    sizesPrices: sizesPricesObj
  };
}
// Middleware to ensure only users with the passcode can access these routes
router.use(checkPasscode);

// Route to display the admin page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin', 'index.html'));
});

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productTitle = req.body.title;
    const uploadDir = path.join(__dirname, '../web/public/images', sanitizeFilename(productTitle));
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const productDir = sanitizeFilename(req.body.title);
    const files = fs.readdirSync(path.join(__dirname, '../web/public/images', productDir));
    const index = files.filter(file => file.startsWith('image')).length + 1;
    cb(null, `image${index}${ext}`);
  }
});

// Initialize multer instance with the configuration
const upload = multer({ storage: storage });

// Route to add a new product
router.post('/add-product', upload.array('file', 10), (req, res) => {
  const newProduct = req.body;
  newProduct.images = [];
  
  if (!listings[newProduct.category]) {
    listings[newProduct.category] = [];
  }
  if(newProduct.id === '') {
    newProduct.id = uuidv4();
  }
  if(req.files) {

    const uploadedFiles = req.files.map(file => `/${sanitizeFilename(req.body.title)}/${file.filename}`);
    console.log(uploadedFiles);
  
    newProduct.images = uploadedFiles;
  
  }
  if(newProduct.options != '')
    newProduct.options = decodeString(newProduct.options);
  listings[newProduct.category].push(newProduct);
  const sourceObj = {id: newProduct.id, title: newProduct.title, sourceUrl: newProduct.sourceUrl, sourcePrice: newProduct.sourcePrice};
  sources[newProduct.category] = [...sources[newProduct.category], sourceObj];
  delete newProduct.sourcePrice;
  delete newProduct.sourceUrl;
  

  fs.writeFileSync(path.join(__dirname, '../listings_categorized.json'), JSON.stringify(listings, null, 2));
  res.redirect('/admin?passcode=' + encodeURIComponent(PASSCODE));
});

// Route to edit a product
router.post('/edit-product/:id', upload.array('file', 10), (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;
  const category = updatedProduct.category;
  
  if (!listings[category]) {
    return res.status(404).send('Category not found');
  }

  const productIndex = listings[category].findIndex(product => product.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }

  const existingProduct = listings[category][productIndex];
  delete updatedProduct.sourcePrice;
  delete updatedProduct.sourceUrl;

  if(req.files) {

    const uploadedFiles = req.files.map(file => `/${sanitizeFilename(req.body.title)}/${file.filename}`);
    console.log(uploadedFiles);
  
    updatedProduct.images = uploadedFiles;
  
  }
  listings[category][productIndex] = {
    ...updatedProduct,
  };
  fs.writeFileSync(path.join(__dirname, '../listings_categorized.json'), JSON.stringify(listings, null, 2));
  res.redirect('/admin?passcode=' + encodeURIComponent(PASSCODE));
});

// Route to delete a product
router.post('/delete-product/:id', (req, res) => {
  const productId = req.params.id;
  
  for (const category in listings) {
    const productIndex = listings[category].findIndex(product => product.id === productId);
    
    if (productIndex !== -1) {
      listings[category].splice(productIndex, 1);
      fs.writeFileSync(path.join(__dirname, '../listings_categorized.json'), JSON.stringify(listings, null, 2));
      break;
    }
  }
  
  res.redirect('/admin?passcode=' + encodeURIComponent(PASSCODE));
});

// Handle POST request to upload images
router.post('/upload-images', upload.array('file', 5), (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Uploaded Files:', req.files);

  const productId = req.body.id;
  const category = req.body.category;

  if (!listings[category]) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const productIndex = listings[category].findIndex(product => product.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingProduct = listings[category][productIndex];
  const uploadedFiles = req.files.map(file => `${sanitizeFilename(req.body.title)}/${file.filename}`);
  console.log(uploadedFiles);
  
  if(existingProduct.id === '') {
    existingProduct.id = uuidv4();
  }

  existingProduct.images = existingProduct.images.concat(uploadedFiles);
  fs.writeFileSync(path.join(__dirname, '../listings_categorized.json'), JSON.stringify(listings, null, 2));

  res.status(200).json({ message: 'Files uploaded successfully', files: uploadedFiles });
});

// Function to sanitize filename (remove unwanted characters)
function sanitizeFilename(filename) {
  return filename.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
}

module.exports = router;
