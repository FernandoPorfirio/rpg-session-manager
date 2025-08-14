import { Container, Paper } from '@mui/material';
import AlertMessage from '../ui/AlertMessage';
import PageHeader from '../ui/PageHeader';

const BasePageLayout = ({
  children,
  title,
  subtitle,
  icon,
  actionButton,
  error,
  success,
  onErrorClose,
  onSuccessClose
}) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{
        p: 4,
        border: '2px solid rgba(139, 69, 19, 0.3)',
        borderRadius: '16px',
      }}>
        <PageHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          actionButton={actionButton}
        />

        <AlertMessage
          error={error}
          success={success}
          onErrorClose={onErrorClose}
          onSuccessClose={onSuccessClose}
        />

        {children}
      </Paper>
    </Container>
  );
};

export default BasePageLayout;
