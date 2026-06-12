const sharp = require('sharp');
const fs = require('fs');

sharp('layout_text_only.svg')
  .png()
  .toFile('layout_text_only.png')
  .then(info => {
    console.log("SVG converted to PNG successfully!", info);
  })
  .catch(err => {
    console.error("Error converting SVG to PNG:", err);
  });
