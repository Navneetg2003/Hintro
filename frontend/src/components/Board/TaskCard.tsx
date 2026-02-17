import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import { Avatar } from '../Common';
import { Calendar, MessageSquare, GripVertical, Paperclip, CheckSquare } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

/* ── Priority config ─────────────────────────────────────────── */
const priorityConfig = {
  low:    { bar: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-400', label: 'Low'    },
  medium: { bar: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',          dot: 'bg-blue-500',    label: 'Medium' },
  high:   { bar: 'bg-orange-500',  badge: 'bg-orange-50 text-orange-700 border-orange-200/80',    dot: 'bg-orange-500',  label: 'High'   },
  urgent: { bar: 'bg-red-500',     badge: 'bg-red-50 text-red-700 border-red-200/80',             dot: 'bg-red-500',     label: 'Urgent' },
};

/* Label color cycling ─────────────────────────────────────────── */
const labelPalette = [
  'bg-violet-50 text-violet-700 border-violet-200/80',
  'bg-sky-50 text-sky-700 border-sky-200/80',
  'bg-pink-50 text-pink-700 border-pink-200/80',
  'bg-amber-50 text-amber-700 border-amber-200/80',
  'bg-teal-50 text-teal-700 border-teal-200/80',
];

/* Date helper — unchanged logic ─────────────────────────────── */
const formatDate = (dateString: string) => {
  const date    = new Date(dateString);
  const now     = new Date();
  const diffMs  = date.getTime() - now.getTime();
  const diffDay = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDay < 0)  return { text: 'Overdue',   cls: 'bg-red-50 text-red-600 border-red-200/70',       icon: '🔴' };
  if (diffDay === 0) return { text: 'Today',     cls: 'bg-orange-50 text-orange-600 border-orange-200/70', icon: '🟠' };
  if (diffDay === 1) return { text: 'Tomorrow',  cls: 'bg-yellow-50 text-yellow-600 border-yellow-200/70', icon: '🟡' };
  return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), cls: 'bg-gray-50 text-gray-500 border-gray-200/70', icon: '📅' };
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

  /* Parse labels — same as original */
  const labels: string[] = task.labels ? JSON.parse(task.labels) : [];
  const priority = priorityConfig[task.priority] ?? priorityConfig.medium;

  /* Optional counts — defensive, no backend changes */
  const commentCount    = task._count?.comments    ?? 0;
  const attachmentCount = (task as any)._count?.attachments ?? 0;
  const checklistTotal  = (task as any)._count?.checklistItems ?? 0;
  const checklistDone   = (task as any)._count?.completedChecklistItems ?? 0;

  const dueInfo = task.dueDate ? formatDate(task.dueDate) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={onClick}
      className={`
        relative group bg-white rounded-xl border border-gray-100/80 cursor-pointer select-none
        transition-all duration-200 ease-out overflow-hidden
        ${isDragging
          ? 'opacity-50 shadow-2xl scale-[1.03] rotate-1 border-primary-200'
          : 'shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:border-gray-200'
        }
      `}
    >
      {/* Priority bar — left edge */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${priority.bar} rounded-l-xl`} />

      {/* Drag handle — appears on hover, positioned over the bar */}
      <div
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition-opacity duration-150
                   cursor-grab active:cursor-grabbing z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-3.5 h-3.5 text-white drop-shadow-sm" />
      </div>

      {/* Card body */}
      <div className="pl-4 pr-3 pt-3 pb-3">

        {/* Labels row */}
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {labels.slice(0, 3).map((label, i) => (
              <span
                key={i}
                className={`px-1.5 py-px text-[10px] font-semibold rounded border tracking-wide ${labelPalette[i % labelPalette.length]}`}
              >
                {label}
              </span>
            ))}
            {labels.length > 3 && (
              <span className="px-1.5 py-px text-[10px] font-semibold rounded border bg-gray-50 text-gray-500 border-gray-200/80">
                +{labels.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <p className="text-[13px] font-semibold text-gray-800 leading-snug mb-3 group-hover:text-gray-900 transition-colors">
          {task.title}
        </p>

        {/* Meta pills row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">

          {/* Priority badge */}
          <span className={`inline-flex items-center gap-1 px-1.5 py-px text-[10px] font-semibold rounded border ${priority.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>

          {/* Due date */}
          {dueInfo && (
            <span className={`inline-flex items-center gap-1 px-1.5 py-px text-[10px] font-semibold rounded border ${dueInfo.cls}`}>
              <Calendar className="w-2.5 h-2.5" />
              {dueInfo.text}
            </span>
          )}

          {/* Comments */}
          {commentCount > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-px text-[10px] font-semibold rounded border bg-gray-50 text-gray-500 border-gray-200/80">
              <MessageSquare className="w-2.5 h-2.5" />
              {commentCount}
            </span>
          )}

          {/* Attachments (shown if backend returns it) */}
          {attachmentCount > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-px text-[10px] font-semibold rounded border bg-gray-50 text-gray-500 border-gray-200/80">
              <Paperclip className="w-2.5 h-2.5" />
              {attachmentCount}
            </span>
          )}

          {/* Checklist progress (shown if backend returns it) */}
          {checklistTotal > 0 && (
            <span className={`inline-flex items-center gap-1 px-1.5 py-px text-[10px] font-semibold rounded border ${
              checklistDone === checklistTotal
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                : 'bg-gray-50 text-gray-500 border-gray-200/80'
            }`}>
              <CheckSquare className="w-2.5 h-2.5" />
              {checklistDone}/{checklistTotal}
            </span>
          )}
        </div>

        {/* Footer — assignees */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex items-center justify-end">
            <div className="flex -space-x-1.5">
              {task.assignees.slice(0, 4).map((assignee) => (
                <Avatar
                  key={assignee.id}
                  name={assignee.user.name}
                  src={assignee.user.avatar}
                  size="xs"
                  className="ring-2 ring-white hover:scale-110 hover:z-10 transition-transform duration-150"
                />
              ))}
              {task.assignees.length > 4 && (
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 ring-2 ring-white">
                  +{task.assignees.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hover shimmer — subtle right-edge glow */}
      <div className="absolute inset-0 bg-gradient-to-l from-primary-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
    </div>
  );
};