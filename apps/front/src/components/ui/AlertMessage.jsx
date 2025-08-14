import { Alert } from '@mui/material';

const AlertMessage = ({ error, success, onErrorClose, onSuccessClose }) => {
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }} onClose={onErrorClose}>
        {error}
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert severity="success" sx={{ mb: 2 }} onClose={onSuccessClose}>
        {success}
      </Alert>
    );
  }

  return null;
};

export default AlertMessage;
