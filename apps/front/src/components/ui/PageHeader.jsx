import { Box, Typography, Paper } from '@mui/material';

const PageHeader = ({ title, subtitle, actionButton, icon }) => {
  return (
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
          {icon} {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{
          fontStyle: 'italic',
          fontSize: '1.1rem'
        }}>
          {subtitle}
        </Typography>
      </Box>
      {actionButton}
    </Box>
  );
};

export default PageHeader;
