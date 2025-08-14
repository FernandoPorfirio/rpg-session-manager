import { IconButton, Tooltip, Stack } from '@mui/material';
import {
  VisibilityOutlined as ViewIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';
import { actionButtonStyles } from '../../utils/buttonStyles';

const ActionButtons = ({ onView, onEdit, onDelete, viewTitle = "Ver detalhes", editTitle = "Editar", deleteTitle = "Excluir" }) => {

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ justifyContent: 'center', alignItems: 'center' }}
    >
      {onView && (
        <Tooltip title={viewTitle} arrow placement="top">
          <IconButton
            onClick={onView}
            sx={actionButtonStyles.view}
          >
            <ViewIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title={editTitle} arrow placement="top">
          <IconButton
            onClick={onEdit}
            sx={actionButtonStyles.edit}
          >
            <EditIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title={deleteTitle} arrow placement="top">
          <IconButton
            onClick={onDelete}
            sx={actionButtonStyles.delete}
          >
            <DeleteIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};

export default ActionButtons;
