import { TableRow, TableCell, Box, Typography } from '@mui/material';
import MedievalLoader from '../MedievalLoader';

const EmptyState = ({ loading, isEmpty, colSpan, emptyMessage, emptySubtitle, loadingMessage = "Consultando os pergaminhos..." }) => {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} align="center" sx={{ py: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <MedievalLoader size={40} />
            <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              {loadingMessage}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    );
  }

  if (isEmpty) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} align="center" sx={{ py: 6 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            {emptyMessage}
          </Typography>
          {emptySubtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, opacity: 0.8 }}>
              {emptySubtitle}
            </Typography>
          )}
        </TableCell>
      </TableRow>
    );
  }

  return null;
};

export default EmptyState;
