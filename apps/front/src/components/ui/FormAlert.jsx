import { Alert, AlertTitle, Snackbar, Fade } from '@mui/material';
import { CheckCircle, Warning, Error, Info } from '@mui/icons-material';

/**
 * Componente para exibir alertas amigáveis ao usuário
 * Segue as diretrizes do Material UI e práticas de acessibilidade
 */
const FormAlert = ({
  open = false,
  severity = 'info',
  title,
  message,
  onClose,
  autoHideDuration = 6000,
  action
}) => {
  const getIcon = (severity) => {
    const iconMap = {
      success: <CheckCircle fontSize="inherit" />,
      warning: <Warning fontSize="inherit" />,
      error: <Error fontSize="inherit" />,
      info: <Info fontSize="inherit" />
    };
    return iconMap[severity];
  };

  const getAriaLabel = (severity) => {
    const labelMap = {
      success: 'Mensagem de sucesso',
      warning: 'Mensagem de aviso',
      error: 'Mensagem de erro',
      info: 'Mensagem informativa'
    };
    return labelMap[severity];
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={Fade}
      sx={{ zIndex: 1400 }}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        action={action}
        icon={getIcon(severity)}
        variant="filled"
        role="alert"
        aria-label={getAriaLabel(severity)}
        sx={{
          minWidth: 300,
          maxWidth: 600,
          fontSize: '1rem',
          '& .MuiAlert-message': {
            padding: '8px 0'
          },
          '& .MuiAlert-action': {
            alignItems: 'flex-start',
            paddingTop: '4px'
          }
        }}
      >
        {title && (
          <AlertTitle sx={{ fontWeight: 600, marginBottom: '4px' }}>
            {title}
          </AlertTitle>
        )}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default FormAlert;
