import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchBoard,
  clearCurrentBoard,
  moveTask,
  createList,
  optimisticMoveTask,
} from '../store/slices/boardSlice';
import { ListColumn, TaskCard, TaskModal, AddMemberModal } from '../components/Board';
import { Button, Loading, Input, Avatar } from '../components/Common';
import { Task } from '../types';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Plus,
  Users,
  Activity,
  Settings,
  Layers,
  X,
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { openAddMemberModal } from '../store/slices/uiSlice';

export const BoardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentBoard, isLoading, error } = useAppSelector((state) => state.boards);
  const { user } = useAppSelector((state) => state.auth);
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchBoard(id));
    }

    return () => {
      dispatch(clearCurrentBoard());
    };
  }, [id, dispatch]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    
    // Find the task across all lists
    for (const list of currentBoard?.lists || []) {
      const task = list.tasks.find((t) => t.id === taskId);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || !currentBoard?.lists) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source list
    let sourceListId = '';
    let sourceIndex = -1;
    for (const list of currentBoard.lists) {
      const index = list.tasks.findIndex((t) => t.id === activeId);
      if (index !== -1) {
        sourceListId = list.id;
        sourceIndex = index;
        break;
      }
    }

    if (!sourceListId) return;

    // Determine target list
    let targetListId = '';
    let targetIndex = 0;

    if (overId.startsWith('list-')) {
      // Dropped on a list
      targetListId = overId.replace('list-', '');
      const targetList = currentBoard.lists.find((l) => l.id === targetListId);
      targetIndex = targetList?.tasks.length || 0;
    } else {
      // Dropped on a task
      for (const list of currentBoard.lists) {
        const index = list.tasks.findIndex((t) => t.id === overId);
        if (index !== -1) {
          targetListId = list.id;
          targetIndex = index;
          break;
        }
      }
    }

    if (!targetListId || sourceListId === targetListId) return;

    // Optimistic update for moving between lists
    dispatch(
      optimisticMoveTask({
        taskId: activeId,
        sourceListId,
        targetListId,
        sourceIndex,
        targetIndex,
      })
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);

    if (!over || !currentBoard?.lists) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find where the task ended up
    let targetListId = '';
    let targetIndex = 0;
    let sourceListId = '';

    // If dropped on a list
    if (overId.startsWith('list-')) {
      targetListId = overId.replace('list-', '');
      const targetList = currentBoard.lists.find((l) => l.id === targetListId);
      targetIndex = targetList?.tasks.findIndex((t) => t.id === activeId) ?? 0;
    } else {
      // Find task's current position
      for (const list of currentBoard.lists) {
        const index = list.tasks.findIndex((t) => t.id === activeId);
        if (index !== -1) {
          targetListId = list.id;
          targetIndex = index;
          break;
        }
      }
    }

    if (!targetListId) return;

    // Find original source list (the task might have moved)
    for (const list of currentBoard.lists) {
      if (list.id !== targetListId) {
        // Check if task was originally here (it won't be there now due to optimistic update)
        sourceListId = activeTask?.listId || '';
        break;
      }
    }

    if (!sourceListId) sourceListId = targetListId;

    try {
      await dispatch(
        moveTask({
          id: activeId,
          sourceListId,
          targetListId,
          position: targetIndex,
        })
      ).unwrap();
    } catch (error) {
      toast.error('Failed to move task');
      // Refresh board to get correct state
      if (id) dispatch(fetchBoard(id));
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim() || !id) return;

    try {
      await dispatch(
        createList({
          name: newListName.trim(),
          boardId: id,
        })
      ).unwrap();
      setNewListName('');
      setIsAddingList(false);
      toast.success('List created');
    } catch (error) {
      toast.error('Failed to create list');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (error || !currentBoard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Board not found</h2>
          <p className="text-gray-600 mb-4">{error || 'The board you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/')}>Go back home</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: currentBoard.background }}
    >
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg sticky top-0 z-40 border-b border-white/10">
        <div className="px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left side */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={() => navigate('/')}
                className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95 flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="hidden sm:block p-2 bg-white/10 rounded-lg flex-shrink-0">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs">{currentBoard.name}</h1>
                  {currentBoard.description && (
                    <p className="hidden sm:block text-xs text-white/60 truncate max-w-xs">{currentBoard.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Members - hide on very small screens */}
              <div className="hidden xs:flex items-center gap-2 sm:gap-3 bg-white/10 rounded-xl px-2 sm:px-3 py-2">
                <div className="flex -space-x-2">
                  {currentBoard.members.slice(0, 3).map((member) => (
                    <Avatar
                      key={member.id}
                      name={member.user.name}
                      src={member.user.avatar}
                      size="sm"
                      className="ring-2 ring-black/20"
                    />
                  ))}
                  {currentBoard.members.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold text-white ring-2 ring-black/20">
                      +{currentBoard.members.length - 3}
                    </div>
                  )}
                </div>
                
                {/* Add Member Button (only for board owner) */}
                {currentBoard.ownerId === user?.id && (
                  <button
                    onClick={() => dispatch(openAddMemberModal())}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 active:scale-95"
                    title="Add member"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-2 sm:px-3 py-2">
                <Avatar name={user?.name || 'User'} size="sm" showStatus status="online" />
                <span className="text-sm font-medium text-white hidden md:block">{user?.name?.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="flex-1 overflow-y-auto md:overflow-x-auto md:overflow-y-hidden p-4 sm:p-6 board-scroll">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 md:h-full">
            {/* Lists */}
            {currentBoard.lists?.map((list, index) => (
              <div
                key={list.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ListColumn list={list} />
              </div>
            ))}

            {/* Add List */}
            <div className="flex-shrink-0 w-full md:w-80">
              {isAddingList ? (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 space-y-3 shadow-soft-lg border border-white/20 animate-scale-in">
                  <Input
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddList();
                      if (e.key === 'Escape') {
                        setIsAddingList(false);
                        setNewListName('');
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddList} className="flex-1">
                      Add List
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsAddingList(false);
                        setNewListName('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="w-full p-4 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-2xl text-white font-medium flex items-center justify-center gap-2.5 transition-all duration-200 border-2 border-dashed border-white/30 hover:border-white/50 active:scale-[0.98]"
                >
                  <Plus className="w-5 h-5" />
                  Add another list
                </button>
              )}
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask && (
              <div className="transform rotate-2 scale-105 opacity-95 shadow-soft-xl">
                <TaskCard task={activeTask} onClick={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Task Modal */}
      <TaskModal />

      {/* Add Member Modal */}
      <AddMemberModal />
    </div>
  );
};
