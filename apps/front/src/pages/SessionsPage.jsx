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
  Campaign as CampaignIcon
} from '@mui/icons-material';
import MedievalLoader from '../components/MedievalLoader';
import api from '../services/api';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedSession, setSelectedSession] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    maxLevel: '',
    sessionStatusId: 1,
    lore: ''
  });

  const sessionStatusOptions = [
    { id: 1, name: 'Planejamento', description: 'Session em fase de planejamento', color: '#FFB74D' },
    { id: 2, name: 'Iniciada', description: 'Session em andamento', color: '#81C784' },
    { id: 3, name: 'Finalizada', description: 'Session finalizada', color: '#E57373' },
    { id: 4, name: 'Inativa', description: 'Session inativa', color: '#9E9E9E' }
  ];

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getSessions();

      // Filtrar por nome se houver filtro ativo
      let filteredSessions = response;
      if (nameFilter) {
        filteredSessions = response.filter(session =>
          session.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      setSessions(filteredSessions);
    } catch {
      setError('Erro ao carregar sessões');
    } finally {
      setLoading(false);
    }
  }, [nameFilter]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleSearch = () => {
    setNameFilter(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setNameFilter('');
  };

  const openModal = (mode, session = null) => {
    setModalMode(mode);
    setSelectedSession(session);

    if (session) {
      setFormData({
        name: session.name,
        maxLevel: session.max_level || '',
        sessionStatusId: session.session_status_id,
        lore: session.lore || ''
      });
    } else {
      setFormData({
        name: '',
        maxLevel: '',
        sessionStatusId: 1,
        lore: ''
      });
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSession(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const sessionData = {
        name: formData.name,
        maxLevel: formData.maxLevel ? parseInt(formData.maxLevel) : null,
        lore: formData.lore
      };

      if (modalMode === 'create') {
        await api.createSession(sessionData);
        setSuccess('Sessão criada com sucesso!');
      } else if (modalMode === 'edit') {
        sessionData.sessionStatusId = formData.sessionStatusId;
        await api.updateSession(selectedSession.id, sessionData);
        setSuccess('Sessão atualizada com sucesso!');
      }

      closeModal();
      loadSessions();
    } catch (err) {
      setError(err.message || 'Erro ao salvar sessão');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (session) => {
    if (window.confirm(`Tem certeza que deseja excluir a sessão "${session.name}"?`)) {
      try {
        setLoading(true);
        await api.deleteSession(session.id);
        setSuccess('Sessão excluída com sucesso!');
        loadSessions();
      } catch (err) {
        setError(err.message || 'Erro ao excluir sessão');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusChip = (statusId, statusName) => {
    const status = sessionStatusOptions.find(s => s.id === statusId);
    return (
      <Chip
        label={statusName || status?.name || 'N/A'}
        size="medium"
        variant="outlined"
        sx={{
          fontSize: '1rem',
          backgroundColor: `${status?.color}20`,
          borderColor: status?.color,
          color: '#2F4F4F'
        }}
      />
    );
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
              ⚔️ Registro de Sessões
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{
              fontStyle: 'italic',
              fontSize: '1.1rem'
            }}>
              "Aqui residem as crônicas de nossas épicas aventuras"
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
            🏰 Criar Sessão
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
            label="Nome da Sessão"
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
                  Nome da Sessão
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Nível Máximo
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Iniciada em
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Criada em
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <MedievalLoader size={40} />
                      <Typography variant="body1" sx={{ color: '#696969', fontStyle: 'italic' }}>
                        Consultando os pergaminhos...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" sx={{ color: '#696969', fontStyle: 'italic' }}>
                      🏜️ Nenhuma sessão encontrada nas terras...
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                      Que tal criar sua primeira aventura épica?
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow key={session.id} sx={{ '&:hover': { backgroundColor: 'rgba(184, 134, 11, 0.05)' } }}>
                    <TableCell sx={{ py: 2, fontSize: '1.1rem', fontWeight: '500' }}>
                      {session.name}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {getStatusChip(session.session_status_id, session.status_name)}
                    </TableCell>
                    <TableCell sx={{ py: 2, fontSize: '1.1rem' }}>
                      {session.max_level || 'Sem limite'}
                    </TableCell>
                    <TableCell sx={{ py: 2, fontSize: '1.1rem' }}>
                      {formatDateTime(session.started_at)}
                    </TableCell>
                    <TableCell sx={{ py: 2, fontSize: '1.1rem' }}>
                      {formatDate(session.created_at)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => openModal('view', session)}
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
                          onClick={() => openModal('edit', session)}
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
                          onClick={() => handleDelete(session)}
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

        <Dialog open={modalOpen} onClose={closeModal} maxWidth="md" fullWidth>
          <DialogTitle sx={{ px: 4, py: 3 }}>
            {modalMode === 'create' && '🏰 Criar Nova Sessão'}
            {modalMode === 'edit' && '✏️ Editar Sessão'}
            {modalMode === 'view' && '📖 Pergaminho da Sessão'}
          </DialogTitle>
          <DialogContent sx={{ px: 4, pb: 2 }}>
            <Grid container spacing={3} sx={{ mt: 1.5 }}>
              <Grid item xs={12}>
                <TextField
                  label="Nome da Sessão"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  required
                  disabled={isReadOnly}
                  placeholder="Digite o nome épico da sua sessão..."
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nível Máximo"
                  type="number"
                  value={formData.maxLevel}
                  onChange={(e) => setFormData({ ...formData, maxLevel: e.target.value })}
                  fullWidth
                  inputProps={{ min: 1, max: 100 }}
                  disabled={isReadOnly}
                  placeholder="Opcional - deixe vazio para sem limite"
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
              {modalMode === 'edit' && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ fontSize: '1.1rem' }}>Status</InputLabel>
                    <Select
                      value={formData.sessionStatusId}
                      onChange={(e) => setFormData({ ...formData, sessionStatusId: e.target.value })}
                      label="Status"
                      disabled={isReadOnly}
                      sx={{
                        '& .MuiSelect-select': {
                          py: 2,
                          fontSize: '1.1rem'
                        }
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
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <Grid container spacing={3} sx={{ mt: 2.5 }}>
              <Grid item xs={12}>
                <TextField
                  label="História e Lore"
                  value={formData.lore}
                  onChange={(e) => setFormData({ ...formData, lore: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                  disabled={isReadOnly}
                  placeholder="Descreva a épica aventura que aguarda os heróis..."
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

            {modalMode === 'view' && selectedSession && (
              <Grid container spacing={3} sx={{ mt: 2.5 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Finalizada em:
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {formatDateTime(selectedSession.finished_at)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Última atualização:
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {formatDateTime(selectedSession.updated_at)}
                  </Typography>
                </Grid>
              </Grid>
            )}
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
                  'Criar Sessão'
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

export default SessionsPage;
