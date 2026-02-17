import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { createBoard } from '../../store/slices/boardSlice';
import { closeCreateBoardModal } from '../../store/slices/uiSlice';
import { Modal, Button, Input } from '../Common';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Palette, FileText, Type, Sparkles } from 'lucide-react';

const backgroundColors = [
  { color: '#1e3a5f', name: 'Navy' },
  { color: '#2d5a3d', name: 'Forest' },
  { color: '#5a2d2d', name: 'Burgundy' },
  { color: '#4a3d5a', name: 'Purple' },
  { color: '#3d4a5a', name: 'Slate' },
  { color: '#5a4a3d', name: 'Brown' },
  { color: '#2d4a5a', name: 'Teal' },
  { color: '#5a3d4a', name: 'Rose' },
  { color: '#0f766e', name: 'Emerald' },
  { color: '#7c3aed', name: 'Violet' },
];

export const CreateBoardModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { createBoardModalOpen } = useAppSelector((state) => state.ui);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [background, setBackground] = useState(backgroundColors[0].color);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    dispatch(closeCreateBoardModal());
    setName('');
    setDescription('');
    setBackground(backgroundColors[0].color);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Board name is required');
      return;
    }

    setIsLoading(true);
    try {
      const board = await dispatch(
        createBoard({
          name: name.trim(),
          description: description.trim() || undefined,
          background,
        })
      ).unwrap();
      
      toast.success('Board created!');
      handleClose();
      navigate(`/board/${board.id}`);
    } catch (error) {
      toast.error('Failed to create board');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={createBoardModalOpen} onClose={handleClose} title="Create Board">
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Preview */}
        <div
          className="h-24 sm:h-28 rounded-xl sm:rounded-2xl flex items-end p-4 sm:p-5 transition-all duration-300 relative overflow-hidden shadow-soft-md"
          style={{ backgroundColor: background }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
          
          <div className="relative z-10">
            <span className="text-white font-bold text-lg truncate drop-shadow-sm block">
              {name || 'Board name'}
            </span>
            {description && (
              <span className="text-white/70 text-sm truncate block mt-1">
                {description}
              </span>
            )}
          </div>
          
          <div className="absolute top-3 right-3">
            <Sparkles className="w-5 h-5 text-white/30" />
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Type className="w-4 h-4" />
            Board name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter board name"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4" />
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            className="w-full p-3.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all hover:border-gray-300"
            rows={3}
          />
        </div>

        {/* Background Color */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Palette className="w-4 h-4" />
            Background color
          </label>
          <div className="flex gap-2.5 flex-wrap">
            {backgroundColors.map((bg) => (
              <button
                key={bg.color}
                type="button"
                onClick={() => setBackground(bg.color)}
                className={`
                  w-10 h-10 rounded-xl transition-all duration-200
                  ${background === bg.color 
                    ? 'ring-2 ring-primary-500 ring-offset-2 scale-110 shadow-soft-md' 
                    : 'hover:scale-105 hover:shadow-soft'
                  }
                `}
                style={{ backgroundColor: bg.color }}
                title={bg.name}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            <Sparkles className="w-4 h-4 mr-2" />
            Create Board
          </Button>
        </div>
      </form>
    </Modal>
  );
};
