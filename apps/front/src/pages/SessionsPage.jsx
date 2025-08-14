import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import BasePageLayout from '../components/layout/BasePageLayout';
import SearchBar from '../components/ui/SearchBar';
import SessionActionButtons from '../components/ui/SessionActionButtons';
import ManagePlayersModal from '../components/modals/ManagePlayersModal';
import GenerateGuildsModal from '../components/modals/GenerateGuildsModal';
import ViewGuildsModal from '../components/modals/ViewGuildsModal';
import SessionFormModal from '../components/modals/SessionFormModal';
import EmptyState from '../components/ui/EmptyState';
import { useCrudOperations } from '../hooks/useCrudOperations';
import { useModal } from '../hooks/useModal';
import { useSearch } from '../hooks/useSearch';
import { sessionApiAdapter } from '../utils/apiAdapters';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import {
  tableHeaderStyles,
  tableCellStyles,
  tableRowHoverStyles,
  tableContainerStyles
} from '../utils/styleConstants';
import { COLORS } from '../utils/constants';
import api from '../services/api';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);

  const [managePlayersModalOpen, setManagePlayersModalOpen] = useState(false);
  const [generateGuildsModalOpen, setGenerateGuildsModalOpen] = useState(false);
  const [viewGuildsModalOpen, setViewGuildsModalOpen] = useState(false);
  const [selectedSessionForAction, setSelectedSessionForAction] = useState(null);

  const {
    loading: crudLoading,
    error,
    success,
    createResource,
    updateResource,
    deleteResource,
    clearMessages
  } = useCrudOperations(sessionApiAdapter, 'Sessão');

  const {
    modalOpen,
    modalMode,
    selectedItem: selectedSession,
    formData,
    isReadOnly,
    openModal: baseOpenModal,
    closeModal,
    updateFormData
  } = useModal({
    name: '',
    maxLevel: '',
    sessionStatusId: 1,
    lore: '',
    selectedPlayers: []
  });

  const loadPlayers = useCallback(async () => {
      const playersResponse = await api.getPlayers();
      setPlayers((playersResponse.data || []).filter(player => !player.is_deleted));
  }, []);

  const openModal = useCallback(async (mode, session = null) => {
    baseOpenModal(mode, session);
    await loadPlayers();
  }, [baseOpenModal, loadPlayers]);

  const {
    searchTerm,
    activeFilter: nameFilter,
    setSearchTerm,
    handleSearch,
    handleClearSearch
  } = useSearch();

  const sessionStatusOptions = [
    { id: 1, name: 'Planejamento', description: 'Session em fase de planejamento', color: '#FFB74D' },
    { id: 2, name: 'Iniciada', description: 'Session em andamento', color: '#81C784' },
    { id: 3, name: 'Finalizada', description: 'Session finalizada', color: '#E57373' },
    { id: 4, name: 'Inativa', description: 'Session inativa', color: '#9E9E9E' }
  ];

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await sessionApiAdapter.getAll();

      let filteredSessions = response;
      if (nameFilter) {
        filteredSessions = response.filter(session =>
          session.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      setSessions(filteredSessions);
    } finally {
      setLoading(false);
    }
  }, [nameFilter]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleSubmit = async () => {
    const sessionData = {
      name: formData.name,
      maxLevel: formData.maxLevel ? parseInt(formData.maxLevel) : null,
      lore: formData.lore
    };

      let sessionId;

      if (modalMode === 'create') {
        const newSession = await createResource(sessionData);
        sessionId = newSession?.id;

        if (formData.selectedPlayers && formData.selectedPlayers.length > 0 && sessionId) {
          for (const playerId of formData.selectedPlayers) {
              await api.addPlayerToSession(sessionId, parseInt(playerId));
          }
        }
      } else if (modalMode === 'edit') {
        sessionData.sessionStatusId = formData.sessionStatusId;
        await updateResource(selectedSession.id, sessionData);
      }

      closeModal();
      loadSessions();
  };

  const handleDelete = async (session) => {
    const deleted = await deleteResource(session.id, session.name);
    if (deleted) {
      loadSessions();
    }
  };

  const handleManagePlayers = (session) => {
    setSelectedSessionForAction(session);
    setManagePlayersModalOpen(true);
  };

  const handleGenerateGuilds = (session) => {
    setSelectedSessionForAction(session);
    setGenerateGuildsModalOpen(true);
  };

  const handleViewGuilds = (session) => {
    setSelectedSessionForAction(session);
    setViewGuildsModalOpen(true);
  };

  const handleCloseManagePlayersModal = () => {
    setManagePlayersModalOpen(false);
    setSelectedSessionForAction(null);
  };

  const handleCloseGenerateGuildsModal = () => {
    setGenerateGuildsModalOpen(false);
    setSelectedSessionForAction(null);
  };

  const handleCloseViewGuildsModal = () => {
    setViewGuildsModalOpen(false);
    setSelectedSessionForAction(null);
  };

  const handlePlayersUpdated = () => {
    loadSessions();
  };

  const handleGuildsGenerated = () => {
    loadSessions();
  };

  const getStatusChip = (statusId, statusName) => {
    const status = sessionStatusOptions.find(s => s.id === statusId);
    return (
      <Chip
        label={statusName || status?.name || 'N/A'}
        size="medium"
        variant="outlined"
        sx={{
          fontSize: '1rem',
          backgroundColor: `${status?.color}20`,
          borderColor: status?.color,
          color: COLORS.text
        }}
      />
    );
  };

  return (
    <BasePageLayout
      title="Registro de Sessões"
      subtitle="Aqui residem as crônicas de nossas épicas aventuras"
      icon="⚔️"
      actionButton={
        <Button
          variant="contained"
          onClick={() => openModal('create')}
          sx={{
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            minWidth: 180
          }}
        >
          🏰 Criar Sessão
        </Button>
      }
      error={error}
      success={success}
      onErrorClose={clearMessages}
      onSuccessClose={clearMessages}
    >
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        label="Nome da Sessão"
        placeholder="Digite o nome da sessão..."
      />

      <TableContainer sx={tableContainerStyles}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyles}>Nome da Sessão</TableCell>
              <TableCell sx={tableHeaderStyles}>Status</TableCell>
              <TableCell sx={tableHeaderStyles}>Nível Máximo</TableCell>
              <TableCell sx={tableHeaderStyles}>Iniciada em</TableCell>
              <TableCell sx={tableHeaderStyles}>Criada em</TableCell>
              <TableCell sx={{ ...tableHeaderStyles, textAlign: 'center' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <EmptyState
              loading={loading}
              isEmpty={sessions.length === 0}
              colSpan={6}
              emptyMessage="🏜️ Nenhuma sessão encontrada nas terras..."
              emptySubtitle="Que tal criar sua primeira aventura épica?"
            />
            {!loading && sessions.length > 0 && sessions.map((session) => (
              <TableRow key={session.id} sx={tableRowHoverStyles}>
                <TableCell sx={{ ...tableCellStyles, fontWeight: '500' }}>
                  {session.name}
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  {getStatusChip(session.session_status_id, session.status_name)}
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  {session.max_level || 'Sem limite'}
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  {formatDateTime(session.started_at)}
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  {formatDate(session.created_at)}
                </TableCell>
                <TableCell>
                  <SessionActionButtons
                    onView={() => openModal('view', session)}
                    onEdit={() => openModal('edit', session)}
                    onManagePlayers={() => handleManagePlayers(session)}
                    onGenerateGuilds={() => handleGenerateGuilds(session)}
                    onViewGuilds={() => handleViewGuilds(session)}
                    onDelete={() => handleDelete(session)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modais adicionais */}
      <ManagePlayersModal
        open={managePlayersModalOpen}
        onClose={handleCloseManagePlayersModal}
        session={selectedSessionForAction}
        onPlayersUpdated={handlePlayersUpdated}
      />

      <GenerateGuildsModal
        open={generateGuildsModalOpen}
        onClose={handleCloseGenerateGuildsModal}
        session={selectedSessionForAction}
        onGuildsGenerated={handleGuildsGenerated}
      />

      <ViewGuildsModal
        open={viewGuildsModalOpen}
        onClose={handleCloseViewGuildsModal}
        session={selectedSessionForAction}
      />

      <SessionFormModal
        open={modalOpen}
        onClose={closeModal}
        modalMode={modalMode}
        selectedSession={selectedSession}
        formData={formData}
        isReadOnly={isReadOnly}
        updateFormData={updateFormData}
        onSubmit={handleSubmit}
        crudLoading={crudLoading}
        players={players}
        sessionStatusOptions={sessionStatusOptions}
      />
    </BasePageLayout>
  );
};

export default SessionsPage;
