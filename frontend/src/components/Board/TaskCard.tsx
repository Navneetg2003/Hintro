import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import { Avatar } from '../Common';
import { Calendar, MessageSquare, GripVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityColors = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
};

const priorityBorders = {
  low: 'border-l-emerald-400',
  medium: 'border-l-blue-500',
  high: 'border-l-orange-500',
  urgent: 'border-l-red-500',
};

const priorityDots = {
  low: 'bg-emerald-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const labels = task.labels ? JSON.parse(task.labels) : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600 bg-red-50' };
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-600 bg-orange-50' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-yellow-600 bg-yellow-50' };
    return { text: date.toLocaleDateString(), color: 'text-gray-600 bg-gray-50' };
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={onClick}
      className={`
        group bg-white rounded-xl shadow-soft border border-gray-100
        border-l-[3px] ${priorityBorders[task.priority]}
        p-3.5 cursor-pointer
        hover:shadow-soft-md hover:border-gray-200 
        transition-all duration-200 ease-smooth
        ${isDragging ? 'opacity-60 shadow-soft-lg scale-[1.02] rotate-1' : ''}
      `}
    >
      {/* Drag handle - visible on hover */}
      <div 
        {...listeners}
        className="absolute -left-0.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {labels.slice(0, 3).map((label: string, index: number) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs font-medium rounded-md bg-primary-50 text-primary-700 border border-primary-100"
            >
              {label}
            </span>
          ))}
          {labels.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600">
              +{labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h4 className="text-sm font-medium text-gray-900 mb-3 leading-snug">{task.title}</h4>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority indicator */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`} />
            <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <span className={`flex items-center text-xs px-1.5 py-0.5 rounded ${formatDate(task.dueDate).color}`}>
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(task.dueDate).text}
            </span>
          )}

          {/* Comments */}
          {task._count && task._count.comments > 0 && (
            <span className="flex items-center text-xs text-gray-500 gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {task._count.comments}
            </span>
          )}
        </div>

        {/* Assignees */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-1.5">
            {task.assignees.slice(0, 3).map((assignee) => (
              <Avatar
                key={assignee.id}
                name={assignee.user.name}
                src={assignee.user.avatar}
                size="xs"
                className="ring-2 ring-white"
              />
            ))}
            {task.assignees.length > 3 && (
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-600 ring-2 ring-white">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
