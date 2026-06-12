const fs = require('fs');

const data = [
  { name: "Brent Goose", description: "Peak overwintering season. Tens of thousands settled.", startMonth: 0, endMonth: 2, ring: 2, image: "species_assets/brent_goose.png" },
  { name: "Common Seal", description: "Pupping season begins on the harbour mudflats.", startMonth: 5, endMonth: 7, ring: 3, image: "species_assets/harbour_seal.png" },
  { name: "Sea Kale", description: "Transitions from flowering to green seed pods.", startMonth: 4, endMonth: 6, ring: 0, image: "species_assets/sea_kale.png" },
  { name: "Roe Deer", description: "Fawns are born in surrounding woodlands.", startMonth: 4, endMonth: 5, ring: 1, image: "species_assets/roe_deer.png" },
  { name: "Common Tern", description: "Actively nesting and establishing breeding territories.", startMonth: 4, endMonth: 5, ring: 2, image: "species_assets/common_tern.png" },
  { name: "Cuttlefish", description: "Migrating into shallow waters to breed.", startMonth: 3, endMonth: 7, ring: 3, image: "species_assets/cuttlefish.png" }
];

const center = 1500;
const radiusSteps = [500, 750, 1000, 1250];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
};

let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="3000" viewBox="0 0 3000 3000" style="background-color:#f4ebd8; font-family:Georgia, serif;">
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

// Draw month lines and labels
months.forEach((month, i) => {
  const angle = i * 30;
  const outerPoint = polarToCartesian(center, center, 1400, angle);
  const labelPoint = polarToCartesian(center, center, 1450, angle + 15);
  
  svgContent += `  <line x1="${center}" y1="${center}" x2="${outerPoint.x}" y2="${outerPoint.y}" stroke="#d4c5b0" stroke-width="2" stroke-dasharray="10 10" />\n`;
  svgContent += `  <text x="${labelPoint.x}" y="${labelPoint.y}" text-anchor="middle" transform="rotate(${angle + 15}, ${labelPoint.x}, ${labelPoint.y})" fill="#7a6b53" font-size="32" font-weight="bold" letter-spacing="4">${month.toUpperCase()}</text>\n`;
});

// Draw rings
radiusSteps.forEach((r, i) => {
  svgContent += `  <circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="#d4c5b0" stroke-width="2" />\n`;
});

// Center Sun
svgContent += `  <circle cx="${center}" cy="${center}" r="${200}" fill="url(#sun-grad)" stroke="#d99b22" stroke-width="6" filter="url(#shadow)" />\n`;
svgContent += `  <text x="${center}" y="${center + 15}" text-anchor="middle" fill="#fff" font-size="48" font-weight="bold" letter-spacing="6">CHICHESTER</text>\n`;

// Draw Items
data.forEach((item, index) => {
  const angle = (item.startMonth * 30) + 15;
  const r = radiusSteps[item.ring] - 125; 
  const point = polarToCartesian(center, center, r, angle);
  
  svgContent += `  <g transform="translate(${point.x}, ${point.y})">\n`;
  svgContent += `    <image href="${item.image}" x="-100" y="-100" width="200" height="200" clip-path="url(#circle-clip)" preserveAspectRatio="xMidYMid slice" filter="url(#shadow)" />\n`;
  svgContent += `    <circle cx="0" cy="0" r="100" fill="none" stroke="#fff" stroke-width="4" />\n`;
  svgContent += `    <text x="0" y="130" text-anchor="middle" fill="#2c3e50" font-size="28" font-weight="bold">${item.name}</text>\n`;
  // Wrap text roughly
  const words = item.description.split(' ');
  let line1 = words.slice(0, Math.ceil(words.length/2)).join(' ');
  let line2 = words.slice(Math.ceil(words.length/2)).join(' ');
  svgContent += `    <text x="0" y="160" text-anchor="middle" fill="#555" font-size="20">${line1}</text>\n`;
  svgContent += `    <text x="0" y="185" text-anchor="middle" fill="#555" font-size="20">${line2}</text>\n`;
  svgContent += `  </g>\n`;
});

svgContent += `</svg>`;

fs.writeFileSync('composite_poster.svg', svgContent);
console.log('Successfully generated composite_poster.svg');
