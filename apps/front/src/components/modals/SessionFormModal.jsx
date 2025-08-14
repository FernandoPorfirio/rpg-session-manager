import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Stack
} from '@mui/material';
import { useEffect } from 'react';
import MedievalLoader from '../MedievalLoader';
import SessionFormFields from '../forms/SessionFormFields';
import PlayerSelectionForm from '../forms/PlayerSelectionForm';
import FormAlert from '../ui/FormAlert';
import useFormValidation from '../../hooks/useFormValidation';
import { formatDateTime } from '../../utils/dateUtils';

const sessionValidationRules = {
  name: {
    required: true,
    requiredMessage: 'O nome da sessão é obrigatório',
    minLength: 3,
    minLengthMessage: 'Nome deve ter pelo menos 3 caracteres',
    maxLength: 150,
    maxLengthMessage: 'Nome deve ter no máximo 150 caracteres'
  },
  maxLevel: {
    min: 1,
    minMessage: 'Nível máximo deve ser pelo menos 1',
    max: 100,
    maxMessage: 'Nível máximo deve ser no máximo 100'
  }
};

const SessionFormModal = ({
  open,
  onClose,
  modalMode,
  selectedSession,
  formData,
  isReadOnly,
  updateFormData,
  onSubmit,
  crudLoading,
  players,
  sessionStatusOptions
}) => {
  const {
    isFormValid,
    clearErrors,
    getFieldError,
    validateSingleField,
    touchField
  } = useFormValidation(sessionValidationRules);

  useEffect(() => {
    if (!open) {
      clearErrors();
    }
  }, [open, clearErrors]);

  const getModalTitle = () => {
    switch (modalMode) {
      case 'create': return '🏰 Criar Nova Sessão';
      case 'edit': return '✏️ Editar Sessão';
      case 'view': return '📖 Pergaminho da Sessão';
      default: return 'Sessão';
    }
  };

  const getSubmitButtonText = () => {
    if (crudLoading) return <MedievalLoader size={20} />;
    return modalMode === 'create' ? 'Criar Sessão' : 'Salvar Alterações';
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
    maxLevel: getFieldError('maxLevel'),
    sessionStatusId: getFieldError('sessionStatusId'),
    lore: getFieldError('lore')
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ px: 4, py: 3 }}>
        {getModalTitle()}
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 2 }}>
        <Stack spacing={3}>
          <SessionFormFields
            formData={formData}
            updateFormData={updateFormData}
            isReadOnly={isReadOnly}
            modalMode={modalMode}
            sessionStatusOptions={sessionStatusOptions}
            errors={fieldErrors}
            onFieldChange={handleFieldChange}
            onFieldBlur={handleFieldBlur}
          />

          <PlayerSelectionForm
            players={players}
            formData={formData}
            updateFormData={updateFormData}
            isReadOnly={isReadOnly}
            showSelection={modalMode === 'create'}
          />

          {modalMode === 'view' && selectedSession && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Finalizada em:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  {formatDateTime(selectedSession.finished_at)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Última atualização:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  {formatDateTime(selectedSession.updated_at)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 3, gap: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: 140,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          {isReadOnly ? 'Fechar Pergaminho' : 'Cancelar'}
        </Button>
        {!isReadOnly && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitDisabled}
            sx={{
              minWidth: 160,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            {getSubmitButtonText()}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SessionFormModal;
