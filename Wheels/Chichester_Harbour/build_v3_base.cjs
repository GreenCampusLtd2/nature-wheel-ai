const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync('massive_species_data.json', 'utf-8');
const data = JSON.parse(rawData);

const center = 4000;
const radiusSteps = [1500, 2200, 2900, 3600];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
};

// We will force-cycle these 10 available assets so every single slot has an image for the AI to trace!
const availableAssets = [
  "species_assets/brent_goose.png",
  "species_assets/harbour_seal.png",
  "species_assets/sea_kale.png",
  "species_assets/roe_deer.png",
  "species_assets/common_tern.png",
  "species_assets/cuttlefish.png",
  "species_assets/sea_aster.png",
  "species_assets/glasswort.png",
  "species_assets/sea_purslane.png",
  "species_assets/marram_grass.png"
];

let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="8000" height="8000" viewBox="0 0 8000 8000" style="background-color:#f4ebd8; font-family:Georgia, serif;">
  <defs>
    <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffb347" />
      <stop offset="100%" stop-color="#ffcc33" />
    </radialGradient>
    <clipPath id="circle-clip">
      <circle cx="0" cy="0" r="100" />
    </clipPath>
    <filter id="shadow">
      <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000" flood-opacity="0.1" />
    </filter>
  </defs>

  <!-- Month Dividers -->
`;

months.forEach((month, i) => {
  const angle = i * 30;
  const outerPoint = polarToCartesian(center, center, 3900, angle);
  const labelPoint = polarToCartesian(center, center, 3950, angle + 15);
  
  svgContent += `  <line x1="${center}" y1="${center}" x2="${outerPoint.x}" y2="${outerPoint.y}" stroke="#d4c5b0" stroke-width="4" stroke-dasharray="20 20" />\n`;
  svgContent += `  <text x="${labelPoint.x}" y="${labelPoint.y}" text-anchor="middle" transform="rotate(${angle + 15}, ${labelPoint.x}, ${labelPoint.y})" fill="#7a6b53" font-size="80" font-weight="bold" letter-spacing="8">${month.toUpperCase()}</text>\n`;
});

radiusSteps.forEach((r, i) => {
  svgContent += `  <circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="#d4c5b0" stroke-width="4" />\n`;
});

svgContent += `  <circle cx="${center}" cy="${center}" r="${500}" fill="url(#sun-grad)" stroke="#d99b22" stroke-width="12" filter="url(#shadow)" />\n`;
svgContent += `  <text x="${center}" y="${center + 30}" text-anchor="middle" fill="#fff" font-size="120" font-weight="bold" letter-spacing="12">CHICHESTER</text>\n`;

let renderIndex = 0;

data.forEach((item, idx) => {
  const spreadOffsetAngle = (renderIndex % 5) * 5 - 10; 
  const spreadOffsetRadius = (renderIndex % 3) * 150 - 150;

  const angle = (item.startMonth * 30) + 15 + spreadOffsetAngle;
  const r = radiusSteps[item.ring] - 250 + spreadOffsetRadius; 
  const point = polarToCartesian(center, center, r, angle);
  
  // Cycle the 10 available images across all 100 slots so the SVG is visually packed
  const imageUrl = availableAssets[idx % availableAssets.length];

  svgContent += `  <g transform="translate(${point.x}, ${point.y})">\n`;
  svgContent += `    <image href="${imageUrl}" x="-100" y="-100" width="200" height="200" clip-path="url(#circle-clip)" preserveAspectRatio="xMidYMid slice" filter="url(#shadow)" />\n`;
  svgContent += `    <circle cx="0" cy="0" r="100" fill="none" stroke="#fff" stroke-width="8" />\n`;
  svgContent += `    <text x="0" y="140" text-anchor="middle" fill="#2c3e50" font-size="32" font-weight="bold">${item.name.replace('&', '&amp;')}</text>\n`;
  
  const words = item.description.split(' ');
  let line1 = words.slice(0, Math.ceil(words.length/2)).join(' ');
  let line2 = words.slice(Math.ceil(words.length/2)).join(' ');
  svgContent += `    <text x="0" y="180" text-anchor="middle" fill="#555" font-size="24">${line1.replace('&', '&amp;')}</text>\n`;
  if (line2) {
      svgContent += `    <text x="0" y="215" text-anchor="middle" fill="#555" font-size="24">${line2.replace('&', '&amp;')}</text>\n`;
  }
  svgContent += `  </g>\n`;
  renderIndex++;
});

svgContent += `</svg>`;

fs.writeFileSync('v3_base_100_images.svg', svgContent);
console.log('Successfully generated v3_base_100_images.svg!');
