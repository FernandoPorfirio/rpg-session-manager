import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { useEffect } from 'react';
import MedievalLoader from '../MedievalLoader';
import PlayerFormFields from '../forms/PlayerFormFields';
import FormAlert from '../ui/FormAlert';
import useFormValidation from '../../hooks/useFormValidation';
import {
  dialogStyles,
  modalButtonStyles
} from '../../utils/styleConstants';

const playerValidationRules = {
  name: {
    required: true,
    requiredMessage: 'O nome do herói é obrigatório',
    minLength: 2,
    minLengthMessage: 'Nome deve ter pelo menos 2 caracteres',
    maxLength: 100,
    maxLengthMessage: 'Nome deve ter no máximo 100 caracteres'
  },
  classId: {
    required: true,
    requiredMessage: 'Por favor, selecione uma classe para o herói'
  },
  level: {
    required: true,
    requiredMessage: 'O nível é obrigatório',
    min: 1,
    minMessage: 'Nível mínimo é 1',
    max: 100,
    maxMessage: 'Nível máximo é 100'
  }
};

const PlayerFormModal = ({
  open,
  onClose,
  modalMode,
  formData,
  isReadOnly,
  updateFormData,
  onSubmit,
  crudLoading,
  classes
}) => {
  const {
    isFormValid,
    clearErrors,
    getFieldError,
    validateSingleField,
    touchField
  } = useFormValidation(playerValidationRules);

  useEffect(() => {
    if (!open) {
      clearErrors();
    }
  }, [open, clearErrors]);

  const getModalTitle = () => {
    switch (modalMode) {
      case 'create': return '🌟 Recrutar Novo Herói';
      case 'edit': return '✏️ Editar Aventureiro';
      case 'view': return '📖 Pergaminho do Herói';
      default: return 'Herói';
    }
  };

  const getSubmitButtonText = () => {
    if (crudLoading) return <MedievalLoader size={20} />;
    return modalMode === 'create' ? 'Recrutar Herói' : 'Salvar Alterações';
  };

  const handleFieldChange = (fieldName, value) => {
    updateFormData({ [fieldName]: value });
  };

  const handleFieldBlur = (fieldName) => {
    touchField(fieldName);
    validateSingleField(fieldName, formData[fieldName]);
  };

  const handleSubmit = () => {
    if (isFormValid(formData)) {
      onSubmit();
    }
  };

  const isSubmitDisabled = crudLoading || isReadOnly;

  const fieldErrors = {
    name: getFieldError('name'),
    classId: getFieldError('classId'),
    level: getFieldError('level'),
    lore: getFieldError('lore')
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={dialogStyles.title}>
        {getModalTitle()}
      </DialogTitle>

      <DialogContent sx={dialogStyles.content}>
        <PlayerFormFields
          formData={formData}
          updateFormData={updateFormData}
          isReadOnly={isReadOnly}
          classes={classes}
          errors={fieldErrors}
          onFieldChange={handleFieldChange}
          onFieldBlur={handleFieldBlur}
        />
      </DialogContent>

      <DialogActions sx={dialogStyles.actions}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={modalButtonStyles.cancel}
        >
          {isReadOnly ? 'Fechar Pergaminho' : 'Cancelar'}
        </Button>
        {!isReadOnly && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitDisabled}
            sx={modalButtonStyles.submit}
          >
            {getSubmitButtonText()}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PlayerFormModal;
