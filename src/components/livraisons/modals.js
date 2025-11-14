import { useState } from 'react';

export const useModal = () => {
  const [modalType, setModalType] = useState('');
  const [showModal, setShowModal] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
  };

  return {
    modalType,
    showModal,
    openModal,
    closeModal
  };
};