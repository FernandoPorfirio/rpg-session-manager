import { useState, useCallback } from "react";

/**
 * Hook personalizado para validação de formulários
 * Fornece estado de erros, validação e métodos auxiliares
 *
 * @param {Object} validationRules - Regras de validação por campo
 * @returns {Object} Estado e métodos de validação
 */
export const useFormValidation = (validationRules = {}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Valida um campo específico
   * @param {string} fieldName - Nome do campo
   * @param {any} value - Valor do campo
   * @returns {string|null} Mensagem de erro ou null se válido
   */
  const validateField = useCallback(
    (fieldName, value) => {
      const rule = validationRules[fieldName];
      if (!rule) return null;

      // Validação de campo obrigatório
      if (rule.required) {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return rule.requiredMessage || "Este campo é obrigatório";
        }
      }

      // Validação de tamanho mínimo
      if (rule.minLength && typeof value === "string") {
        if (value.length < rule.minLength) {
          return (
            rule.minLengthMessage || `Mínimo de ${rule.minLength} caracteres`
          );
        }
      }

      // Validação de tamanho máximo
      if (rule.maxLength && typeof value === "string") {
        if (value.length > rule.maxLength) {
          return (
            rule.maxLengthMessage || `Máximo de ${rule.maxLength} caracteres`
          );
        }
      }

      // Validação de valor mínimo
      if (rule.min !== undefined && typeof value === "number") {
        if (value < rule.min) {
          return rule.minMessage || `Valor mínimo: ${rule.min}`;
        }
      }

      // Validação de valor máximo
      if (rule.max !== undefined && typeof value === "number") {
        if (value > rule.max) {
          return rule.maxMessage || `Valor máximo: ${rule.max}`;
        }
      }

      // Validação de email
      if (rule.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return rule.emailMessage || "Email inválido";
        }
      }

      // Validação customizada
      if (rule.custom && typeof rule.custom === "function") {
        const customError = rule.custom(value);
        if (customError) {
          return customError;
        }
      }

      return null;
    },
    [validationRules]
  );

  /**
   * Valida todos os campos do formulário
   * @param {Object} formData - Dados do formulário
   * @returns {Object} Objeto com erros encontrados
   */
  const validateForm = useCallback(
    (formData) => {
      const newErrors = {};

      Object.keys(validationRules).forEach((fieldName) => {
        const error = validateField(fieldName, formData[fieldName]);
        if (error) {
          newErrors[fieldName] = error;
        }
      });

      return newErrors;
    },
    [validateField, validationRules]
  );

  /**
   * Valida um campo e atualiza o estado de erros
   * @param {string} fieldName - Nome do campo
   * @param {any} value - Valor do campo
   */
  const validateSingleField = useCallback(
    (fieldName, value) => {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
      return !error;
    },
    [validateField]
  );

  /**
   * Marca um campo como tocado
   * @param {string} fieldName - Nome do campo
   */
  const touchField = useCallback((fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  }, []);

  /**
   * Verifica se o formulário é válido
   * @param {Object} formData - Dados do formulário
   * @returns {boolean} True se válido
   */
  const isFormValid = useCallback(
    (formData) => {
      const formErrors = validateForm(formData);
      setErrors(formErrors);

      // Marca todos os campos como tocados para mostrar erros
      const newTouched = {};
      Object.keys(validationRules).forEach((fieldName) => {
        newTouched[fieldName] = true;
      });
      setTouched(newTouched);

      return Object.keys(formErrors).length === 0;
    },
    [validateForm, validationRules]
  );

  /**
   * Limpa todos os erros e campos tocados
   */
  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  /**
   * Obtém o erro de um campo se ele foi tocado
   * @param {string} fieldName - Nome do campo
   * @returns {string|undefined} Mensagem de erro ou undefined
   */
  const getFieldError = useCallback(
    (fieldName) => {
      return touched[fieldName] ? errors[fieldName] : undefined;
    },
    [errors, touched]
  );

  /**
   * Verifica se um campo tem erro
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} True se tem erro
   */
  const hasFieldError = useCallback(
    (fieldName) => {
      return !!(touched[fieldName] && errors[fieldName]);
    },
    [errors, touched]
  );

  return {
    errors,
    touched,
    validateField,
    validateForm,
    validateSingleField,
    touchField,
    isFormValid,
    clearErrors,
    getFieldError,
    hasFieldError,
  };
};

export default useFormValidation;
