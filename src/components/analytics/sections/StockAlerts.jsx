import AlertCard from '../cards/AlertCard';

const StockAlerts = ({ data }) => {
  const alertItems = data?.map(item => ({
    name: item.produit,
    value: `${item.quantite_restante} unités`
  })) || [];

  return (
    <div className="mb-6">
      <AlertCard
        title="Alertes Stock Faible"
        items={alertItems}
        type="warning"
      />
    </div>
  );
};

export default StockAlerts;