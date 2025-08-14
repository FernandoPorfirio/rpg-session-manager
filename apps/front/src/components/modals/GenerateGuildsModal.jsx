import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MedievalLoader from '../MedievalLoader';
import api from '../../services/api';
import { inputStyles } from '../../utils/styleConstants';

const GenerateGuildsModal = ({ open, onClose, session, onGuildsGenerated }) => {
  const [numberOfGuilds, setNumberOfGuilds] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedGuilds, setGeneratedGuilds] = useState([]);

  const handleGenerate = async () => {
    if (!numberOfGuilds || numberOfGuilds < 1) {
      setError('Por favor, informe um número válido de guildas (mínimo 1)');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const result = await api.formGuildsAutomatically(session.id, parseInt(numberOfGuilds));

      setGeneratedGuilds(result.guilds || []);
      setSuccess(`${result.guilds?.length || 0} guildas foram criadas e balanceadas automaticamente!`);

      if (onGuildsGenerated) {
        onGuildsGenerated();
      }

    } catch (err) {
      setError(err.message || 'Erro ao gerar guildas automaticamente');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNumberOfGuilds('');
    setError('');
    setSuccess('');
    setGeneratedGuilds([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{
        px: 4,
        py: 3,
        background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%)',
        borderBottom: '2px solid rgba(255, 140, 0, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FF8C00' }}>
            ✨ Gerar Guildas Automaticamente
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

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 3, color: '#2F4F4F', lineHeight: 1.6 }}>
            Esta funcionalidade criará automaticamente as guildas para a sessão,
            distribuindo os jogadores confirmados de forma balanceada considerando
            níveis e classes.
          </Typography>

          <Paper sx={{
            p: 3,
            backgroundColor: 'rgba(255, 140, 0, 0.05)',
            border: '1px solid rgba(255, 140, 0, 0.2)',
            borderRadius: 2
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#FF6347' }}>
              ⚡ Como funciona:
            </Typography>
            <List dense>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText
                  primary="• Analisa todos os jogadores confirmados na sessão"
                  primaryTypographyProps={{ fontSize: '1rem', color: '#2F4F4F' }}
                />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText
                  primary="• Distribui os jogadores de forma equilibrada entre as guildas"
                  primaryTypographyProps={{ fontSize: '1rem', color: '#2F4F4F' }}
                />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText
                  primary="• Considera níveis e classes para um balanceamento justo"
                  primaryTypographyProps={{ fontSize: '1rem', color: '#2F4F4F' }}
                />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText
                  primary="• Gera nomes automáticos para as guildas criadas"
                  primaryTypographyProps={{ fontSize: '1rem', color: '#2F4F4F' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Número de Guildas"
            type="number"
            value={numberOfGuilds}
            onChange={(e) => setNumberOfGuilds(e.target.value)}
            fullWidth
            inputProps={{ min: 1, max: 20 }}
            placeholder="Ex: 3"
            helperText="Informe quantas guildas deseja criar (máximo 20)"
            sx={inputStyles}
            disabled={loading}
          />
        </Box>

        {generatedGuilds.length > 0 && (
          <Paper sx={{
            p: 3,
            backgroundColor: 'rgba(85, 107, 47, 0.05)',
            border: '1px solid rgba(85, 107, 47, 0.2)',
            borderRadius: 2
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#556B2F' }}>
              🏰 Guildas Criadas:
            </Typography>
            <List>
              {generatedGuilds.map((guild, index) => (
                <ListItem key={guild.id || index} sx={{
                  backgroundColor: 'rgba(245, 245, 220, 0.3)',
                  borderRadius: 1,
                  mb: 1,
                  border: '1px solid rgba(139, 69, 19, 0.2)'
                }}>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: '500', color: '#2F4F4F' }}>
                        {guild.name}
                      </Typography>
                    }
                    secondary={`${guild.memberCount || 0} jogadores`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ minWidth: 140 }}
          disabled={loading}
        >
          {generatedGuilds.length > 0 ? 'Concluído' : 'Cancelar'}
        </Button>

        {!success && (
          <Button
            onClick={handleGenerate}
            variant="contained"
            disabled={loading || !numberOfGuilds}
            sx={{ minWidth: 160 }}
          >
            {loading ? (
              <MedievalLoader size={20} />
            ) : (
              '✨ Gerar Guildas'
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GenerateGuildsModal;
