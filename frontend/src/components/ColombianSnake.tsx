import React, { useLayoutEffect, useRef, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface ColombianSnakeProps {
  targetRef: React.RefObject<HTMLElement>;
  isHovered: boolean;
}

/**
 * Final version with a seamless Framer Motion animation loop and a refined
 * color gradient for a smoother fade-out effect.
 */
const ColombianSnake: React.FC<ColombianSnakeProps> = ({ targetRef, isHovered }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [totalLength, setTotalLength] = useState(0);

  useLayoutEffect(() => {
    const targetElement = targetRef.current;
    const svgElement = svgRef.current;
    const visiblePath = pathRef.current;

    if (!targetElement || !svgElement || !visiblePath) return;

    const drawPath = () => {
        const padding = 20;
        const rect = targetElement.getBoundingClientRect();
        const style = getComputedStyle(targetElement);
        const borderRadius = parseFloat(style.borderRadius) || 0;

        svgElement.style.width = `${rect.width + padding * 2}px`;
        svgElement.style.height = `${rect.height + padding * 2}px`;
        const parentRect = (targetElement.offsetParent || document.body).getBoundingClientRect();
        svgElement.style.left = `${rect.left - parentRect.left - padding}px`;
        svgElement.style.top = `${rect.top - parentRect.top - padding}px`;
        svgElement.setAttribute('viewBox', `0 0 ${rect.width + padding * 2} ${rect.height + padding * 2}`);

        const pathWidth = rect.width;
        const pathHeight = rect.height;
        const r = Math.min(borderRadius, pathWidth / 2, pathHeight / 2);
        const pathData = `M ${padding + pathWidth / 2} ${padding + pathHeight} L ${padding + r} ${padding + pathHeight} A ${r} ${r} 0 0 1 ${padding} ${padding + pathHeight - r} L ${padding} ${padding + r} A ${r} ${r} 0 0 1 ${padding + r} ${padding} L ${padding + pathWidth - r} ${padding} A ${r} ${r} 0 0 1 ${padding + pathWidth} ${padding + r} L ${padding + pathWidth} ${padding + pathHeight - r} A ${r} ${r} 0 0 1 ${padding + pathWidth - r} ${padding + pathHeight} Z`;
        
        visiblePath.setAttribute('d', pathData);

        const length = visiblePath.getTotalLength();
        setTotalLength(length);
        visiblePath.style.strokeDasharray = `1200 ${length}`;
    }

    const resizeObserver = new ResizeObserver(drawPath);
    resizeObserver.observe(targetElement);
    drawPath();

    return () => resizeObserver.disconnect();
  }, [targetRef]);

  const transition = { type: "spring", stiffness: 400, damping: 30 };

  return (
    <motion.svg
      ref={svgRef}
      style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, overflow: 'visible' }}
      animate={{ filter: isHovered ? 'drop-shadow(0 0 3px #f7e600)' : 'drop-shadow(0 0 1px transparent)' }}
      transition={transition}
    >
      <defs>
        {/* New Gradient: 40% Yellow, 20% Blue, 20% Red, 20% Transparent */}
        <linearGradient id="colombian-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0">
          <stop offset="0%" stopColor="#FFFF00" />
          <stop offset="40%" stopColor="#003893" />
          <stop offset="60%" stopColor="#CE1126" />
          <stop offset="80%" stopColor="#CE1126" stopOpacity="1" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        ref={pathRef}
        d=""
        fill="none"
        stroke="url(#colombian-gradient)"
        strokeLinecap="round"
        animate={{
          strokeWidth: isHovered ? 4 : 3,
          strokeDashoffset: [totalLength, 0],
        }}
        transition={{
          strokeWidth: { type: "spring", stiffness: 400, damping: 30 },
          // Updated transition for a seamless, continuous loop
          strokeDashoffset: {
            duration: 8,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }
        }}
      />
    </motion.svg>
  );
};

export default ColombianSnake;