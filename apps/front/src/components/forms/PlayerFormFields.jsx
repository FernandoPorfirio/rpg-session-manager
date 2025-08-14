import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormHelperText
} from '@mui/material';
import {
  inputStyles,
  selectStyles,
  textAreaStyles
} from '../../utils/styleConstants';

const PlayerFormFields = ({
  formData,
  updateFormData,
  isReadOnly,
  classes,
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
          label="Nome do Herói"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          onBlur={() => handleFieldBlur('name')}
          required
          disabled={isReadOnly}
          fullWidth
          placeholder="Digite o nome épico do herói..."
          error={!!errors.name}
          helperText={errors.name}
          sx={inputStyles}
          inputProps={{
            'aria-describedby': errors.name ? 'name-error' : undefined,
            'aria-invalid': !!errors.name
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 8 }}>
        <FormControl fullWidth required error={!!errors.classId}>
          <InputLabel sx={{ fontSize: '1.1rem' }}>Classe</InputLabel>
          <Select
            value={formData.classId}
            onChange={(e) => handleFieldChange('classId', e.target.value)}
            onBlur={() => handleFieldBlur('classId')}
            label="Classe"
            disabled={isReadOnly}
            sx={selectStyles}
            inputProps={{
              'aria-describedby': errors.classId ? 'class-error' : undefined,
              'aria-invalid': !!errors.classId
            }}
          >
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id} sx={{ fontSize: '1.1rem' }}>
                {cls.name}
              </MenuItem>
            ))}
          </Select>
          {errors.classId && (
            <FormHelperText id="class-error">{errors.classId}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Nível"
          type="number"
          value={formData.level}
          onChange={(e) => handleFieldChange('level', parseInt(e.target.value) || 1)}
          onBlur={() => handleFieldBlur('level')}
          fullWidth
          required
          inputProps={{ 
            min: 1, 
            max: 100,
            'aria-describedby': errors.level ? 'level-error' : undefined,
            'aria-invalid': !!errors.level
          }}
          disabled={isReadOnly}
          error={!!errors.level}
          helperText={errors.level}
          sx={inputStyles}
        />
      </Grid>

      <Grid size={12}>
        <TextField
          label="História e Lore"
          value={formData.lore}
          onChange={(e) => handleFieldChange('lore', e.target.value)}
          onBlur={() => handleFieldBlur('lore')}
          fullWidth
          multiline
          disabled={isReadOnly}
          placeholder="Conte a épica jornada deste herói..."
          error={!!errors.lore}
          helperText={errors.lore}
          sx={textAreaStyles}
          inputProps={{
            'aria-describedby': errors.lore ? 'lore-error' : undefined,
            'aria-invalid': !!errors.lore
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PlayerFormFields;
