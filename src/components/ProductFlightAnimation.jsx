// components/ProductFlightAnimation.jsx
import React, { useEffect, useState } from 'react';

const ProductFlightAnimation = ({ 
  product, 
  startPosition, 
  endPosition, 
  onAnimationComplete 
}) => {
  const [position, setPosition] = useState(startPosition);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const duration = 800; // ms
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Courbe d'animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      // Calcul de la position actuelle
      const currentX = startPosition.x + (endPosition.x - startPosition.x) * easeOut;
      const currentY = startPosition.y + (endPosition.y - startPosition.y) * easeOut;
      
      // Effet de "flottement" (légère courbe vers le haut)
      const floatEffect = Math.sin(progress * Math.PI) * 30;
      const finalY = currentY - floatEffect;

      setPosition({ x: currentX, y: finalY });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setTimeout(() => {
          onAnimationComplete();
        }, 200);
      }
    };

    requestAnimationFrame(animate);
  }, [startPosition, endPosition, isAnimating, onAnimationComplete]);

  if (!isAnimating || !product) return null;

  return (
    <div
      className="fixed z-[100] pointer-events-none transition-all duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-2 transform scale-75">
        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {product.image_principale ? (
            <img
              src={product.image_principale}
              alt={product.nom_produit}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-xs text-center">
              📦
            </div>
          )}
        </div>
        <div className="mt-1 text-xs font-medium text-gray-700 text-center max-w-[80px] truncate">
          {product.nom_produit}
        </div>
      </div>
    </div>
  );
};

export default ProductFlightAnimation;