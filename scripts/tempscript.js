const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

//Temp file for simple scripts on the go

const listings = require('../listings_categorized.json');
let newData = {};
Object.values(listings).flat().forEach((l) => {
    const o = { ...l }; // Create a shallow copy of the listing object
    o.category = l.category;
    encodeURIComponent()
    if (!newData[l.category]) {
        newData[l.category] = [];
    }
    if(!o.id){
        o.id = uuidv4();
    }
    console.log(`https://www.hz-bay.com/product/${encodeURIComponent(o.title.length > 20 ? o.title.substring(0, 20):o.title)}`);
    newData[l.category].push(o);
});
// fs.writeFile(__dirname + "/listings_categorized.json", JSON.stringify(newData, null, 2), 'utf8', (err) => {
//     if (err) {
//         console.error('Error writing updated JSON:', err);
//         return;
//     }
//     console.log(`Successfully updated JSON file with new image paths`);
// });




// Generate a UUID
const myUUID = uuidv4();

// Print the generated UUID
console.log('Generated UUID:', myUUID);