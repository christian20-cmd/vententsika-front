// components/common/ToastContainer.jsx
import React from 'react';
import ToastNotification from './ToastNotification';

const ToastContainer = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full space-y-3">
      {notifications.map((notification) => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default ToastContainer;