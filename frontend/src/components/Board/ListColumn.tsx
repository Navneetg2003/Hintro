import React, { useState } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { List as ListType, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { useAppDispatch } from '../../store';
import { createTask, updateList, deleteList } from '../../store/slices/boardSlice';
import { openTaskModal } from '../../store/slices/uiSlice';
import { Button, Input } from '../Common';
import { Plus, MoreHorizontal, Trash2, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ListColumnProps {
  list: ListType;
}

export const ListColumn: React.FC<ListColumnProps> = ({ list }) => {
  const dispatch = useAppDispatch();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(list.name);
  const [showMenu, setShowMenu] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `list-${list.id}`,
    data: { type: 'list', listId: list.id },
  });

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      await dispatch(
        createTask({
          title: newTaskTitle.trim(),
          listId: list.id,
        })
      ).unwrap();
      setNewTaskTitle('');
      setIsAddingTask(false);
      toast.success('Task created');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateName = async () => {
    if (!editedName.trim() || editedName === list.name) {
      setIsEditing(false);
      setEditedName(list.name);
      return;
    }

    try {
      await dispatch(
        updateList({
          id: list.id,
          data: { name: editedName.trim() },
        })
      ).unwrap();
      setIsEditing(false);
      toast.success('List updated');
    } catch (error) {
      toast.error('Failed to update list');
      setEditedName(list.name);
    }
  };

  const handleDeleteList = async () => {
    if (!confirm('Are you sure you want to delete this list and all its tasks?')) {
      return;
    }

    try {
      await dispatch(deleteList(list.id)).unwrap();
      toast.success('List deleted');
    } catch (error) {
      toast.error('Failed to delete list');
    }
  };

  const handleTaskClick = (task: Task) => {
    dispatch(openTaskModal(task));
  };

  return (
    <div
      className={`
        flex-shrink-0 w-full md:w-80 rounded-2xl
        flex flex-col md:max-h-full
        bg-gradient-to-b from-gray-100 to-gray-50/80
        border border-gray-200/60 shadow-soft
        transition-all duration-200
        ${isOver ? 'ring-2 ring-primary-400 shadow-glow' : ''}
      `}
    >
      {/* List Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200/50">
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateName();
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditedName(list.name);
                }
              }}
              onBlur={handleUpdateName}
              autoFocus
              className="text-sm py-1"
            />
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              {list.name}
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200/80 text-gray-600">
                {list.tasks.length}
              </span>
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/80 rounded-lg transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-soft-lg border border-gray-100 py-1.5 z-20 w-40 animate-scale-in">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Rename
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteList();
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete list
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Tasks */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-[100px]"
      >
        <SortableContext
          items={list.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {list.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add Task */}
      <div className="p-3 pt-0">
        {isAddingTask ? (
          <div className="space-y-2.5 bg-white rounded-xl p-3 shadow-soft border border-gray-100">
            <textarea
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddTask();
                }
                if (e.key === 'Escape') {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }
              }}
              placeholder="What needs to be done?"
              className="w-full p-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
              rows={2}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTask} className="flex-1">
                Add card
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full flex items-center justify-center gap-2 p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white/80 rounded-xl transition-all duration-200 text-sm font-medium border-2 border-dashed border-gray-200 hover:border-gray-300"
          >
            <Plus className="w-4 h-4" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
};
