import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  Alert,
  Stack
} from '@mui/material';
import { DeleteOutline as RemoveIcon, Close as CloseIcon } from '@mui/icons-material';
import MedievalLoader from '../MedievalLoader';
import api from '../../services/api';
import { getPlayerClassChip, getPlayerLevelChip } from '../../utils/playerChips';

const ManagePlayersModal = ({ open, onClose, session, onPlayersUpdated }) => {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [confirmedPlayers, setConfirmedPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const confirmedPlayersData = await api.getConfirmedPlayersBySession(session.id);
      setConfirmedPlayers(confirmedPlayersData);

      const allPlayersResponse = await api.getPlayers();

      const confirmedPlayerIds = confirmedPlayersData.map(cp => cp.player_id);
      const availablePlayersData = (allPlayersResponse.data || []).filter(player =>
        !confirmedPlayerIds.includes(player.id) && !player.is_deleted
      );

      setAvailablePlayers(availablePlayersData);
        } catch (err) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [session?.id]);

  useEffect(() => {
    if (open && session) {
      loadData();
    }
  }, [open, session, loadData]);

  const handleAddPlayer = async () => {
    if (!selectedPlayerId) return;

    try {
      setActionLoading(true);
      setError('');
      setSuccess('');

      await api.addPlayerToSession(session.id, parseInt(selectedPlayerId));

      setSuccess('Jogador adicionado com sucesso!');
      setSelectedPlayerId('');

      await loadData();

      if (onPlayersUpdated) {
        onPlayersUpdated();
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao adicionar jogador');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemovePlayer = async (confirmationId, playerName) => {
    if (!window.confirm(`Tem certeza que deseja remover ${playerName} desta sessão?`)) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      setSuccess('');

      await api.removePlayerFromSession(confirmationId);

      setSuccess('Jogador removido com sucesso!');

      await loadData();

      if (onPlayersUpdated) {
        onPlayersUpdated();
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao remover jogador');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPlayerId('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{
        px: 4,
        py: 3,
        background: 'linear-gradient(135deg, rgba(85, 107, 47, 0.1) 0%, rgba(85, 107, 47, 0.05) 100%)',
        borderBottom: '2px solid rgba(85, 107, 47, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#556B2F' }}>
            🛡️ Gerenciar Jogadores
          </Typography>
        </Box>
        {session && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Sessão: {session.name}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <MedievalLoader size={40} />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2F4F4F' }}>
                ➕ Adicionar Jogador
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <FormControl sx={{ minWidth: 300, flex: 1 }}>
                  <InputLabel>Selecione um jogador</InputLabel>
                  <Select
                    value={selectedPlayerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    label="Selecione um jogador"
                    disabled={actionLoading}
                  >
                    {availablePlayers.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                          <Typography sx={{ flex: 1 }}>{player.name}</Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {getPlayerClassChip(player.class_name)}
                            {getPlayerLevelChip(player.level)}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleAddPlayer}
                  disabled={!selectedPlayerId || actionLoading}
                  sx={{ minWidth: 120 }}
                >
                  {actionLoading ? <MedievalLoader size={20} /> : 'Adicionar'}
                </Button>
              </Box>
              {availablePlayers.length === 0 && (
                <Typography color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Todos os jogadores disponíveis já estão confirmados nesta sessão.
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(139, 69, 19, 0.2)' }} />

            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: '#2F4F4F' }}>
                👥 Jogadores Confirmados ({confirmedPlayers.length})
              </Typography>

              {confirmedPlayers.length === 0 ? (
                <Box sx={{
                  textAlign: 'center',
                  py: 4,
                  backgroundColor: 'rgba(184, 134, 11, 0.05)',
                  borderRadius: 2,
                  border: '1px dashed rgba(184, 134, 11, 0.2)'
                }}>
                  <Typography color="text.secondary">
                    🏜️ Nenhum jogador confirmado ainda
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Adicione jogadores para começar a formar as guildas
                  </Typography>
                </Box>
              ) : (
                <List sx={{
                  bgcolor: 'rgba(245, 245, 220, 0.3)',
                  borderRadius: 2,
                  border: '1px solid rgba(139, 69, 19, 0.2)'
                }}>
                  {confirmedPlayers.map((confirmedPlayer) => (
                    <ListItem key={confirmedPlayer.id} divider sx={{ justifyContent: 'space-between' }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                              {confirmedPlayer.player_name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {getPlayerClassChip(confirmedPlayer.class_name)}
                              {getPlayerLevelChip(confirmedPlayer.level)}
                            </Box>
                          </Box>
                        }
                        secondary={`Confirmado em: ${new Date(confirmedPlayer.created_at).toLocaleDateString('pt-BR')}`}
                      />
                      <IconButton
                        edge="end"
                        onClick={() => handleRemovePlayer(confirmedPlayer.id, confirmedPlayer.player_name)}
                        disabled={actionLoading}
                        sx={{
                          color: '#8B0000',
                          '&:hover': {
                            backgroundColor: 'rgba(139, 0, 0, 0.1)',
                            color: '#DC143C'
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ minWidth: 140 }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManagePlayersModal;
