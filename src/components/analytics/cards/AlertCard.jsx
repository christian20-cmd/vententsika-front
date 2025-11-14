const AlertCard = ({ title, items, type = 'warning' }) => {
  const getTypeStyles = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '🚨';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getTypeStyles(type)}`}>
      <div className="flex items-center mb-3">
        <span className="text-lg mr-2">{getTypeIcon(type)}</span>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-700">{item.name}</span>
            <span className={`font-medium ${
              type === 'warning' ? 'text-yellow-700' : 
              type === 'error' ? 'text-red-700' : 'text-blue-700'
            }`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertCard;