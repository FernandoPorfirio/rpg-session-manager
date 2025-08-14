import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  FormHelperText
} from '@mui/material';
import {
  inputStyles,
  selectStyles,
  textAreaStyles
} from '../../utils/styleConstants';

const SessionFormFields = ({
  formData,
  updateFormData,
  isReadOnly,
  modalMode,
  sessionStatusOptions,
  errors = {},
  onFieldBlur = () => {},
  onFieldChange = () => {}
}) => {
  const handleFieldChange = (fieldName, value) => {
    updateFormData({ [fieldName]: value });
    onFieldChange(fieldName, value);
  };

  const handleFieldBlur = (fieldName) => {
    onFieldBlur(fieldName);
  };
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 1 }}>
      <Grid size={12}>
        <TextField
          label="Nome da Sessão"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          onBlur={() => handleFieldBlur('name')}
          fullWidth
          required
          disabled={isReadOnly}
          placeholder="Digite o nome épico da sua sessão..."
          error={!!errors.name}
          helperText={errors.name}
          sx={inputStyles}
          inputProps={{
            'aria-describedby': errors.name ? 'session-name-error' : undefined,
            'aria-invalid': !!errors.name
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: modalMode === 'edit' ? 6 : 12 }}>
        <TextField
          label="Nível Máximo"
          type="number"
          value={formData.maxLevel}
          onChange={(e) => handleFieldChange('maxLevel', e.target.value)}
          onBlur={() => handleFieldBlur('maxLevel')}
          fullWidth
          inputProps={{
            min: 1,
            max: 100,
            'aria-describedby': errors.maxLevel ? 'max-level-error' : undefined,
            'aria-invalid': !!errors.maxLevel
          }}
          disabled={isReadOnly}
          placeholder="Opcional - deixe vazio para sem limite"
          error={!!errors.maxLevel}
          helperText={errors.maxLevel}
          sx={inputStyles}
        />
      </Grid>

      {modalMode === 'edit' && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!errors.sessionStatusId}>
            <InputLabel sx={{ fontSize: '1.1rem' }}>Status</InputLabel>
            <Select
              value={formData.sessionStatusId}
              onChange={(e) => handleFieldChange('sessionStatusId', e.target.value)}
              onBlur={() => handleFieldBlur('sessionStatusId')}
              label="Status"
              disabled={isReadOnly}
              sx={selectStyles}
              inputProps={{
                'aria-describedby': errors.sessionStatusId ? 'status-error' : undefined,
                'aria-invalid': !!errors.sessionStatusId
              }}
            >
              {sessionStatusOptions.map((status) => (
                <MenuItem key={status.id} value={status.id} sx={{ fontSize: '1.1rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: status.color
                      }}
                    />
                    {status.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.sessionStatusId && (
              <FormHelperText id="status-error">{errors.sessionStatusId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      )}

      <Grid size={12}>
        <TextField
          label="História e Lore"
          value={formData.lore}
          onChange={(e) => handleFieldChange('lore', e.target.value)}
          onBlur={() => handleFieldBlur('lore')}
          fullWidth
          multiline
          disabled={isReadOnly}
          placeholder="Descreva a épica aventura que aguarda os heróis..."
          error={!!errors.lore}
          helperText={errors.lore}
          sx={textAreaStyles}
          inputProps={{
            'aria-describedby': errors.lore ? 'session-lore-error' : undefined,
            'aria-invalid': !!errors.lore
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SessionFormFields;
