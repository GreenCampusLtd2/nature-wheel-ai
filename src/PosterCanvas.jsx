import React from 'react';

// Converts a month (0-11) and ring index (0-3) to cartesian coordinates within the SVG
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const PosterCanvas = ({ data }) => {
  const center = 1000;
  const radiusSteps = [400, 550, 750, 950];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="poster-canvas-container" style={{ width: '100%', height: 'auto', background: '#f4ebd8', padding: '20px', borderRadius: '12px', overflow: 'hidden' }}>
      <svg viewBox="0 0 2000 2000" width="100%" height="100%" style={{ background: '#fcf8f2', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        {/* Background Texture/Aesthetic */}
        <defs>
          <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb347" />
            <stop offset="100%" stopColor="#ffcc33" />
          </radialGradient>
          <clipPath id="circle-clip">
            <circle cx="0" cy="0" r="50" />
          </clipPath>
        </defs>

        {/* Rings */}
        {radiusSteps.map((r, i) => (
          <circle key={`ring-${i}`} cx={center} cy={center} r={r} fill="none" stroke="#e0d5c1" strokeWidth="2" strokeDasharray="10 10" />
        ))}

        {/* Month Dividers & Labels */}
        {months.map((month, i) => {
          const angle = i * 30;
          const outerPoint = polarToCartesian(center, center, 1000, angle);
          const labelPoint = polarToCartesian(center, center, 980, angle + 15);
          return (
            <g key={`month-${i}`}>
              <line x1={center} y1={center} x2={outerPoint.x} y2={outerPoint.y} stroke="#e0d5c1" strokeWidth="2" strokeDasharray="5 5" />
              <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" transform={`rotate(${angle + 15}, ${labelPoint.x}, ${labelPoint.y})`} fill="#8a7a63" fontSize="24" fontWeight="bold" letterSpacing="2">
                {month.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Center Sun */}
        <circle cx={center} cy={center} r={120} fill="url(#sun-grad)" stroke="#d99b22" strokeWidth="4" />
        <text x={center} y={center + 10} textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold" letterSpacing="4">SUN</text>

        {/* Render Data Items */}
        {data && data.map((item, index) => {
          // item: { name, description, startMonth, endMonth, ring, imageUrl }
          const angle = (item.startMonth * 30) + 15; // Center of the month
          const r = radiusSteps[item.ring] - 75; 
          const point = polarToCartesian(center, center, r, angle);
          
          return (
            <g key={`item-${index}`} transform={`translate(${point.x}, ${point.y})`}>
              {/* Image Node */}
              {item.imageUrl && (
                <image href={item.imageUrl} x="-50" y="-50" width="100" height="100" preserveAspectRatio="xMidYMid slice" clipPath="url(#circle-clip)" />
              )}
              {/* Text Node */}
              <text x="0" y="70" textAnchor="middle" fill="#2c3e50" fontSize="18" fontWeight="bold">{item.name}</text>
              <text x="0" y="90" textAnchor="middle" fill="#555" fontSize="14" width="120">{item.description}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default PosterCanvas;
