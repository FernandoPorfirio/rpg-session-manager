import { useState, useCallback } from "react";

export const useCrudOperations = (apiService, resourceName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const createResource = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError("");
        const result = await apiService.create(data);
        setSuccess(`${resourceName} criado com sucesso!`);
        return result;
      } catch (err) {
        const errorMsg = err.message || `Erro ao criar ${resourceName}`;
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiService, resourceName]
  );

  const updateResource = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        setError("");
        const result = await apiService.update(id, data);
        setSuccess(`${resourceName} atualizado com sucesso!`);
        return result;
      } catch (err) {
        const errorMsg = err.message || `Erro ao atualizar ${resourceName}`;
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiService, resourceName]
  );

  const deleteResource = useCallback(
    async (id, name) => {
      if (!window.confirm(`Tem certeza que deseja excluir "${name}"?`)) {
        return false;
      }

      try {
        setLoading(true);
        setError("");
        await apiService.delete(id);
        setSuccess(`${resourceName} excluído com sucesso!`);
        return true;
      } catch (err) {
        const errorMsg = err.message || `Erro ao excluir ${resourceName}`;
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiService, resourceName]
  );

  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  return {
    loading,
    error,
    success,
    createResource,
    updateResource,
    deleteResource,
    clearMessages,
  };
};
