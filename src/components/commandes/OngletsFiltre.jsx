import React from 'react';

export const OngletsFiltre = ({ activeTab, setActiveTab, commandes, commandesAnnulees }) => {
  // ✅ CORRECTION: Utiliser les mêmes clés que dans la logique de filtrage
  const onglets = [
    { 
      key: 'toutes', 
      label: 'Toutes', 
      count: commandes.filter(c => c.statut !== 'annulee').length 
    },
    { 
      key: 'attente_validation',  // ✅ CORRECTION: Même clé que dans le filtrage
      label: 'En attente', 
      count: commandes.filter(c => c.statut === 'attente_validation').length 
    },
    { 
      key: 'validee',  // ✅ CORRECTION: Même clé que dans le filtrage
      label: 'Validées', 
      count: commandes.filter(c => c.statut === 'validee').length 
    },
    { 
      key: 'en_preparation',  // ✅ CORRECTION: Même clé que dans le filtrage
      label: 'Préparation', 
      count: commandes.filter(c => c.statut === 'en_preparation').length 
    },
    { 
      key: 'livree',  // ✅ CORRECTION: Même clé que dans le filtrage
      label: 'Livrées', 
      count: commandes.filter(c => c.statut === 'livree').length 
    },
    { 
      key: 'annulees', 
      label: 'Annulées', 
      count: commandesAnnulees.length 
    }
  ];

  return (
    <div className="flex space-x-2 mb-6 bg-white px-4 py-2 rounded-2xl">
      {onglets.map(onglet => (
        <button
          key={onglet.key}
          onClick={() => setActiveTab(onglet.key)}
          className={`flex-1 py-3 px-4 text-center text-sm font-semibold rounded-2xl transition-all duration-300 ${
            activeTab === onglet.key
              ? 'bg-blue-800 text-white shadow-lg transform scale-105'
              : 'text-gray-700 hover:text-blue-800 hover:bg-gray-200 hover:shadow-md'
          }`}
        >
          {onglet.label} ({onglet.count})
        </button>
      ))}
    </div>
  );
};