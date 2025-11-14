import MetricCard from '../cards/MetricCard';

const MainMetrics = ({ data }) => {
  const metrics = [
    {
      title: 'Chiffre d\'Affaires',
      value: data?.chiffre_affaires?.valeur || 0,
      growth: data?.chiffre_affaires?.croissance || 0,
      trend: data?.chiffre_affaires?.tendance || 'stable',
      icon: '💰'
    },
    {
      title: 'Commandes Total',
      value: data?.commandes_total?.valeur || 0,
      growth: data?.commandes_total?.croissance || 0,
      trend: data?.commandes_total?.tendance || 'stable',
      icon: '📦'
    },
    {
      title: 'Clients Actifs',
      value: data?.clients_actifs?.valeur || 0,
      growth: data?.clients_actifs?.croissance || 0,
      trend: data?.clients_actifs?.tendance || 'stable',
      icon: '👥'
    },
    {
      title: 'Produits Vendus',
      value: data?.produits_vendus?.valeur || 0,
      growth: data?.produits_vendus?.croissance || 0,
      trend: data?.produits_vendus?.tendance || 'stable',
      icon: '🏷️'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          growth={metric.growth}
          trend={metric.trend}
          icon={<span className="text-xl">{metric.icon}</span>}
        />
      ))}
    </div>
  );
};

export default MainMetrics;