// components/ErrorDisplay.jsx
import React from 'react';

export const ErrorDisplay = ({ error, onRetry, onClose }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-red-800 font-medium mb-2">Erreur lors de l'opération</p>
          <div className="text-red-700 text-sm whitespace-pre-line">
            {error.split('\n').map((line, index) => (
              <p key={index} className={index > 0 ? 'mt-1' : ''}>
                {line}
              </p>
            ))}
          </div>
          <div className="mt-3 flex space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-2xl text-sm hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-2xl text-sm hover:bg-red-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};