import { Box, keyframes } from '@mui/material'

const rollAnimation = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`

const glowAnimation = keyframes`
  0%, 100% { 
    filter: drop-shadow(0 0 5px rgba(184, 134, 11, 0.5));
    opacity: 1;
  }
  50% { 
    filter: drop-shadow(0 0 15px rgba(184, 134, 11, 0.8));
    opacity: 0.8;
  }
`

const MedievalLoader = ({ size = 40, color = '#B8860B' }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* Dado D20 estilizado */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${color} 0%, #8B4513 100%)`,
          borderRadius: '15%',
          position: 'relative',
          animation: `${rollAnimation} 2s infinite ease-in-out, ${glowAnimation} 1.5s infinite ease-in-out`,
          border: '2px solid #654321',
          boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2)',
          '&::before': {
            content: '"⚄"',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: size * 0.4,
            color: '#F5DEB3',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          },
        }}
      />
      
      {/* Círculo mágico ao redor */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size * 1.8,
          height: size * 1.8,
          transform: 'translate(-50%, -50%)',
          border: '1px solid rgba(184, 134, 11, 0.3)',
          borderRadius: '50%',
          borderStyle: 'dashed',
          animation: `${rollAnimation} 3s infinite linear reverse`,
        }}
      />
    </Box>
  )
}

export default MedievalLoader
