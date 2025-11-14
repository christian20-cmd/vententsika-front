import LineChart from '../charts/LineChart';

const SalesTrends = ({ data }) => {
  // Transformer les données pour le chart
  const chartData = {
    labels: data?.donnees_quotidiennes?.map(item => 
      new Date(item.date).toLocaleDateString()
    ) || [],
    values: data?.donnees_quotidiennes?.map(item => item.revenue) || [],
    datasetLabel: 'Chiffre d\'Affaires (€)'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tendances des Ventes</h2>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            data?.tendance_generale === 'positive' 
              ? 'bg-green-100 text-green-800'
              : data?.tendance_generale === 'negative'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            Tendance: {data?.tendance_generale || 'stable'}
          </span>
        </div>
      </div>
      
      <div className="h-80">
        <LineChart 
          data={chartData} 
          title="Évolution du Chiffre d'Affaires Quotidien" 
        />
      </div>
    </div>
  );
};

export default SalesTrends;