import { useState, useCallback } from "react";

export const useFormValidation = (validationRules = {}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback(
    (fieldName, value) => {
      const rule = validationRules[fieldName];
      if (!rule) return null;

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

      if (rule.minLength && typeof value === "string") {
        if (value.length < rule.minLength) {
          return (
            rule.minLengthMessage || `Mínimo de ${rule.minLength} caracteres`
          );
        }
      }

      if (rule.maxLength && typeof value === "string") {
        if (value.length > rule.maxLength) {
          return (
            rule.maxLengthMessage || `Máximo de ${rule.maxLength} caracteres`
          );
        }
      }

      if (rule.min !== undefined && typeof value === "number") {
        if (value < rule.min) {
          return rule.minMessage || `Valor mínimo: ${rule.min}`;
        }
      }

      if (rule.max !== undefined && typeof value === "number") {
        if (value > rule.max) {
          return rule.maxMessage || `Valor máximo: ${rule.max}`;
        }
      }

      if (rule.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return rule.emailMessage || "Email inválido";
        }
      }

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

  const touchField = useCallback((fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  }, []);

  const isFormValid = useCallback(
    (formData) => {
      const formErrors = validateForm(formData);
      setErrors(formErrors);

      const newTouched = {};
      Object.keys(validationRules).forEach((fieldName) => {
        newTouched[fieldName] = true;
      });
      setTouched(newTouched);

      return Object.keys(formErrors).length === 0;
    },
    [validateForm, validationRules]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldError = useCallback(
    (fieldName) => {
      return touched[fieldName] ? errors[fieldName] : undefined;
    },
    [errors, touched]
  );

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
