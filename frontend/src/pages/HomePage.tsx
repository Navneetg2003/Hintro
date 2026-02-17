import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchBoards } from '../store/slices/boardSlice';
import { openCreateBoardModal } from '../store/slices/uiSlice';
import { BoardCard, CreateBoardModal } from '../components/Board';
import { Button, Loading, Input } from '../components/Common';
import { Plus, Search, LayoutGrid, Layers, LogOut, ChevronDown } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Common';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { boards, isLoading } = useAppSelector((state) => state.boards);
  const { user } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchBoards({ query: searchQuery }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredBoards = searchQuery
    ? boards.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : boards;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-500 p-2 rounded-xl shadow-soft">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">TaskCollab</span>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search boards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
            </form>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Button onClick={() => dispatch(openCreateBoardModal())} className="hidden sm:flex">
                <Plus className="w-4 h-4 mr-2" />
                New Board
              </Button>
              <Button onClick={() => dispatch(openCreateBoardModal())} size="sm" className="sm:hidden">
                <Plus className="w-5 h-5" />
              </Button>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Avatar name={user?.name || 'User'} showStatus status="online" />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-gray-100 py-2 z-20 animate-scale-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile search */}
        <form onSubmit={handleSearch} className="mb-6 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all shadow-soft"
            />
          </div>
        </form>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-xl">
              <LayoutGrid className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Boards</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {filteredBoards.length} {filteredBoards.length === 1 ? 'board' : 'boards'}
              </p>
            </div>
          </div>
        </div>

        {/* Boards Grid */}
        {isLoading ? (
          <Loading size="lg" text="Loading your boards..." />
        ) : filteredBoards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBoards.map((board, index) => (
              <div 
                key={board.id} 
                className="animate-fade-in-up" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <BoardCard board={board} />
              </div>
            ))}
            
            {/* Create New Board Card */}
            <button
              onClick={() => dispatch(openCreateBoardModal())}
              className="h-44 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-primary-600 group"
            >
              <div className="p-3 rounded-xl bg-gray-100 group-hover:bg-primary-100 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-medium">Create new board</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
              <LayoutGrid className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No boards found' : 'No boards yet'}
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different search term or create a new board'
                : 'Create your first board to start collaborating with your team'}
            </p>
            {!searchQuery && (
              <Button onClick={() => dispatch(openCreateBoardModal())} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create your first board
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      <CreateBoardModal />
    </div>
  );
};
