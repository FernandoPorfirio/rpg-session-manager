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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
                ⚔️ Registro de Heróis ⚔️
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                "Aqui residem as lendas de nossos bravos aventureiros"
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={() => openModal('create')}
            sx={{ px: 3, py: 1.5 }}
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

        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center',
          p: 3,
          background: 'rgba(245, 245, 220, 0.7)',
          border: '1px solid rgba(139, 69, 19, 0.2)',
          borderRadius: '8px'
        }}>
          <TextField
            label="Nome do Herói"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 50 }}
          />
          <Button variant="contained" onClick={handleSearch}>
            🔎 Buscar
          </Button>
          <Button variant="outlined" onClick={handleClearSearch}>
            ✨ Limpar
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
                <TableCell>👤 Nome do Herói</TableCell>
                <TableCell>🎭 Classe</TableCell>
                <TableCell>⭐ Nível</TableCell>
                <TableCell>📅 Início da Jornada</TableCell>
                <TableCell>⚡ Ações</TableCell>
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
                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={player.class_name || 'N/A'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{player.level}</TableCell>
                    <TableCell>{formatDate(player.created_at)}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => openModal('view', player)}
                        title="Ver detalhes"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => openModal('edit', player)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(player)}
                        title="Excluir"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
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

        <Dialog open={modalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
          <DialogTitle>
            {modalMode === 'create' && '🌟 Recrutar Novo Herói'}
            {modalMode === 'edit' && '✏️ Editar Aventureiro'}
            {modalMode === 'view' && '📖 Pergaminho do Herói'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="👤 Nome do Herói"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  required
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>🎭 Classe</InputLabel>
                  <Select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    label="🎭 Classe"
                    disabled={isReadOnly}
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="⭐ Nível"
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                  fullWidth
                  required
                  inputProps={{ min: 1, max: 100 }}
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="📜 História e Lore"
                  value={formData.lore}
                  onChange={(e) => setFormData({ ...formData, lore: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                  disabled={isReadOnly}
                  placeholder="Conte a épica jornada deste herói..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={closeModal} variant="outlined">
              {isReadOnly ? '📖 Fechar Pergaminho' : '❌ Cancelar'}
            </Button>
            {!isReadOnly && (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 140 }}
              >
                {loading ? (
                  <MedievalLoader size={20} />
                ) : modalMode === 'create' ? (
                  '🌟 Recrutar Herói'
                ) : (
                  '💾 Salvar Alterações'
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
