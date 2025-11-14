import React from 'react';
import { MdDelete, MdCheckCircle, MdBlock, MdStore, MdPerson, MdBarChart } from 'react-icons/md';
import { MdEmail, MdPhone, MdCalendarToday } from 'react-icons/md';
import { Factory, User, CheckCircle, XCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import LogoTB from '../../../assets/LogoTB.png';

// --- Composants de style inspirés par ProduitDetailModal ---

const InfoField = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-300 last:border-b-0">
    <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
      {Icon && <Icon className="h-4 w-4 text-gray-600" />}
      {label}:
    </span>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

const InfoCard = ({ title, icon: Icon, children }) => (
  <div className="bg-gray-100 p-6 rounded-2xl border-2 border-gray-300 shadow-sm">
    <label className="block text-lg font-bold text-gray-900 mb-4 border-b border-gray-400 pb-3">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-6 w-6 text-blue-800" />}
        {title}
      </div>
    </label>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

// --- Composant Principal VendeurDetailsModal ---

const VendeurDetailsModal = ({ vendeur, actionLoading, onClose, onUpdateStatus }) => {
  if (!vendeur) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'valide':
        return 'bg-green-100 text-green-800 border-2 border-green-300';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300';
      case 'rejete':
        return 'bg-red-100 text-red-800 border-2 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-2 border-gray-300';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'valide':
        return <MdCheckCircle className="text-green-600" />;
      case 'en_attente':
        return <MdCalendarToday className="text-yellow-600" />;
      case 'rejete':
        return <MdBlock className="text-red-600" />;
      default:
        return <MdCalendarToday className="text-gray-600" />;
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'valide': return 'Validé';
      case 'en_attente': return 'En attente';
      case 'rejete': return 'Rejeté';
      default: return statut;
    }
  };

  // Affichage du statut formaté
  const StatutDisplay = (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatutColor(vendeur.statut_validation)}`}>
      {getStatutIcon(vendeur.statut_validation)}
      <span className="ml-2">{getStatutText(vendeur.statut_validation)}</span>
    </span>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-face-left">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-4 top-4 z-10"
        >
          <X className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-2 pt-6">
          <img src={LogoTB} alt="logo" className='w-28'/>
        </div>

        {/* En-tête du Modal */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <MdStore className="text-blue-800" />
            Détails du vendeur : {vendeur.nom_entreprise}
          </h3>
        </div>

        {/* Contenu - Structuré comme dans ProduitDetailModal */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">

            {/* Informations de l'entreprise */}
            <InfoCard title="Informations de l'entreprise" icon={Factory}>
              <InfoField label="Nom de l'entreprise" value={vendeur.nom_entreprise} />
              <div className="flex justify-between items-center py-3 border-b border-gray-300">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MdStore className="h-4 w-4 text-gray-600" />
                  Statut:
                </span>
                {StatutDisplay}
              </div>
              <div className="pt-3">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description:</label>
                <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-300">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {vendeur.description || 'Aucune description fournie.'}
                  </p>
                </div>
              </div>
            </InfoCard>

            {/* Informations personnelles (Utilisateur) */}
            <InfoCard title="Informations Personnelles" icon={User}>
              <InfoField 
                label="Nom Complet" 
                value={vendeur.utilisateur?.nom_complet || 'Non spécifié'} 
                icon={MdPerson} 
              />
              <InfoField 
                label="Email" 
                value={vendeur.utilisateur?.email || 'Non spécifié'} 
                icon={MdEmail} 
              />
              <InfoField 
                label="Téléphone" 
                value={vendeur.utilisateur?.telephone || 'Non spécifié'} 
                icon={MdPhone} 
              />
              <InfoField 
                label="Date d'inscription" 
                value={formatDate(vendeur.utilisateur?.date_inscription)} 
                icon={MdCalendarToday} 
              />
            </InfoCard>

            {/* Performance */}
            {vendeur.performance && (
              <div className="md:col-span-2">
                <InfoCard title="Performance & Statistiques" icon={MdBarChart}>
                  <div className="space-y-2">
                    <div className="text-center p-4 bg-blue-50 rounded-2xl border-2 border-blue-300">
                      <p className="text-2xl font-bold text-blue-800">
                        {vendeur.performance.produits_actifs || 0}
                      </p>
                      <p className="text-xs font-semibold text-gray-700">Produits Actifs</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-2xl border-2 border-green-300">
                      <p className="text-2xl font-bold text-green-800">
                        {vendeur.nombre_produits || 0}
                      </p>
                      <p className="text-xs font-semibold text-gray-700">Total Produits</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-2xl border-2 border-purple-300">
                      <p className="text-2xl font-bold text-purple-800">
                        {vendeur.performance.total_vues || 0}
                      </p>
                      <p className="text-xs font-semibold text-gray-700">Total Vues</p>
                    </div>
                  </div>
                </InfoCard>
              </div>
            )}

            {/* Actions de Validation */}
            <div className={`md:col-span-2 ${vendeur.performance ? '' : 'md:col-start-1'}`}>
              <div className="bg-gray-100 p-6 rounded-2xl border-2 border-gray-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-800" />
                  Actions de Validation
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onClose();
                      onUpdateStatus(vendeur.idVendeur, 'valide');
                    }}
                    disabled={actionLoading === vendeur.idVendeur || vendeur.statut_validation === 'valide'}
                    className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white py-4 px-6 rounded-2xl font-bold hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {actionLoading === vendeur.idVendeur ? (
                      'Traitement...'
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Valider le Vendeur
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onUpdateStatus(vendeur.idVendeur, 'rejete');
                    }}
                    disabled={actionLoading === vendeur.idVendeur || vendeur.statut_validation === 'rejete'}
                    className="flex-1 flex items-center justify-center gap-3 bg-red-600 text-white py-4 px-6 rounded-2xl font-bold hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {actionLoading === vendeur.idVendeur ? (
                      'Traitement...'
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        Rejeter le Vendeur
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-300 text-gray-800 py-4 px-6 rounded-2xl font-bold hover:bg-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VendeurDetailsModal;