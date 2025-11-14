// hooks/useToast.js
import { useState, useCallback } from 'react';

let idCounter = 0;

export const useToast = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = ++idCounter;
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove if duration is set
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const success = useCallback((title, message, options = {}) => {
    return addNotification({ 
      type: 'success', 
      title, 
      message, 
      ...options 
    });
  }, [addNotification]);

  const error = useCallback((title, message, options = {}) => {
    return addNotification({ 
      type: 'error', 
      title, 
      message, 
      ...options 
    });
  }, [addNotification]);

  const warning = useCallback((title, message, options = {}) => {
    return addNotification({ 
      type: 'warning', 
      title, 
      message, 
      ...options 
    });
  }, [addNotification]);

  const info = useCallback((title, message, options = {}) => {
    return addNotification({ 
      type: 'info', 
      title, 
      message, 
      ...options 
    });
  }, [addNotification]);

  return {
    notifications,
    removeNotification,
    success,
    error,
    warning,
    info
  };
};