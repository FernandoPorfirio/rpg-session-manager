import { Box, TextField, Button } from '@mui/material';

const SearchBar = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onClear,
  placeholder = "Buscar...",
  label = "Pesquisar"
}) => {
  return (
    <Box sx={{
      mb: 4,
      display: 'flex',
      gap: 2,
      alignItems: 'center',
      p: 3,
      background: 'rgba(245, 245, 220, 0.7)',
      border: '1px solid rgba(139, 69, 19, 0.2)',
      borderRadius: '12px'
    }}>
      <TextField
        label={label}
        value={searchTerm}
        onChange={onSearchChange}
        placeholder={placeholder}
        size="medium"
        sx={{
          minWidth: 300,
          '& .MuiInputBase-input': {
            py: 1.5,
            fontSize: '1.1rem'
          },
          '& .MuiInputLabel-root': {
            fontSize: '1.1rem'
          }
        }}
      />
      <Button
        variant="contained"
        onClick={onSearch}
        sx={{
          px: 3,
          py: 1.5,
          fontSize: '1.1rem',
          minWidth: 120
        }}
      >
        Buscar
      </Button>
      <Button
        variant="outlined"
        onClick={onClear}
        sx={{
          px: 3,
          py: 1.5,
          fontSize: '1.1rem',
          minWidth: 120
        }}
      >
        Limpar
      </Button>
    </Box>
  );
};

export default SearchBar;
