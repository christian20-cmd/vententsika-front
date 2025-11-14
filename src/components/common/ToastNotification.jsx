// components/common/ToastNotification.jsx
import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X,
  ShoppingCart,
  User
} from 'lucide-react';

const ToastNotification = ({ 
  notification, 
  onClose 
}) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (notification.duration) {
      const interval = 50;
      const totalSteps = notification.duration / interval;
      const step = 100 / totalSteps;

      const progressTimer = setInterval(() => {
        setProgress(prev => Math.max(0, prev - step));
      }, interval);

      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressTimer);
      };
    }
  }, [notification.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'cart':
        return <ShoppingCart className="h-5 w-5 text-purple-500" />;
      case 'user':
        return <User className="h-5 w-5 text-indigo-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'cart':
        return 'bg-purple-50 border-purple-200';
      case 'user':
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`
      relative flex items-start w-96 p-4 mb-3 rounded-2xl border-2 shadow-lg
      transform transition-all duration-300 ease-in-out
      ${isLeaving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      ${getBackgroundColor()}
      hover:shadow-xl hover:scale-105
    `}>
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">
            {notification.title}
          </p>
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {notification.message}
        </p>
        
        {/* Progress Bar */}
        {notification.duration && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
            <div 
              className="h-1 rounded-full bg-gray-400 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ToastNotification;