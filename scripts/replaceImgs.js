const fs = require('fs');
const path = require('path');

const baseDir = './server/scripts/images'; // Base directory containing image directories
const jsonDataPath = './server/scripts/ebay_listings_categorized.json'; // Path to JSON data file

// Read JSON data
fs.readFile(jsonDataPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON data:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);

        // Create a mapping object to store current directory names and expected names
        let directoryMapping = {};

        // Iterate through each category in the JSON data
        Object.keys(jsonData).forEach(category => {
            // Iterate through each item in the current category
            jsonData[category].forEach((item, index) => {
                // Construct the expected directory name
                let expectedDirName = createUrlFriendlyName(item.shortTitle);
                let currentDirName = `item_${index + 1}`;

                // Construct the current and new directory paths
                let currentDirPath = path.join(baseDir, currentDirName);
                let newDirPath = path.join(baseDir, expectedDirName);

                // Store the mapping
                directoryMapping[currentDirPath] = newDirPath;

                // Update the images paths in the JSON data to match the new directory structure
                let newImages = [];
                item.images.forEach((img, imgIndex) => {
                    let imageName = `image${imgIndex + 1}.webp`;
                    let imagePath = `/${expectedDirName}/${imageName}`;
                    newImages.push(imagePath);
                });

                // Update the images array in the JSON data
                jsonData[category][index]['images'] = newImages;
            });
        });

        // Write the updated JSON data back to the file
        fs.writeFile(jsonDataPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing updated JSON:', err);
                return;
            }
            console.log(`Successfully updated JSON file with new image paths`);
        });

        // Rename directories to match expected names
        Object.keys(directoryMapping).forEach(currentDirPath => {
            let newDirPath = directoryMapping[currentDirPath];
            if (currentDirPath !== newDirPath) {
                fs.rename(currentDirPath, newDirPath, err => {
                    if (err) {
                        console.error(`Error renaming directory ${currentDirPath}:`, err);
                    } else {
                        console.log(`Successfully renamed directory ${currentDirPath} to ${newDirPath}`);
                    }
                });
            }
        });

    } catch (error) {
        console.error('Error parsing JSON data:', error);
    }
});

function createUrlFriendlyName(name) {
    // Remove leading and trailing spaces, convert to lower case
    let urlFriendly = name.trim().toLowerCase();

    // Replace spaces and non-alphanumeric characters with hyphens
    urlFriendly = urlFriendly.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

    // Replace multiple hyphens with a single hyphen
    urlFriendly = urlFriendly.replace(/-+/g, '-');
    urlFriendly = urlFriendly.replace('.', '');
    return urlFriendly;
}
