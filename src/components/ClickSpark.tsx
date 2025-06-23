
import React, { useState, useEffect } from 'react';

interface SparkProps {
  x: number;
  y: number;
  id: number;
  onComplete: (id: number) => void;
}

const Spark: React.FC<SparkProps> = ({ x, y, id, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, 600);
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: x - 10, top: y - 10 }}
    >
      <div className="relative">
        {/* Main spark */}
        <div className="absolute w-2 h-2 bg-black rounded-full animate-ping" />
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" 
             style={{ left: '2px', top: '2px' }} />
        
        {/* Radiating sparks */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-2 bg-black origin-bottom animate-pulse"
            style={{
              left: '7px',
              top: '2px',
              transform: `rotate(${i * 45}deg)`,
              animationDelay: `${i * 50}ms`,
              animationDuration: '400ms'
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface ClickSparkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const ClickSpark: React.FC<ClickSparkProps> = ({ children, className, onClick }) => {
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [sparkId, setSparkId] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    const newSpark = { id: sparkId, x, y };
    setSparks(prev => [...prev, newSpark]);
    setSparkId(prev => prev + 1);
    
    if (onClick) onClick();
  };

  const removeSpark = (id: number) => {
    setSparks(prev => prev.filter(spark => spark.id !== id));
  };

  return (
    <>
      <div className={className} onClick={handleClick}>
        {children}
      </div>
      {sparks.map(spark => (
        <Spark
          key={spark.id}
          x={spark.x}
          y={spark.y}
          id={spark.id}
          onComplete={removeSpark}
        />
      ))}
    </>
  );
};

export default ClickSpark;
