import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Board } from '../../types';
import { Avatar } from '../Common';
import { Users, LayoutList, ArrowRight } from 'lucide-react';

interface BoardCardProps {
  board: Board;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-100 hover:border-primary-200"
    >
      {/* Board Header with Background */}
      <div
        className="h-28 p-5 relative overflow-hidden"
        style={{ backgroundColor: board.background }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
        
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white truncate drop-shadow-sm">
            {board.name}
          </h3>
          {board.description && (
            <p className="text-sm text-white/90 mt-1.5 truncate drop-shadow-sm">
              {board.description}
            </p>
          )}
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Board Footer */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          {/* Members */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {board.members.slice(0, 4).map((member) => (
                <Avatar
                  key={member.id}
                  name={member.user.name}
                  src={member.user.avatar}
                  size="sm"
                  className="ring-2 ring-white"
                />
              ))}
              {board.members.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 ring-2 ring-white">
                  +{board.members.length - 4}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {board.members.length}
            </span>
            {board._count && (
              <span className="flex items-center gap-1">
                <LayoutList className="w-4 h-4" />
                {board._count.lists}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
