import React from 'react';

const Logo = ({ className, height = 48 }) => {
  return (
    <svg 
      className={className} 
      height={height} 
      viewBox="0 0 500 350" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 15px rgba(212, 160, 23, 0.4))' }}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB754" />
          <stop offset="40%" stopColor="#C99B26" />
          <stop offset="70%" stopColor="#B38118" />
          <stop offset="100%" stopColor="#8A6312" />
        </linearGradient>
      </defs>

      {/* 
        EXACT GEOMETRY OF THE SARKIN MOTA 'M' FROM THE PHOTO 
        The M consists of two solid shapes divided by a diagonal gap.
        Outer bounds: x=100 to 400.
      */}
      <g transform="translate(45, 10)">
        
        {/* LEFT PIECE 
            - Left vertical edge: x=0, y=140 to 40
            - Slopes up to peak: (0,40) -> (100,0)
            - Slopes down to the gap cut: (100,0) -> (190, 80)
            - The diagonal gap cut: (190, 80) -> (130, 140)
            - Inner upward slope to inner peak: (130,140) -> (100, 110)
            - Inner vertical edge down to bottom: (100, 110) -> (100, 140)? 
              Wait, the photo doesn't have a thin leg. The leg is wide.
              Let's make the leg width = 50.
              Inner peak is at (100, 50).
        */}
        
        <path d="M 0 160 
                 L 0 50 
                 L 120 0 
                 L 220 80 
                 L 170 130 
                 L 120 90 
                 L 60 140 
                 L 60 160 Z" 
              fill="url(#goldGradient)" />

        {/* RIGHT PIECE 
            - Starts at the gap, goes under the left piece.
            - Mirrored geometry, shifted.
        */}
        <path d="M 190 150 
                 L 240 100 
                 L 290 140 
                 L 350 90 
                 L 350 160 
                 L 410 160 
                 L 410 50 
                 L 290 150 Z" 
              fill="url(#goldGradient)" />
      </g>

      <text 
        x="250" 
        y="260" 
        textAnchor="middle" 
        fill="#FFFFFF" 
        style={{ 
          fontFamily: "'Outfit', 'Arial', sans-serif", 
          fontSize: '56px', 
          fontWeight: '900', 
          letterSpacing: '10px' 
        }}
      >
        SARKINMOTA
      </text>

      <text 
        x="250" 
        y="300" 
        textAnchor="middle" 
        fill="#D4A017" 
        style={{ 
          fontFamily: "'Outfit', 'Arial', sans-serif", 
          fontSize: '26px', 
          fontWeight: '700', 
          letterSpacing: '16px' 
        }}
      >
        AUTOS
      </text>
    </svg>
  );
};

export default Logo;
