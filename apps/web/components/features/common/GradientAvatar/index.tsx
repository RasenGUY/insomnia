import React, { useMemo } from 'react';

interface GradientAvatarProps {
  seed?: string;
  size?: number;
  className?: string;
}

const generateColors = (seed: string) => {
  const hash = Array.from(seed).reduce(
    (hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0
  );
  
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40 + (hash % 180)) % 360;
  
  return [
    `hsl(${hue1}, 70%, 60%)`,
    `hsl(${hue2}, 70%, 60%)`
  ];
};

export const GradientAvatar: React.FC<GradientAvatarProps> = ({
  seed = Math.random().toString(),
  size = 40,
  className = ''
}) => {
  const [color1, color2] = useMemo(() => generateColors(seed), [seed]);
  const gradientId = useMemo(() => `gradient-${seed.replace(/\W/g, '')}`, [seed]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: color1 }} />
          <stop offset="100%" style={{ stopColor: color2 }} />
        </linearGradient>
      </defs>
      <circle
        cx="40"
        cy="40"
        r="38"
        fill={`url(#${gradientId})`}
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
};
