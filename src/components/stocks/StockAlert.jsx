import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X, AlertTriangle, Info } from 'lucide-react';

const StockAlert = ({ error, success, onClearError, onClearSuccess }) => {
  // Auto-dismiss success messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClearSuccess?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, onClearSuccess]);

  if (!error && !success) {
    return null;
  }

  const getAlertConfig = () => {
    if (error) {
      return {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-400',
        buttonColor: 'text-red-500 hover:bg-red-100',
        onClear: onClearError,
        message: error
      };
    }
    
    if (success) {
      return {
        icon: CheckCircle2,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-400',
        buttonColor: 'text-green-500 hover:bg-green-100',
        onClear: onClearSuccess,
        message: success
      };
    }
  };

  const alertConfig = getAlertConfig();
  if (!alertConfig) return null;

  const IconComponent = alertConfig.icon;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-top duration-300">
      <div className={`rounded-lg border ${alertConfig.borderColor} ${alertConfig.bgColor} p-4 shadow-lg`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={`h-5 w-5 ${alertConfig.iconColor}`} aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${alertConfig.textColor}`}>
              {alertConfig.message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className={`inline-flex rounded-md p-1.5 transition-colors ${alertConfig.buttonColor}`}
              onClick={alertConfig.onClear}
            >
              <span className="sr-only">Fermer</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAlert;