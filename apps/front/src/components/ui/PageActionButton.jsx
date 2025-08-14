import { Button } from '@mui/material';

const PageActionButton = ({
  onClick,
  children,
  icon,
  variant = "contained",
  minWidth = 180,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      sx={{
        px: 4,
        py: 2,
        fontSize: '1.1rem',
        minWidth: minWidth
      }}
      {...props}
    >
      {icon} {children}
    </Button>
  );
};

export default PageActionButton;
