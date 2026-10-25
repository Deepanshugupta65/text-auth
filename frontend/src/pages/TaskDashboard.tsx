
import { useCallback, useEffect, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  Add,
  DeleteOutlined,
  EditOutlined,
} from '@mui/icons-material';
import {
  taskApi,
  type Task,
  type TaskResponse,
  type TaskFilters,
} from '../api/taskApi';

const PAGE_SIZE = 10;

type StatusFilter = 'all' | 'completed' | 'pending';

export default function TasksDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');

  // Debounce search to avoid an API call on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const filters: TaskFilters = {
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        completed:
          filter === 'all'
            ? undefined
            : filter === 'completed',
      };

      const result: TaskResponse =
        await taskApi.getTasks(filters);

      setTasks(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Unable to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filter]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const openCreateDialog = () => {
    setEditingTask(null);
    setTitle('');
    setDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;

    setDialogOpen(false);
    setEditingTask(null);
    setTitle('');
  };

  const saveTask = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || saving) return;

    setSaving(true);
    setError('');

    try {
      if (editingTask) {
        await taskApi.updateTask(editingTask.id, {
          title: trimmedTitle,
        });
      } else {
        await taskApi.createTask(trimmedTitle);
      }

      closeDialogAfterSave();

      // Return to first page when creating a new task.
      if (!editingTask && page !== 1) {
        setPage(1);
      } else {
        await loadTasks();
      }
    } catch (err) {
      console.error('Failed to save task:', err);
      setError('Unable to save task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const closeDialogAfterSave = () => {
    setDialogOpen(false);
    setEditingTask(null);
    setTitle('');
  };

  const toggleCompleted = async (task: Task) => {
    setError('');

    try {
      await taskApi.updateTask(task.id, {
        completed: !task.completed,
      });

      await loadTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Unable to update task status.');
    }
  };

  const deleteTask = async (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) return;

    setError('');

    try {
      await taskApi.deleteTask(id);

      // Avoid staying on an empty page.
      if (tasks.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadTasks();
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Unable to delete task.');
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={3}>

        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              My Tasks
            </Typography>

            <Typography color="text.secondary">
              Manage your daily tasks
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateDialog}
          >
            Add Task
          </Button>
        </Box>

        {/* Task count */}
        <Card sx={{ p: 3 }}>
          <Typography color="text.secondary">
            Total matching tasks
          </Typography>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            {total}
          </Typography>
        </Card>

        {/* Search and filter */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
        >
          <TextField
            fullWidth
            label="Search tasks"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="task-status-label">
              Status
            </InputLabel>

            <Select
              labelId="task-status-label"
              value={filter}
              label="Status"
              onChange={(event) => {
                setFilter(
                  event.target.value as StatusFilter
                );
                setPage(1);
              }}
            >
              <MenuItem value="all">
                All
              </MenuItem>

              <MenuItem value="completed">
                Completed
              </MenuItem>

              <MenuItem value="pending">
                Pending
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Tasks list */}
        <Card>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : tasks.length === 0 ? (
            <Box
              sx={{
                p: 5,
                textAlign: 'center',
              }}
            >
              <Typography color="text.secondary">
                No tasks found.
              </Typography>

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={openCreateDialog}
                sx={{ mt: 2 }}
              >
                Create Task
              </Button>
            </Box>
          ) : (
            tasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  p: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => {
                    void toggleCompleted(task);
                  }}
                />

                <Typography
                  sx={{
                    flex: 1,
                    overflowWrap: 'anywhere',
                    textDecoration: task.completed
                      ? 'line-through'
                      : 'none',
                    color: task.completed
                      ? 'text.secondary'
                      : 'text.primary',
                  }}
                >
                  {task.title}
                </Typography>

                <IconButton
                  aria-label={`Edit ${task.title}`}
                  onClick={() => openEditDialog(task)}
                >
                  <EditOutlined />
                </IconButton>

                <IconButton
                  color="error"
                  aria-label={`Delete ${task.title}`}
                  onClick={() => {
                    void deleteTask(task.id);
                  }}
                >
                  <DeleteOutlined/>
                </IconButton>
              </Box>
            ))
          )}
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => {
                setPage(value);
              }}
              color="primary"
            />
          </Box>
        )}

      </Stack>

      {/* Create/Edit dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create Task'}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Task title"
            margin="normal"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void saveTask();
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            disabled={saving}
            onClick={closeDialog}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={!title.trim() || saving}
            onClick={() => {
              void saveTask();
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
