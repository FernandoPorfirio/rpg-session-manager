import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Stack
} from '@mui/material';
import { getPlayerClassChip, getPlayerLevelChip, getRemoveChip } from '../../utils/playerChips';

const PlayerSelectionForm = ({
  players,
  formData,
  updateFormData,
  isReadOnly,
  showSelection = true
}) => {
  const selectedPlayers = formData.selectedPlayers || [];

  const handleAddPlayer = (playerId) => {
    if (playerId && !selectedPlayers.includes(playerId)) {
      updateFormData({
        selectedPlayers: [...selectedPlayers, playerId]
      });
    }
  };

  const handleRemovePlayer = (playerIdToRemove) => {
    const newSelected = selectedPlayers.filter(id => id !== playerIdToRemove);
    updateFormData({ selectedPlayers: newSelected });
  };

  const availablePlayers = players.filter(player =>
    !selectedPlayers.includes(player.id.toString())
  );

  if (!showSelection) return null;

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={12}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1, color: '#2F4F4F' }}>
              👥 Selecionar Jogadores (Opcional)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Você pode adicionar jogadores agora ou gerenciá-los depois através do botão "Gerenciar Jogadores"
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Adicionar Jogador</InputLabel>
            <Select
              value=""
              onChange={(e) => handleAddPlayer(e.target.value)}
              label="Adicionar Jogador"
              disabled={isReadOnly}
            >
              {availablePlayers.map((player) => (
                <MenuItem key={player.id} value={player.id.toString()}>
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ alignItems: 'center', width: '100%' }}
                  >
                    <Typography sx={{ flex: 1 }}>{player.name}</Typography>
                    {getPlayerClassChip(player.class_name)}
                    {getPlayerLevelChip(player.level)}
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Lista de jogadores selecionados */}
          {selectedPlayers.length > 0 && (
            <Box sx={{
              p: 2,
              backgroundColor: 'rgba(245, 245, 220, 0.5)',
              borderRadius: 1,
              border: '1px solid rgba(139, 69, 19, 0.2)'
            }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
                Jogadores selecionados ({selectedPlayers.length}):
              </Typography>
              <Stack spacing={1}>
                {selectedPlayers.map((playerId) => {
                  const player = players.find(p => p.id.toString() === playerId);
                  if (!player) return null;
                  return (
                    <Box 
                      key={playerId}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 1,
                        border: '1px solid rgba(139, 69, 19, 0.1)'
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: '500', flex: 1 }}>
                        {player.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {getPlayerClassChip(player.class_name)}
                        {getPlayerLevelChip(player.level)}
                      </Box>
                      {!isReadOnly && getRemoveChip(() => handleRemovePlayer(playerId))}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PlayerSelectionForm;
