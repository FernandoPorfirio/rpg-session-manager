import { useState, useCallback } from "react";

const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const mapBackendDataToFormData = (backendData, formDataTemplate) => {
  const mappedData = { ...formDataTemplate };

  Object.keys(mappedData).forEach((key) => {
    if (backendData[key] !== undefined) {
      mappedData[key] = backendData[key];
    }
  });

  Object.keys(backendData).forEach((backendKey) => {
    const camelCaseKey = toCamelCase(backendKey);
    if (
      mappedData[camelCaseKey] !== undefined &&
      backendData[backendKey] !== undefined
    ) {
      mappedData[camelCaseKey] = backendData[backendKey];
    }
  });

  return mappedData;
};

export const useModal = (initialFormData = {}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const openModal = useCallback(
    (mode, item = null) => {
      setModalMode(mode);
      setSelectedItem(item);

      if (item) {
        const mappedData = mapBackendDataToFormData(item, initialFormData);
        setFormData(mappedData);
      } else {
        setFormData(initialFormData);
      }

      setModalOpen(true);
    },
    [initialFormData]
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedItem(null);
    setFormData(initialFormData);
  }, [initialFormData]);

  const updateFormData = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const isReadOnly = modalMode === "view";

  return {
    modalOpen,
    modalMode,
    selectedItem,
    formData,
    isReadOnly,
    openModal,
    closeModal,
    updateFormData,
    setFormData,
  };
};
