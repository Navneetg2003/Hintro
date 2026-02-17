import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchBoards } from '../store/slices/boardSlice';
import { openCreateBoardModal } from '../store/slices/uiSlice';
import { BoardCard, CreateBoardModal } from '../components/Board';
import { Button, Loading } from '../components/Common';
import { Avatar } from '../components/Common';
import {
  Plus, Search, LayoutGrid, Layers, LogOut,
  ChevronDown, Grid, List, TrendingUp, Users, Sparkles
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { boards, isLoading } = useAppSelector((state) => state.boards);
  const { user }              = useAppSelector((state) => state.auth);

  const [searchQuery,  setSearchQuery]  = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [viewMode,     setViewMode]     = useState<'grid' | 'list'>('grid');

  useEffect(() => { dispatch(fetchBoards()); }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchBoards({ query: searchQuery }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredBoards = searchQuery
    ? boards.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : boards;

  const totalLists   = boards.reduce((acc, b) => acc + (b._count?.lists   ?? 0), 0);
  const totalMembers = boards.reduce((acc, b) => acc + (b.members?.length ?? 0), 0);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          from { background-position: -600px 0; }
          to   { background-position:  600px 0; }
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.12); }
          50%       { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
        }
        .fade-up          { animation: fadeInUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        .slide-down       { animation: slideDown 0.2s ease-out both; }
        .pulse-ring       { animation: pulseRing 2.8s ease-in-out infinite; }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
          background-size: 600px 100%;
          animation: shimmer 1.6s infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50/80">

        {/* ── HEADER ─────────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="bg-gradient-to-br from-primary-600 to-primary-500 p-2 rounded-xl shadow-md shadow-primary-500/20 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight hidden sm:inline">TaskCollab</span>
            </div>

            {/* Search — desktop */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search boards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25
                             focus:border-primary-400 focus:bg-white transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >×</button>
                )}
              </div>
            </form>

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">

              {/* View toggle */}
              <div className="hidden sm:flex items-center p-1 bg-gray-100 rounded-lg gap-0.5">
                {(['grid', 'list'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    title={`${mode} view`}
                    className={`p-1.5 rounded-md transition-all duration-200 ${
                      viewMode === mode
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {mode === 'grid' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  </button>
                ))}
              </div>

              {/* New Board */}
              <Button
                onClick={() => dispatch(openCreateBoardModal())}
                className="hidden sm:flex items-center gap-1.5 !bg-gradient-to-r !from-primary-600 !to-primary-500
                           hover:!from-primary-700 hover:!to-primary-600 !shadow-md !shadow-primary-500/25
                           hover:!shadow-lg hover:!shadow-primary-500/35 hover:!-translate-y-0.5
                           !transition-all !duration-300 !text-sm !font-semibold !px-4 !rounded-xl"
              >
                <Plus className="w-4 h-4" />
                New Board
              </Button>
              <Button onClick={() => dispatch(openCreateBoardModal())} size="sm" className="sm:hidden">
                <Plus className="w-5 h-5" />
              </Button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-2 py-1.5 pl-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <Avatar name={user?.name || 'User'} showStatus status="online" />
                  <span className="hidden sm:block text-sm font-medium text-gray-800">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="slide-down absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100/80 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50/80 flex items-center gap-2.5 transition-colors"
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
        </header>

        {/* ── MAIN ────────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25
                           focus:border-primary-400 transition-all shadow-sm"
              />
            </div>
          </form>

          {/* Stats row — only when boards exist */}
          {!isLoading && boards.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4 fade-up" style={{ animationDelay: '0.05s' }}>
              {[
                { label: 'Boards',  value: boards.length, icon: LayoutGrid, bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100'    },
                { label: 'Lists',   value: totalLists,    icon: TrendingUp, bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-100'  },
                { label: 'Members', value: totalMembers,  icon: Users,      bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 border ${s.border}
                              shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-0.5
                              transition-all duration-300`}
                >
                  <div className={`p-2 rounded-xl ${s.bg} shrink-0`}>
                    <s.icon className={`w-4 h-4 ${s.text}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-gray-900 leading-none">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Section heading */}
          <div className="flex items-center justify-between fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-xl">
                <LayoutGrid className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Your Boards</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {filteredBoards.length} {filteredBoards.length === 1 ? 'board' : 'boards'}
                  {searchQuery && <span className="text-primary-500"> · "{searchQuery}"</span>}
                </p>
              </div>
            </div>
          </div>

          {/* ── BOARDS ──────────────────────────────────────── */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-gray-100 bg-white fade-up"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="h-32 skeleton-shimmer" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 skeleton-shimmer rounded-full w-3/4" />
                    <div className="h-2.5 skeleton-shimmer rounded-full w-1/2" />
                    <div className="flex gap-1.5 pt-1">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="w-7 h-7 skeleton-shimmer rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : filteredBoards.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-3'
            }>
              {filteredBoards.map((board, index) => (
                <div
                  key={board.id}
                  className="fade-up"
                  style={{ animationDelay: `${0.12 + index * 0.06}s` }}
                >
                  <BoardCard board={board} />
                </div>
              ))}

              {/* Create new board */}
              <button
                onClick={() => dispatch(openCreateBoardModal())}
                className={`pulse-ring rounded-2xl border-2 border-dashed border-gray-200
                            hover:border-primary-400 hover:bg-primary-50/40 transition-all duration-300
                            flex flex-col items-center justify-center gap-3 text-gray-400
                            hover:text-primary-600 group hover:-translate-y-1 fade-up
                            ${viewMode === 'list' ? 'py-5' : 'h-44'}`}
                style={{ animationDelay: `${0.12 + filteredBoards.length * 0.06}s` }}
              >
                <div className="p-3 rounded-xl bg-gray-100 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </div>
                <span className="text-sm font-semibold">Create new board</span>
              </button>
            </div>

          ) : (
            /* Empty state */
            <div className="fade-up text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl mb-6">
                {searchQuery
                  ? <Search className="w-9 h-9 text-primary-400" />
                  : <Sparkles className="w-9 h-9 text-primary-500" />
                }
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {searchQuery ? 'No boards found' : 'No boards yet'}
              </h2>
              <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search or create a new board.`
                  : 'Create your first board to start collaborating with your team.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => dispatch(openCreateBoardModal())} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create your first board
                </Button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </main>

        <CreateBoardModal />
      </div>
    </>
  );
};