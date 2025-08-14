import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import MedievalLoader from '../MedievalLoader';
import api from '../../services/api';
import { getPlayerClassChip, getPlayerLevelChip, getClassDistributionChips, getGuildMembersChip, getGuildStrengthChip } from '../../utils/playerChips';

const ViewGuildsModal = ({ open, onClose, session }) => {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadGuilds = useCallback(async () => {
    if (!session?.id) return;

    try {
      setLoading(true);
      setError('');

      const guildsData = await api.getGuildsBySession(session.id);
      setGuilds(guildsData);
    } catch (err) {
      setError(err.message || 'Erro ao carregar guildas');
    } finally {
      setLoading(false);
    }
  }, [session?.id]);

  useEffect(() => {
    if (open && session) {
      loadGuilds();
    }
  }, [open, session, loadGuilds]);

  const handleClose = () => {
    setError('');
    onClose();
  };

  const calculateGuildStats = (guild) => {
    if (!guild.members || guild.members.length === 0) {
      return { totalLevel: 0, averageLevel: 0, classDistribution: {} };
    }

    const totalLevel = guild.members.reduce((sum, member) => sum + (member.level || 0), 0);
    const averageLevel = totalLevel / guild.members.length;

    const classDistribution = guild.members.reduce((acc, member) => {
      const className = member.class_name;
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {});

    return { totalLevel, averageLevel: Math.round(averageLevel), classDistribution };
  };

  const getGuildStrengthColor = (averageLevel) => {
    if (averageLevel >= 15) return '#8B0000';
    if (averageLevel >= 10) return '#FF8C00';
    if (averageLevel >= 5) return '#B8860B';
    return '#556B2F';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{
        px: 4,
        py: 3,
        background: 'linear-gradient(135deg, rgba(128, 0, 128, 0.1) 0%, rgba(128, 0, 128, 0.05) 100%)',
        borderBottom: '2px solid rgba(128, 0, 128, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#800080' }}>
            🏰 Guildas da Sessão
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <MedievalLoader size={40} />
          </Box>
        ) : guilds.length === 0 ? (
          <Box sx={{
            textAlign: 'center',
            py: 6,
            backgroundColor: 'rgba(128, 0, 128, 0.05)',
            borderRadius: 2,
            border: '1px dashed rgba(128, 0, 128, 0.2)'
          }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              🏜️ Nenhuma guilda criada ainda
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use a função "Gerar Guildas" para criar e balancear as guildas automaticamente
            </Typography>
          </Box>
        ) : (
          <Box>
            <Card sx={{
              mb: 3,
              backgroundColor: 'rgba(245, 245, 220, 0.9)',
              border: '1px solid rgba(139, 69, 19, 0.3)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#2F4F4F' }}>
                  📊 Resumo das Guildas
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#800080', fontWeight: 'bold' }}>
                        {guilds.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Guildas Criadas
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#556B2F', fontWeight: 'bold' }}>
                        {guilds.reduce((total, guild) => total + (guild.members?.length || 0), 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total de Jogadores
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#B8860B', fontWeight: 'bold' }}>
                        {guilds.length > 0
                          ? Math.round(guilds.reduce((total, guild) => total + (guild.members?.length || 0), 0) / guilds.length)
                          : 0
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Média por Guilda
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box>
              {guilds.map((guild) => {
                const stats = calculateGuildStats(guild);
                return (
                  <Accordion
                    key={guild.id}
                    sx={{
                      mb: 2,
                      border: '1px solid rgba(139, 69, 19, 0.3)',
                      '&:before': { display: 'none' }
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Typography variant="h6" sx={{
                          color: '#2F4F4F',
                          fontWeight: 'bold',
                          flex: 1
                        }}>
                          {guild.name}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          {getGuildMembersChip(guild.members?.length || 0)}

                          {guild.members && guild.members.length > 0 &&
                            getGuildStrengthChip(stats.averageLevel, getGuildStrengthColor)
                          }
                        </Box>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      {(!guild.members || guild.members.length === 0) ? (
                        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Esta guilda ainda não possui membros
                        </Typography>
                      ) : (
                        <Box>
                          <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(245, 245, 220, 0.5)', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Nível Total: <strong>{stats.totalLevel}</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Nível Médio: <strong>{stats.averageLevel}</strong>
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  Distribuição de Classes:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {getClassDistributionChips(stats.classDistribution)}
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>

                          <Divider sx={{ mb: 2 }} />

                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: '500' }}>
                            👥 Membros da Guilda:
                          </Typography>

                          <List>
                            {guild.members.map((member) => (
                              <ListItem
                                key={member.id}
                                sx={{
                                  backgroundColor: 'rgba(245, 245, 220, 0.3)',
                                  borderRadius: 1,
                                  mb: 1,
                                  border: '1px solid rgba(139, 69, 19, 0.2)'
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                        {member.name}
                                      </Typography>
                                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {getPlayerClassChip(member.class_name)}
                                        {getPlayerLevelChip(member.level)}
                                      </Box>
                                    </Box>
                                  }
                                  secondary={member.lore ? `Lore: ${member.lore}` : 'Sem lore definida'}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          </Box>
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

export default ViewGuildsModal;
