import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import MedievalLoader from '../components/MedievalLoader';
import api from '../services/api';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nameFilter, setNameFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    level: 1,
    lore: ''
  });

  const loadPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(nameFilter && { name: nameFilter })
      };

      const response = await api.getPlayers(params);
      setPlayers(response.data);
      setTotalPages(response.pagination.pages);
    } catch {
      setError('Erro ao carregar players');
    } finally {
      setLoading(false);
    }
  }, [page, nameFilter]);

  const loadClasses = useCallback(async () => {
    try {
      const response = await api.getClasses();
      setClasses(response);
    } catch {
      console.error('Erro ao carregar classes');
    }
  }, []);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleSearch = () => {
    setNameFilter(searchTerm);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setNameFilter('');
    setPage(1);
  };

  const openModal = (mode, player = null) => {
    setModalMode(mode);
    setSelectedPlayer(player);

    if (player) {
      setFormData({
        name: player.name,
        classId: player.class_id,
        level: player.level,
        lore: player.lore || ''
      });
    } else {
      setFormData({
        name: '',
        classId: '',
        level: 1,
        lore: ''
      });
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPlayer(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (modalMode === 'create') {
        await api.createPlayer(formData);
        setSuccess('Player criado com sucesso!');
      } else if (modalMode === 'edit') {
        await api.updatePlayer(selectedPlayer.id, formData);
        setSuccess('Player atualizado com sucesso!');
      }

      closeModal();
      loadPlayers();
    } catch (err) {
      setError(err.message || 'Erro ao salvar player');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (player) => {
    if (window.confirm(`Tem certeza que deseja excluir o player "${player.name}"?`)) {
      try {
        setLoading(true);
        await api.deletePlayer(player.id);
        setSuccess('Player excluído com sucesso!');
        loadPlayers();
      } catch (err) {
        setError(err.message || 'Erro ao excluir player');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isReadOnly = modalMode === 'view';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{
        p: 4,
        border: '2px solid rgba(139, 69, 19, 0.3)',
        borderRadius: '16px',
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          pb: 3,
          borderBottom: '2px solid rgba(139, 69, 19, 0.2)'
        }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ mb: 1, color: '#2F4F4F' }}>
              ⚔️ Registro de Heróis
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ 
              fontStyle: 'italic',
              fontSize: '1.1rem'
            }}>
              "Aqui residem as lendas de nossos bravos aventureiros"
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => openModal('create')}
            sx={{ 
              px: 4, 
              py: 2,
              fontSize: '1.1rem',
              minWidth: 180
            }}
          >
            🌟 Recrutar Herói
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

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
            label="Nome do Herói"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={handleSearch}
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
            onClick={handleClearSearch}
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

        <TableContainer sx={{
          border: '2px solid rgba(139, 69, 19, 0.3)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Nome do Herói
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Classe
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Nível
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Início da Jornada
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <MedievalLoader size={40} />
                      <Typography variant="body1" sx={{ color: '#696969', fontStyle: 'italic' }}>
                        Consultando os pergaminhos...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : players.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" sx={{ color: '#696969', fontStyle: 'italic' }}>
                      🏜️ Nenhum herói encontrado nas terras...
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                      Que tal recrutar seu primeiro aventureiro?
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                players.map((player) => (
                  <TableRow key={player.id} sx={{ '&:hover': { backgroundColor: 'rgba(184, 134, 11, 0.05)' } }}>
                    <TableCell sx={{ py: 2, fontSize: '1.1rem', fontWeight: '500' }}>
                      {player.name}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={player.class_name || 'N/A'}
                        size="medium"
                        variant="outlined"
                        sx={{ fontSize: '1rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, fontSize: '1.1rem' }}>
                      {player.level}
                    </TableCell>
                    <TableCell sx={{ py: 2, fontSize: '1.1rem' }}>
                      {formatDate(player.created_at)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => openModal('view', player)}
                          title="Ver detalhes"
                          sx={{ 
                            p: 1,
                            borderRadius: '8px',
                            '&:hover': { 
                              backgroundColor: 'rgba(184, 134, 11, 0.1)',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => openModal('edit', player)}
                          title="Editar"
                          sx={{ 
                            p: 1,
                            borderRadius: '8px',
                            '&:hover': { 
                              backgroundColor: 'rgba(184, 134, 11, 0.1)',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(player)}
                          title="Excluir"
                          color="error"
                          sx={{ 
                            p: 1,
                            borderRadius: '8px',
                            '&:hover': { 
                              backgroundColor: 'rgba(139, 0, 0, 0.1)',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}

        <Dialog open={modalOpen} onClose={closeModal} maxWidth="md" fullWidth>
          <DialogTitle sx={{ px: 4, py: 3 }}>
            {modalMode === 'create' && '🌟 Recrutar Novo Herói'}
            {modalMode === 'edit' && '✏️ Editar Aventureiro'}
            {modalMode === 'view' && '📖 Pergaminho do Herói'}
          </DialogTitle>
          <DialogContent sx={{ px: 4, pb: 2 }}>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  label="Nome do Herói"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  required
                  disabled={isReadOnly}
                  sx={{ 
                    '& .MuiInputBase-input': { 
                      py: 2,
                      fontSize: '1.1rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ fontSize: '1.1rem' }}>Classe</InputLabel>
                  <Select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    label="Classe"
                    disabled={isReadOnly}
                    sx={{
                      '& .MuiSelect-select': {
                        py: 2,
                        fontSize: '1.1rem'
                      }
                    }}
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id} sx={{ fontSize: '1.1rem' }}>
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Nível"
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                  fullWidth
                  required
                  inputProps={{ min: 1, max: 100 }}
                  disabled={isReadOnly}
                  sx={{ 
                    '& .MuiInputBase-input': { 
                      py: 2,
                      fontSize: '1.1rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="História e Lore"
                  value={formData.lore}
                  onChange={(e) => setFormData({ ...formData, lore: e.target.value })}
                  fullWidth
                  multiline
                  rows={5}
                  disabled={isReadOnly}
                  placeholder="Conte a épica jornada deste herói..."
                  sx={{ 
                    '& .MuiInputBase-input': { 
                      fontSize: '1.1rem',
                      lineHeight: 1.6
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem'
                    },
                    '& .MuiOutlinedInput-root': {
                      '& textarea': {
                        minHeight: '120px !important'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 4, py: 3, gap: 2, justifyContent: 'space-between' }}>
            <Button 
              onClick={closeModal} 
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
                disabled={loading}
                sx={{ 
                  minWidth: 160, 
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                {loading ? (
                  <MedievalLoader size={20} />
                ) : modalMode === 'create' ? (
                  'Recrutar Herói'
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default PlayersPage;
