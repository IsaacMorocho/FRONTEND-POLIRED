import { useEffect, useRef } from 'react';
import './ShineBorder.css';

const ShineBorder = ({ 
  children, 
  shineColor = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
  borderRadius = 24,
  className = ""
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateMousePosition = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const gradientStops = shineColor.map((color, index) => {
    const percentage = (index / (shineColor.length - 1)) * 100;
    return `${color} ${percentage}%`;
  }).join(', ');

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-[${borderRadius}px] ${className}`}
      style={{
        '--gradient-stops': gradientStops,
        '--border-radius': `${borderRadius}px`,
      }}
    >
      {/* Shine Border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `conic-gradient(from var(--mouse-x, 50%) at var(--mouse-y, 50%), var(--gradient-stops))`,
          borderRadius: `${borderRadius}px`,
          padding: '2px',
        }}
      >
        <div
          className="absolute inset-0 bg-slate-900 dark:bg-slate-900"
          style={{
            borderRadius: `${borderRadius - 2}px`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ShineBorder;
