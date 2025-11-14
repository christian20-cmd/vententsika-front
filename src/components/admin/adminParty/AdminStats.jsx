import React from 'react';
import StatCard from '../../clients/StatCard';
// Assurez-vous du bon chemin d'import

const AdminStats = ({ administrateurs }) => {
  const stats = {
    total: administrateurs.length,
    superAdmin: administrateurs.filter(a => a.niveau_acces === 'super_admin').length,
    admin: administrateurs.filter(a => a.niveau_acces === 'admin').length,
    moderateur: administrateurs.filter(a => a.niveau_acces === 'moderateur').length,
  };

  return (
    <div className="">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard
          title="Total"
          value={stats.total}
          icon="users"
          color="blue"
        />
        <StatCard
          title="Super Admin"
          value={stats.superAdmin}
          icon="users"
          color="green"
        />
        <StatCard
          title="Administrateurs"
          value={stats.admin}
          icon="users"
          color="purple"
        />
        <StatCard
          title="Modérateurs"
          value={stats.moderateur}
          icon="users"
          color="orange"
        />
      </div>
    </div>
  );
};

export default AdminStats;