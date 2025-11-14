import React from 'react';
import AdminTableRow from './AdminTableRow';

const AdminTable = ({ administrateurs, onValider, onRejeter, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Administrateur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Niveau d'accès
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dernière connexion
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {administrateurs.map((admin) => (
            <AdminTableRow
              key={admin.idAdministrateur}
              admin={admin}
              onValider={onValider}
              onRejeter={onRejeter}
              onEdit={() => onEdit(admin)}
              onDelete={() => onDelete(admin)}
              onViewDetails={() => onViewDetails(admin)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;