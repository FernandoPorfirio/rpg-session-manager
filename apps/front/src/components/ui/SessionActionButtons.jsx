import { IconButton, Box, Tooltip } from '@mui/material';
import {
  VisibilityOutlined as ViewIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  GroupAddOutlined as ManagePlayersIcon,
  AutoAwesomeOutlined as GenerateGuildsIcon,
  GroupsOutlined as ViewGuildsIcon
} from '@mui/icons-material';
import { actionButtonStyles } from '../../utils/buttonStyles';

const SessionActionButtons = ({
  onView,
  onEdit,
  onDelete,
  onManagePlayers,
  onGenerateGuilds,
  onViewGuilds,
  viewTitle = "Ver detalhes",
  editTitle = "Editar",
  deleteTitle = "Excluir",
  managePlayersTitle = "Gerenciar Jogadores",
  generateGuildsTitle = "Gerar Guildas Automaticamente",
  viewGuildsTitle = "Ver Guildas da Sessão"
}) => {

  return (
    <Box sx={{
      display: 'flex',
      gap: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      {onView && (
        <Tooltip title={viewTitle} arrow placement="top">
          <IconButton
            onClick={onView}
            sx={actionButtonStyles.view}
          >
            <ViewIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title={editTitle} arrow placement="top">
          <IconButton
            onClick={onEdit}
            sx={actionButtonStyles.edit}
          >
            <EditIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Tooltip>
      )}
      {onManagePlayers && (
        <Tooltip title={managePlayersTitle} arrow placement="top">
          <IconButton
            onClick={onManagePlayers}
            sx={actionButtonStyles.managePlayers}
          >
            <ManagePlayersIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Tooltip>
      )}
      {onGenerateGuilds && (
        <Tooltip title={generateGuildsTitle} arrow placement="top">
          <IconButton
            onClick={onGenerateGuilds}
            sx={actionButtonStyles.generateGuilds}
          >
            <GenerateGuildsIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Tooltip>
      )}
      {onViewGuilds && (
        <Tooltip title={viewGuildsTitle} arrow placement="top">
          <IconButton
            onClick={onViewGuilds}
            sx={actionButtonStyles.viewGuilds}
          >
            <ViewGuildsIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title={deleteTitle} arrow placement="top">
          <IconButton
            onClick={onDelete}
            sx={actionButtonStyles.delete}
          >
            <DeleteIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default SessionActionButtons;
