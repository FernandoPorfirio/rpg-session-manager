import { Chip } from '@mui/material';

const CLASS_CONFIG = {
  'Guerreiro': {
    emoji: '⚔️',
    backgroundColor: 'rgba(183, 28, 28, 0.08)',
    color: '#B71C1C',
    borderColor: 'rgba(183, 28, 28, 0.20)'
  },
  'Mago': {
    emoji: '🔮',
    backgroundColor: 'rgba(26, 35, 126, 0.08)',
    color: '#1A237E',
    borderColor: 'rgba(26, 35, 126, 0.20)'
  },
  'Arqueiro': {
    emoji: '🏹',
    backgroundColor: 'rgba(27, 94, 32, 0.08)',
    color: '#1B5E20',
    borderColor: 'rgba(27, 94, 32, 0.20)'
  },
  'Clérigo': {
    emoji: '✨',
    backgroundColor: 'rgba(245, 127, 23, 0.08)',
    color: '#F57F17',
    borderColor: 'rgba(245, 127, 23, 0.20)'
  }
};

const DEFAULT_CLASS_CONFIG = {
  emoji: '👤',
  backgroundColor: 'rgba(97, 97, 97, 0.08)',
  color: '#616161',
  borderColor: 'rgba(97, 97, 97, 0.20)'
};

const LEVEL_CONFIG = {
  backgroundColor: 'rgba(69, 90, 100, 0.08)',
  color: '#455A64',
  borderColor: 'rgba(69, 90, 100, 0.20)'
};

export const getPlayerClassChip = (className) => {
  if (!className) return null;

  const config = CLASS_CONFIG[className] || DEFAULT_CLASS_CONFIG;

  return (
    <Chip
      label={`${config.emoji} ${className}`}
      size="small"
      sx={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
        fontSize: '0.85rem',
        fontWeight: '500',
        fontFamily: '"VT323", monospace',
        minWidth: '120px',
        height: '28px',
        borderRadius: '14px',
        '& .MuiChip-label': {
          paddingLeft: '10px',
          paddingRight: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '&:hover': {
          backgroundColor: config.backgroundColor.replace('0.08', '0.12'),
          transform: 'scale(1.02)',
          boxShadow: `0 2px 8px ${config.backgroundColor.replace('0.08', '0.15')}`
        },
        transition: 'all 0.2s ease-in-out'
      }}
    />
  );
};

export const getPlayerLevelChip = (level) => {
  if (!level && level !== 0) return null;

  return (
    <Chip
      label={`Nível ${level}`}
      size="small"
      sx={{
        backgroundColor: LEVEL_CONFIG.backgroundColor,
        color: LEVEL_CONFIG.color,
        border: `1px solid ${LEVEL_CONFIG.borderColor}`,
        fontSize: '0.85rem',
        fontWeight: '500',
        fontFamily: '"VT323", monospace',
        minWidth: '80px',
        height: '28px',
        borderRadius: '14px',
        '& .MuiChip-label': {
          paddingLeft: '8px',
          paddingRight: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '&:hover': {
          backgroundColor: LEVEL_CONFIG.backgroundColor.replace('0.08', '0.12'),
          transform: 'scale(1.02)',
          boxShadow: `0 2px 8px ${LEVEL_CONFIG.backgroundColor.replace('0.08', '0.15')}`
        },
        transition: 'all 0.2s ease-in-out'
      }}
    />
  );
};
