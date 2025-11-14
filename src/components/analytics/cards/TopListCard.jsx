const TopListCard = ({ title, items, columns }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
            <div className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-3">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                {item.description && (
                  <p className="text-sm text-gray-500">{item.description}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              {columns.map((column, colIndex) => (
                <div key={colIndex}>
                  <span className="font-semibold text-gray-900">
                    {typeof item[column.key] === 'number' 
                      ? item[column.key].toLocaleString() 
                      : item[column.key]
                    }
                  </span>
                  {column.suffix && (
                    <span className="text-sm text-gray-500 ml-1">{column.suffix}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopListCard;