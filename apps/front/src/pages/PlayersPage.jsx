import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
  Stack
} from '@mui/material';
import BasePageLayout from '../components/layout/BasePageLayout';
import SearchBar from '../components/ui/SearchBar';
import ActionButtons from '../components/ui/ActionButtons';
import EmptyState from '../components/ui/EmptyState';
import PlayerFormModal from '../components/modals/PlayerFormModal';
import { useCrudOperations } from '../hooks/useCrudOperations';
import { useModal } from '../hooks/useModal';
import { useSearch } from '../hooks/useSearch';
import { playerApiAdapter } from '../utils/apiAdapters';
import { formatDate } from '../utils/dateUtils';
import {
  tableHeaderStyles,
  tableCellStyles,
  tableRowHoverStyles,
  tableContainerStyles
} from '../utils/styleConstants';
import { PAGINATION_DEFAULTS } from '../utils/constants';
import api from '../services/api';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    loading: crudLoading,
    error,
    success,
    createResource,
    updateResource,
    deleteResource,
    clearMessages
  } = useCrudOperations(playerApiAdapter, 'Player');

  const {
    modalOpen,
    modalMode,
    selectedItem: selectedPlayer,
    formData,
    isReadOnly,
    openModal,
    closeModal,
    updateFormData
  } = useModal({
    name: '',
    classId: '',
    level: 1,
    lore: ''
  });

  const {
    searchTerm,
    activeFilter: nameFilter,
    handleSearch: doSearch,
    handleClearSearch: doClearSearch,
    handleSearchChange
  } = useSearch();

  const loadPlayers = useCallback(async () => {
    setLoading(true);
    const params = {
      page,
      limit: PAGINATION_DEFAULTS.limit,
      ...(nameFilter && { name: nameFilter })
    };

    const response = await playerApiAdapter.getAll(params);
    setPlayers(response.data);
    setTotalPages(response.pagination.pages);
    setLoading(false);
  }, [page, nameFilter]);

  const loadClasses = async () => {
    try {
      const response = await api.getClasses();
      setClasses(response);
    } catch {
      console.error('Erro ao carregar classes');
    }
  };

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSearch = () => {
    setPage(1);
    doSearch();
  };

  const handleClearSearch = () => {
    setPage(1);
    doClearSearch();
  };

  const handleSubmit = async () => {
    if (modalMode === 'create') {
    await createResource(formData);
    } else if (modalMode === 'edit') {
    await updateResource(selectedPlayer.id, formData);
    }

    closeModal();
    loadPlayers();
  };

  const handleDelete = async (player) => {
    const deleted = await deleteResource(player.id, player.name);
    if (deleted) {
      loadPlayers();
    }
  };

  return (
    <BasePageLayout
      title="Registro de Heróis"
      subtitle="Aqui residem as lendas de nossos bravos aventureiros"
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
          🌟 Recrutar Herói
        </Button>
      }
      error={error}
      success={success}
      onErrorClose={clearMessages}
      onSuccessClose={clearMessages}
    >
      <Stack spacing={3}>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          label="Nome do Herói"
          placeholder="Digite o nome do herói..."
        />

        <TableContainer sx={tableContainerStyles}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderStyles}>Nome do Herói</TableCell>
                <TableCell sx={tableHeaderStyles}>Classe</TableCell>
                <TableCell sx={tableHeaderStyles}>Nível</TableCell>
                <TableCell sx={tableHeaderStyles}>Início da Jornada</TableCell>
                <TableCell sx={{ ...tableHeaderStyles, textAlign: 'center' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <EmptyState
                loading={loading}
                isEmpty={players.length === 0}
                colSpan={5}
                emptyMessage="🏜️ Nenhum herói encontrado nas terras..."
                emptySubtitle="Que tal recrutar seu primeiro aventureiro?"
              />
              {!loading && players.length > 0 && players.map((player) => (
                <TableRow key={player.id} sx={tableRowHoverStyles}>
                  <TableCell sx={{ ...tableCellStyles, fontWeight: '500' }}>
                    {player.name}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={player.class_name || 'N/A'}
                      size="medium"
                      variant="outlined"
                      sx={{ fontSize: '1rem' }}
                    />
                  </TableCell>
                  <TableCell sx={tableCellStyles}>
                    {player.level}
                  </TableCell>
                  <TableCell sx={tableCellStyles}>
                    {formatDate(player.created_at)}
                  </TableCell>
                  <TableCell>
                    <ActionButtons
                      onView={() => openModal('view', player)}
                      onEdit={() => openModal('edit', player)}
                      onDelete={() => handleDelete(player)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Stack direction="row" sx={{ justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Stack>
        )}
      </Stack>

      <PlayerFormModal
        open={modalOpen}
        onClose={closeModal}
        modalMode={modalMode}
        formData={formData}
        isReadOnly={isReadOnly}
        updateFormData={updateFormData}
        onSubmit={handleSubmit}
        crudLoading={crudLoading}
        classes={classes}
      />
    </BasePageLayout>
  );
};

export default PlayersPage;
