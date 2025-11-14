// Fonctions utilitaires partagées

export const getStatusColor = (status) => {
  const colors = {
    'en_attente': 'bg-yellow-100 text-yellow-800',
    'en_preparation': 'bg-blue-100 text-blue-800',
    'expedie': 'bg-purple-100 text-purple-800',
    'en_transit': 'bg-indigo-100 text-indigo-800',
    'livre': 'bg-green-100 text-green-800',
    'annule': 'bg-red-100 text-red-800',
    'retourne': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Non définie';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export const formatPrix = (prix) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA'
  }).format(prix || 0);
};

export const getActionsPossibles = (livraison) => {
  const actions = [];
  const status = livraison.status_livraison;
  
  if (status === 'en_attente') {
    actions.push('preparation');
  }
  if (status === 'en_preparation') {
    actions.push('expedier');
  }
  if (status === 'expedie') {
    actions.push('transit');
  }
  if (status === 'en_transit') {
    actions.push('livrer');
  }
  if (status === 'expedie' || status === 'en_transit') {
    actions.push('livrer');
  }
  
  if (!['livre', 'annule'].includes(status)) {
    actions.push('modifier');
  }
  
  if (!['livre', 'expedie', 'en_transit'].includes(status)) {
    actions.push('supprimer');
  }
  
  if (status !== 'livre' && status !== 'annule') {
    actions.push('annuler');
  }
  
  actions.push('calculs', 'pdf');
  
  return actions;
};

export const getNextStatus = (currentStatus) => {
  const transitions = {
    'en_attente': 'en_preparation',
    'en_preparation': 'expedie',
    'expedie': 'en_transit',
    'en_transit': 'livre',
  };
  return transitions[currentStatus];
};