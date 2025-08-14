import { useState, useCallback } from 'react';

export const useModal = (initialFormData = {}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const openModal = useCallback((mode, item = null) => {
    setModalMode(mode);
    setSelectedItem(item);

    if (item) {
      const mappedData = { ...initialFormData };
      Object.keys(mappedData).forEach(key => {
        if (item[key] !== undefined) {
          mappedData[key] = item[key];
        }
      });
      setFormData(mappedData);
    } else {
      setFormData(initialFormData);
    }

    setModalOpen(true);
  }, [initialFormData]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedItem(null);
    setFormData(initialFormData);
  }, [initialFormData]);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const isReadOnly = modalMode === 'view';

  return {
    modalOpen,
    modalMode,
    selectedItem,
    formData,
    isReadOnly,
    openModal,
    closeModal,
    updateFormData,
    setFormData
  };
};
