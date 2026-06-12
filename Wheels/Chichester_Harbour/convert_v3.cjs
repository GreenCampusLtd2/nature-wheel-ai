const sharp = require('sharp');

sharp('v3_base_100_images.svg')
  .png()
  .toFile('v3_base_100_images.png')
  .then(info => {
    console.log("SVG converted to PNG successfully!", info);
  })
  .catch(err => {
    console.error("Error converting SVG to PNG:", err);
  });
