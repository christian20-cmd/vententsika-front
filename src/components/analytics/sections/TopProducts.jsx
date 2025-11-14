import BarChart from '../charts/BarChart';
import TopListCard from '../cards/TopListCard';

const TopProducts = ({ data }) => {
  // Données pour le bar chart
  const chartData = {
    labels: data?.map(item => item.produit) || [],
    values: data?.map(item => item.revenu_total) || [],
    datasetLabel: 'Revenu Total (€)'
  };

  // Colonnes pour la liste
  const columns = [
    { key: 'quantite_vendue', suffix: 'unités' },
    { key: 'revenu_total', suffix: '€' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Graphique */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Produits les Plus Performants
        </h3>
        <div className="h-64">
          <BarChart 
            data={chartData} 
            title="Revenu par Produit" 
          />
        </div>
      </div>

      {/* Liste */}
      <TopListCard
        title="Top 5 Produits"
        items={data?.map(item => ({
          name: item.produit,
          quantite_vendue: item.quantite_vendue,
          revenu_total: item.revenu_total
        })) || []}
        columns={columns}
      />
    </div>
  );
};

export default TopProducts;