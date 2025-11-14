// src/components/modalStyles.js
export const modalStyles = {
  // Classes pour l'overlay et le conteneur principal
  overlay: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in",
  container: "bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100",
  
  // Classes pour les boutons de fermeture
  closeButton: "w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10",
  closeIcon: "h-6 w-6 text-gray-600 group-hover:text-gray-800",
  
  // Classes pour les inputs et labels
  inputContainer: "relative mt-8",
  input: "w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 peer",
  readOnlyInput: "w-full px-4 py-3 border-2 border-gray-300 rounded-2xl bg-gray-100 text-gray-600 cursor-not-allowed",
  label: "absolute left-4 -top-2 px-2 bg-white text-gray-600 text-sm font-medium transition-all duration-200 peer-focus:text-blue-600 peer-focus:-top-2",
  icon: "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400",
  
  // Classes pour les boutons d'action
  cancelButton: "px-10 py-2 bg-gray-200 text-black rounded-2xl hover:bg-gray-300 transition-all duration-200 hover:scale-105",
  submitButton: "flex items-center gap-2 px-10 py-2 bg-blue-800 text-white rounded-2xl hover:bg-blue-800/60 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
  
  // Classes pour les sections
  infoSection: "bg-gray-50 border-2 border-gray-200 rounded-2xl p-4",
  warningSection: "bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4",
  summarySection: "bg-blue-50 border-2 border-blue-200 rounded-2xl p-4"
};