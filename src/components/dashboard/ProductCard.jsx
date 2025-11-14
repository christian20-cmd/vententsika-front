import React from 'react';

const ProductCard = ({ product, quantity, revenue, index }) => (
  <div 
    className="bg-white rounded-lg p-4 shadow border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-900 truncate">{product}</h4>
      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
        {quantity} unités
      </span>
    </div>
    <p className="text-lg font-bold text-gray-900">€{revenue.toLocaleString('fr-FR')}</p>
    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
      <div 
        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
        style={{ width: `${(quantity / 50) * 100}%` }}
      ></div>
    </div>
  </div>
);

export default ProductCard;