import React from 'react';

export default function TextLogo({ className, scale = 1, showAutos = true }) {
  // Responsive sizes that scale perfectly on mobile and desktop
  const mainSize = `calc(clamp(18px, 5vw, 32px) * ${scale})`;
  const subSize = `calc(clamp(8px, 2vw, 12px) * ${scale})`;
  
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ 
        fontFamily: "'Outfit', sans-serif", 
        fontSize: mainSize, 
        fontWeight: '900', 
        letterSpacing: '0.15em',
        background: 'linear-gradient(to bottom, #FFD700 0%, #D4A017 50%, #B8860B 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
        textShadow: '0 2px 10px rgba(212, 160, 23, 0.2)'
      }}>
        SARKINMOTA
      </span>
      {showAutos && (
        <span style={{ 
          fontFamily: "'Outfit', sans-serif", 
          fontSize: subSize, 
          fontWeight: '700', 
          letterSpacing: '0.5em',
          color: '#D4A017',
          marginTop: `${4 * scale}px`,
          paddingLeft: '0.5em',
          textTransform: 'uppercase'
        }}>
          AUTOS
        </span>
      )}
    </div>
  );
}
