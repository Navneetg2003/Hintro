import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateTask, deleteTask } from '../../store/slices/boardSlice';
import { closeTaskModal } from '../../store/slices/uiSlice';
import { Modal, Button, Input, Avatar } from '../Common';
import { api } from '../../services/api';
import { Task, Comment, User } from '../../types';
import toast from 'react-hot-toast';
import {
  Calendar,
  Users,
  MessageSquare,
  Trash2,
  Flag,
  Send,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Zap,
  FileText,
  UserPlus,
} from 'lucide-react';

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  { value: 'medium', label: 'Medium', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: AlertCircle },
  { value: 'high', label: 'High', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: AlertTriangle },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-50 text-red-700 border-red-200', icon: Zap },
];

export const TaskModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { taskModalOpen, selectedTask } = useAppSelector((state) => state.ui);
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('medium');
  const [dueDate, setDueDate] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
      setPriority(selectedTask.priority);
      setDueDate(selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : '');
      
      // Fetch full task details including comments
      fetchTaskDetails();
    }
  }, [selectedTask]);

  const fetchTaskDetails = async () => {
    if (!selectedTask) return;
    
    try {
      const task = await api.getTask(selectedTask.id);
      setComments(task.comments || []);
    } catch (error) {
      console.error('Failed to fetch task details:', error);
    }
  };

  const handleClose = () => {
    dispatch(closeTaskModal());
  };

  const handleSave = async () => {
    if (!selectedTask) return;

    setIsSaving(true);
    try {
      await dispatch(
        updateTask({
          id: selectedTask.id,
          data: {
            title: title.trim(),
            description: description.trim() || null,
            priority,
            dueDate: dueDate || null,
          },
        })
      ).unwrap();
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;
    
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await dispatch(
        deleteTask({ id: selectedTask.id, listId: selectedTask.listId })
      ).unwrap();
      toast.success('Task deleted');
      handleClose();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddComment = async () => {
    if (!selectedTask || !newComment.trim()) return;

    setIsLoading(true);
    try {
      const comment = await api.addComment(selectedTask.id, newComment.trim());
      setComments([comment, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (userId: string) => {
    if (!selectedTask) return;

    try {
      await api.assignTask(selectedTask.id, userId);
      toast.success('User assigned');
      fetchTaskDetails();
    } catch (error) {
      toast.error('Failed to assign user');
    }
  };

  if (!selectedTask) return null;

  const currentPriority = priorityOptions.find(p => p.value === priority);
  const PriorityIcon = currentPriority?.icon || Flag;

  return (
    <Modal isOpen={taskModalOpen} onClose={handleClose} size="lg">
      <div className="p-4 sm:p-6 pt-8 sm:pt-6">
        {/* Header */}
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl sm:text-2xl font-bold text-gray-900 w-full border-0 border-b-2 border-transparent hover:border-gray-200 focus:border-primary-500 focus:outline-none py-2 bg-transparent transition-colors"
            placeholder="Task title"
          />
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <FileText className="w-3 h-3 mr-1" />
              {selectedTask.list?.name || 'Unknown list'}
            </span>
            {currentPriority && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${currentPriority.color}`}>
                <PriorityIcon className="w-3 h-3 mr-1" />
                {currentPriority.label}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-primary-100 rounded-lg">
                  <FileText className="w-4 h-4 text-primary-600" />
                </div>
                Description
              </h4>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[120px] transition-all shadow-sm"
              />
            </div>

            {/* Comments */}
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                Comments
                <span className="ml-auto text-xs font-normal bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {comments.length}
                </span>
              </h4>

              {/* Add comment */}
              <div className="mb-4">
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 pr-20 bg-white border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleAddComment();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isLoading}
                    className="absolute right-2 bottom-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Press Ctrl+Enter to send</p>
              </div>

              {/* Comment list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 group">
                    <Avatar name={comment.user.name} size="sm" />
                    <div className="flex-1 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-gray-900">
                          {comment.user.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No comments yet</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Priority */}
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <Flag className="w-4 h-4 text-orange-600" />
                </div>
                Priority
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setPriority(opt.value)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        priority === opt.value
                          ? `${opt.color} ring-2 ring-offset-1 ring-current`
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                Due Date
              </h4>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Assignees */}
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-teal-100 rounded-lg">
                  <Users className="w-4 h-4 text-teal-600" />
                </div>
                Assignees
                {selectedTask.assignees && selectedTask.assignees.length > 0 && (
                  <span className="ml-auto text-xs font-normal bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {selectedTask.assignees.length}
                  </span>
                )}
              </h4>
              <div className="space-y-2">
                {selectedTask.assignees?.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <Avatar name={assignee.user.name} size="sm" />
                    <span className="text-sm font-medium text-gray-700">{assignee.user.name}</span>
                  </div>
                ))}
                {(!selectedTask.assignees || selectedTask.assignees.length === 0) && (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <UserPlus className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">No assignees yet</p>
                  </div>
                )}
              </div>
              
              {/* Add from board members */}
              {currentBoard?.members && currentBoard.members.filter(
                (m) => !selectedTask.assignees?.some((a) => a.userId === m.userId)
              ).length > 0 && (
                <div className="mt-3">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssign(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>+ Add member...</option>
                    {currentBoard.members
                      .filter(
                        (m) =>
                          !selectedTask.assignees?.some((a) => a.userId === m.userId)
                      )
                      .map((member) => (
                        <option key={member.userId} value={member.userId}>
                          {member.user.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-2">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={handleSave}
                isLoading={isSaving}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
