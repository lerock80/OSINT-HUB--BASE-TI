import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Search, ExternalLink, Filter, Key, Users, Lock, UserCheck, ChevronDown, ChevronUp, Trash2, LogOut, Sun, Moon, Database, Zap, RefreshCcw, Layers, Maximize, Minimize, Plus, Edit2, Save, X, LayoutDashboard, ShieldCheck, Briefcase, FileUp
} from 'lucide-react';
import { Tool, Category, User as UserType, Member, View } from './types';
import { INITIAL_CATEGORIES, INITIAL_TOOLS, APP_VERSION } from './constants';

type AdminTab = 'dashboard' | 'tools' | 'categories' | 'members' | 'admins';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<View>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMemberLoggedIn, setIsMemberLoggedIn] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [memberAuthMode, setMemberAuthMode] = useState<'login' | 'signup'>('login');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Edit States
  const [editingItem, setEditingItem] = useState<{ type: string, id?: string } | null>(null);
  
  // Refs for scrolling
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('osint_theme');
    return saved === null ? true : saved === 'dark';
  });

  // Data Initialization
  useEffect(() => {
    const initializeTerminal = () => {
      const savedVersion = localStorage.getItem('osint_app_version');
      const savedTools = localStorage.getItem('osint_tools');
      const savedCategories = localStorage.getItem('osint_categories');
      const savedUsers = localStorage.getItem('osint_users');
      const savedMembers = localStorage.getItem('osint_members');

      const isOutdated = !savedVersion || savedVersion !== APP_VERSION;
      
      if (isOutdated) {
        setTools(INITIAL_TOOLS);
        setCategories(INITIAL_CATEGORIES);
        localStorage.setItem('osint_app_version', APP_VERSION);
        localStorage.setItem('osint_tools', JSON.stringify(INITIAL_TOOLS));
        localStorage.setItem('osint_categories', JSON.stringify(INITIAL_CATEGORIES));
      } else {
        setTools(savedTools ? JSON.parse(savedTools) : INITIAL_TOOLS);
        setCategories(savedCategories ? JSON.parse(savedCategories) : INITIAL_CATEGORIES);
      }
      
      setUsers(savedUsers ? JSON.parse(savedUsers) : [{ id: '1', username: 'Admin', password: 'baseti123456', role: 'admin' }]);
      setMembers(savedMembers ? JSON.parse(savedMembers) : []);
      setIsInitialized(true);
    };

    initializeTerminal();
  }, []);

  // Fullscreen Handler
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erro ao tentar ativar modo tela cheia: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const fsHandler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fsHandler);
    return () => document.removeEventListener('fullscreenchange', fsHandler);
  }, []);

  // Persistence
  const persistenceTimer = useRef<number | null>(null);
  useEffect(() => { 
    if (!isInitialized) return;
    if (persistenceTimer.current) window.clearTimeout(persistenceTimer.current);
    setIsSyncing(true);
    persistenceTimer.current = window.setTimeout(() => {
      localStorage.setItem('osint_tools', JSON.stringify(tools));
      localStorage.setItem('osint_categories', JSON.stringify(categories));
      localStorage.setItem('osint_users', JSON.stringify(users));
      localStorage.setItem('osint_theme', isDarkMode ? 'dark' : 'light');
      localStorage.setItem('osint_members', JSON.stringify(members));
      setIsSyncing(false);
    }, 800);
    return () => { if (persistenceTimer.current) window.clearTimeout(persistenceTimer.current); };
  }, [tools, categories, users, isDarkMode, members, isInitialized]);

  // Memoized Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length };
    tools.forEach(t => {
      counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
    });
    return counts;
  }, [tools]);

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return tools.filter(t => {
      const matchSearch = !query || t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query);
      const matchCat = activeCategory === 'all' || t.categoryId === activeCategory;
      return matchSearch && matchCat;
    });
  }, [tools, searchQuery, activeCategory]);

  const handleAdminLogin = useCallback((u: string, p: string) => {
    const found = users.find(usr => usr.username === u && usr.password === p);
    if (found) { setIsLoggedIn(true); setView('admin-panel'); setAdminTab('dashboard'); }
    else { alert('Acesso Negado.'); }
  }, [users]);

  const handleMemberLogin = useCallback((u: string, p: string) => {
    const found = members.find(m => (m.username === u || m.email === u) && m.password === p);
    if (found) { setIsMemberLoggedIn(true); setCurrentMember(found); setView('home'); }
    else { alert('Credenciais inválidas.'); }
  }, [members]);

  const scrollSidebar = (direction: 'up' | 'down') => {
    if (sidebarScrollRef.current) {
      const amount = 200;
      sidebarScrollRef.current.scrollBy({
        top: direction === 'up' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };

  // CRUD Handlers
  const addTool = (tool: Omit<Tool, 'id'>) => {
    const newTool = { ...tool, id: Date.now().toString() };
    setTools(prev => [newTool, ...prev]);
    setEditingItem(null);
  };

  const updateTool = (id: string, updated: Partial<Tool>) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    setEditingItem(null);
  };

  const deleteTool = (id: string) => {
    if (confirm('Deseja excluir esta ferramenta?')) {
      setTools(prev => prev.filter(t => t.id !== id));
    }
  };

  const addCategory = (name: string) => {
    const newCat = { id: `cat-${Date.now()}`, name };
    setCategories(prev => [...prev, newCat]);
    setEditingItem(null);
    return newCat;
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
    setEditingItem(null);
  };

  const deleteCategory = (id: string) => {
    if (confirm('Deseja excluir esta categoria? Isso afetará as ferramentas vinculadas.')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const addUser = (user: Omit<UserType, 'id'>) => {
    setUsers(prev => [...prev, { ...user, id: Date.now().toString() }]);
    setEditingItem(null);
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) return alert('Deve haver pelo menos um administrador.');
    if (confirm('Deseja excluir este administrador?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      if (lines.length < 2) return;

      // Header index detection (Category, Tool Name, URL, [Description])
      const header = lines[0].toLowerCase().split(/[;,]/);
      const catIdx = header.findIndex(h => h.includes('cat'));
      const nameIdx = header.findIndex(h => h.includes('name') || h.includes('ferramenta'));
      const urlIdx = header.findIndex(h => h.includes('url') || h.includes('link'));
      const descIdx = header.findIndex(h => h.includes('desc'));

      if (catIdx === -1 || nameIdx === -1 || urlIdx === -1) {
        alert('Formato de CSV inválido. Certifique-se de ter as colunas: Category, Tool Name, URL.');
        return;
      }

      const newTools: Tool[] = [];
      const updatedCategories = [...categories];
      let newToolsCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(/[;,]/);
        if (cols.length < 3) continue;

        const catName = cols[catIdx]?.trim();
        const toolName = cols[nameIdx]?.trim();
        const url = cols[urlIdx]?.trim();
        const description = descIdx !== -1 ? cols[descIdx]?.trim() : 'Importado via CSV';

        if (!catName || !toolName || !url) continue;

        // Find or Create Category
        let category = updatedCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());
        if (!category) {
          const createNew = confirm(`Categoria "${catName}" não encontrada. Deseja criá-la?`);
          if (createNew) {
            const newCat = { id: `cat-${Date.now()}-${i}`, name: catName };
            updatedCategories.push(newCat);
            category = newCat;
          } else {
            continue; // Skip this tool if user rejects category creation
          }
        }

        newTools.push({
          id: `csv-${Date.now()}-${i}`,
          name: toolName,
          description,
          url,
          categoryId: category.id
        });
        newToolsCount++;
      }

      if (newToolsCount > 0) {
        setCategories(updatedCategories);
        setTools(prev => [...newTools, ...prev]);
        alert(`${newToolsCount} ferramentas importadas com sucesso.`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 overflow-hidden ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f1f5f9] text-slate-900'}`}>
      {/* Header - Fixed */}
      <nav className={`${isDarkMode ? 'bg-slate-900/80 border-sky-900/50' : 'bg-white border-slate-200'} shrink-0 sticky top-0 z-50 px-6 py-2.5 flex items-center justify-between border-b backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          <a 
            href="https://treinamento.basetic.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-200 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <span className="text-black font-black text-sm lg:text-base tracking-tighter uppercase">Treinamentos</span>
          </a>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <button 
            onClick={toggleFullScreen}
            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-sky-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            title="Alternar Tela Cheia"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button onClick={() => setView('home')} className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400 hover:text-sky-400' : 'text-slate-600 hover:text-[#B02B2C]'}`}>Início</button>
          
          {!isMemberLoggedIn ? (
            <button 
              onClick={() => { setView('member-auth'); setMemberAuthMode('login'); }} 
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${isDarkMode ? 'bg-sky-500 text-white hover:bg-sky-400' : 'bg-[#B02B2C] text-white hover:opacity-90'}`}
            >
              Membros
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-emerald-400' : 'text-[#3D1B1B]'}`}>{currentMember?.name.split(' ')[0]}</span>
              <button onClick={() => setIsMemberLoggedIn(false)} className="text-red-500"><LogOut className="w-3.5 h-3.5" /></button>
            </div>
          )}
          {isLoggedIn && (
            <button onClick={() => setView('admin-panel')} className={`text-xs font-bold uppercase ${isDarkMode ? 'text-sky-500' : 'text-[#B02B2C]'}`}>Painel</button>
          )}
        </div>
      </nav>

      {/* Main Content Area - Fixed Viewport */}
      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-6 py-4 gap-6 overflow-hidden">
        
        {/* Sidebar for Desktop */}
        {view === 'home' && (
          <aside className="hidden md:flex flex-col w-56 lg:w-60 shrink-0 h-full overflow-hidden">
            <div className="flex items-center gap-2 mb-2 px-1 shrink-0">
              <Layers className={`w-3 h-3 ${isDarkMode ? 'text-sky-500' : 'text-[#B02B2C]'}`} />
              <h2 className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50">Categorias</h2>
            </div>
            
            <button 
              onClick={() => scrollSidebar('up')}
              className={`w-full flex justify-center py-1 mb-1 rounded-lg border transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-600 hover:text-sky-500' : 'bg-white border-slate-200 text-slate-400 hover:text-[#B02B2C]'}`}
            >
              <ChevronUp size={12} />
            </button>

            <div 
              ref={sidebarScrollRef}
              className="flex-1 overflow-y-auto pr-1 scrollbar-hide flex flex-col gap-1 py-1"
            >
              <button 
                onClick={() => setActiveCategory('all')} 
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-[9px] font-bold uppercase border transition-all shadow-sm shrink-0 ${
                  activeCategory === 'all' 
                    ? (isDarkMode ? 'bg-sky-500 border-sky-400 text-white' : 'bg-[#B02B2C] border-[#B02B2C] text-white') 
                    : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:border-[#B02B2C]')
                }`}
              >
                <span>Todos</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${isDarkMode ? 'bg-black/30 text-sky-400' : 'bg-white/20 text-white'}`}>
                  {categoryCounts.all}
                </span>
              </button>
              
              {categories.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setActiveCategory(c.id)} 
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-[9px] font-bold uppercase border transition-all shadow-sm shrink-0 ${
                    activeCategory === c.id 
                      ? (isDarkMode ? 'bg-sky-500 border-sky-400 text-white' : 'bg-[#B02B2C] border-[#B02B2C] text-white') 
                      : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:border-[#B02B2C]')
                }`}
                >
                  <span className="truncate pr-2">{c.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] shrink-0 ${
                    activeCategory === c.id 
                      ? (isDarkMode ? 'bg-black/30 text-sky-400' : 'bg-white/20 text-white')
                      : (isDarkMode ? 'bg-slate-950 text-slate-600' : 'bg-slate-100 text-slate-400')
                  }`}>
                    {categoryCounts[c.id] || 0}
                  </span>
                </button>
              ))}
            </div>

            <button 
              onClick={() => scrollSidebar('down')}
              className={`w-full flex justify-center py-1 mt-1 rounded-lg border transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-600 hover:text-sky-500' : 'bg-white border-slate-200 text-slate-400 hover:text-[#B02B2C]'}`}
            >
              <ChevronDown size={12} />
            </button>
          </aside>
        )}

        {/* Main Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {view === 'home' && (
            <div ref={mainContentRef} className="flex-1 overflow-y-auto scrollbar-hide flex flex-col pr-1">
              <div className="mb-6">
                <h1 className={`text-3xl lg:text-4xl font-black mb-1 tracking-tighter transition-all ${isDarkMode ? 'text-white neon-text' : 'text-[#3D1B1B]'}`}>
                  OSINT <span className={isDarkMode ? 'text-sky-500' : 'text-[#B02B2C]'}>TERMINAL</span>
                </h1>
                <p className={`font-bold uppercase tracking-[0.4em] text-[8px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Terminal Operacional de Inteligência</p>
                
                <div className="max-w-xl mt-4 relative group">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${isDarkMode ? 'text-slate-600 group-focus-within:text-sky-500' : 'text-slate-400 group-focus-within:text-[#B02B2C]'}`} />
                  <input 
                    type="text" placeholder="Buscar ferramenta estratégica..."
                    className={`w-full rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none transition shadow-lg border ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-white focus:ring-4 focus:ring-sky-500/10' : 'bg-white border-slate-200 text-slate-900 focus:ring-4 focus:ring-[#B02B2C]/5'}`}
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Mobile Categories - Horizontal Scroll */}
                <div className="md:hidden mt-6 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <Layers className={`w-3 h-3 ${isDarkMode ? 'text-sky-500' : 'text-[#B02B2C]'}`} />
                    <h2 className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50">Explorar Categorias</h2>
                  </div>
                  <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide -mx-1 px-1">
                    <button 
                      onClick={() => setActiveCategory('all')} 
                      className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-full text-[9px] font-black uppercase border transition-all shadow-sm ${
                        activeCategory === 'all' 
                          ? (isDarkMode ? 'bg-sky-500 border-sky-400 text-white' : 'bg-[#B02B2C] border-[#B02B2C] text-white') 
                          : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500')
                      }`}
                    >
                      <span>Todos</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${activeCategory === 'all' ? 'bg-black/20' : 'bg-slate-100/10'}`}>
                        {categoryCounts.all}
                      </span>
                    </button>
                    {categories.map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => setActiveCategory(c.id)} 
                        className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-full text-[9px] font-black uppercase border transition-all shadow-sm ${
                          activeCategory === c.id 
                            ? (isDarkMode ? 'bg-sky-500 border-sky-400 text-white' : 'bg-[#B02B2C] border-[#B02B2C] text-white') 
                            : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500')
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${activeCategory === c.id ? 'bg-black/20 text-sky-200' : 'bg-slate-100/10'}`}>
                          {categoryCounts[c.id] || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 pb-8">
                {filteredTools.length > 0 ? filteredTools.map(t => (
                  <a 
                    key={t.id} href={t.url} target="_blank" rel="noreferrer" 
                    className={`p-4 rounded-xl border transition-all group hover:-translate-y-1 shadow-sm flex flex-col justify-between min-h-[110px] backdrop-blur-md ${
                      isDarkMode 
                        ? 'bg-slate-900/30 border-sky-500/10 hover:border-sky-500/40 hover:bg-sky-500/5' 
                        : 'bg-white/60 border-slate-200 hover:border-[#B02B2C]/40 hover:bg-[#B02B2C]/5'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          isDarkMode ? 'bg-sky-950/40 text-sky-400 border-sky-500/30' : 'bg-[#B02B2C]/10 text-[#B02B2C] border-[#B02B2C]/20'
                        }`}>
                          {categories.find(cat => cat.id === t.categoryId)?.name}
                        </span>
                        <ExternalLink className={`w-3 h-3 opacity-30 transition-all group-hover:opacity-100 group-hover:scale-110 ${isDarkMode ? 'text-sky-400' : 'text-[#B02B2C]'}`} />
                      </div>
                      <h3 className={`font-black text-[13px] mb-1 tracking-tight leading-tight transition-colors ${isDarkMode ? 'text-white group-hover:text-sky-400' : 'text-[#3D1B1B] group-hover:text-[#B02B2C]'}`}>
                        {t.name}
                      </h3>
                      <p className={`text-[10px] leading-snug line-clamp-2 transition-colors ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-600'}`}>
                        {t.description}
                      </p>
                    </div>
                  </a>
                )) : (
                  <div className="col-span-full py-16 text-center">
                    <RefreshCcw className="w-10 h-10 text-slate-700 mx-auto mb-4 animate-spin-slow opacity-20" />
                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em]">Nenhum sinal detectado na frequência selecionada</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Member Auth View */}
          {view === 'member-auth' && (
            <div className="flex-1 overflow-y-auto flex items-center justify-center py-6 w-full">
              <div className={`w-full max-w-md p-8 rounded-2xl border shadow-2xl backdrop-blur-md ${isDarkMode ? 'bg-slate-900/80 border-sky-500/20' : 'bg-white/80 border-slate-200'}`}>
                <h2 className="text-2xl font-black text-center mb-6 uppercase tracking-tighter">
                  {memberAuthMode === 'login' ? 'Identificação' : 'Recrutamento'}
                </h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const u = (e.currentTarget.elements.namedItem('user') as HTMLInputElement).value;
                  const p = (e.currentTarget.elements.namedItem('pass') as HTMLInputElement).value;
                  if (memberAuthMode === 'login') handleMemberLogin(u, p);
                  else {
                    setMembers([...members, { id: Date.now().toString(), name: u, username: u, email: u, joinedAt: new Date().toLocaleDateString(), password: p }]);
                    alert('Cadastro realizado!'); setMemberAuthMode('login');
                  }
                }} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase opacity-50 px-1">Login Identidade</label>
                    <input name="user" type="text" className={`w-full border p-3.5 rounded-lg text-sm outline-none transition ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#B02B2C]'}`} placeholder="Usuário ou E-mail" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase opacity-50 px-1">Código de Acesso</label>
                    <input name="pass" type="password" className={`w-full border p-3.5 rounded-lg text-sm outline-none transition ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#B02B2C]'}`} placeholder="Senha" required />
                  </div>
                  <button type="submit" className={`w-full py-3.5 rounded-lg font-black uppercase text-xs tracking-widest transition-transform active:scale-95 ${isDarkMode ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-[#B02B2C] text-white shadow-lg shadow-[#B02B2C]/20'}`}>Acessar Terminal</button>
                  <button type="button" onClick={() => setMemberAuthMode(memberAuthMode === 'login' ? 'signup' : 'login')} className={`w-full text-[9px] font-bold uppercase mt-2 transition-colors ${isDarkMode ? 'text-slate-500 hover:text-sky-400' : 'text-slate-400 hover:text-[#B02B2C]'}`}>
                    {memberAuthMode === 'login' ? 'Ainda não é membro?' : 'Já possui acesso?'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Admin Panel View */}
          {view === 'admin-panel' && (
            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
              {/* Admin Sidebar */}
              <aside className={`w-full md:w-56 lg:w-64 shrink-0 flex flex-col gap-2 p-2 rounded-2xl border backdrop-blur-md ${isDarkMode ? 'bg-slate-900/30 border-sky-500/10' : 'bg-white/80 border-slate-200'}`}>
                <div className="p-3 mb-2 border-b border-white/5">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Administração</h2>
                </div>
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'tools', label: 'Ferramentas', icon: Briefcase },
                  { id: 'categories', label: 'Categorias', icon: Layers },
                  { id: 'members', label: 'Membros', icon: Users },
                  { id: 'admins', label: 'Administradores', icon: ShieldCheck }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => { setAdminTab(tab.id as AdminTab); setEditingItem(null); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-tight transition-all ${
                      adminTab === tab.id 
                      ? (isDarkMode ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-[#B02B2C] text-white')
                      : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100')
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
                
                <div className="mt-auto p-2 border-t border-white/5">
                  <button 
                    onClick={() => { setIsLoggedIn(false); setView('home'); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-tight text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Sair do Painel
                  </button>
                </div>
              </aside>

              {/* Admin Content Area */}
              <section className="flex-1 overflow-y-auto scrollbar-hide pr-1">
                {/* Tab: Dashboard */}
                {adminTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Ferramentas', value: tools.length, icon: Briefcase, color: 'sky' },
                        { label: 'Categorias', value: categories.length, icon: Layers, color: 'emerald' },
                        { label: 'Agentes', value: members.length, icon: Users, color: 'amber' },
                        { label: 'Admins', value: users.length, icon: ShieldCheck, color: 'rose' }
                      ].map(stat => (
                        <div key={stat.label} className={`p-6 rounded-2xl border backdrop-blur-md flex items-center justify-between ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
                            <p className="text-3xl font-black">{stat.value}</p>
                          </div>
                          <stat.icon className={`w-8 h-8 opacity-20 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                        </div>
                      ))}
                    </div>

                    <div className={`p-6 rounded-2xl border backdrop-blur-md ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <h3 className="text-sm font-black uppercase mb-4">Informações do Sistema</h3>
                      <div className="space-y-4 text-xs">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="opacity-50">Versão da Aplicação</span>
                          <span className="font-mono text-sky-400">v{APP_VERSION}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="opacity-50">Status da Sincronização</span>
                          <span className={`font-bold ${isSyncing ? 'text-amber-500' : 'text-emerald-500'}`}>{isSyncing ? 'Atualizando...' : 'Conectado'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-50">Storage Utilizado</span>
                          <span className="font-mono">{Math.round(JSON.stringify(localStorage).length / 1024)} KB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Tools Management */}
                {adminTab === 'tools' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-black uppercase tracking-tight">Gestão de Ferramentas</h2>
                      <div className="flex gap-2">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleCsvImport} 
                          accept=".csv" 
                          className="hidden" 
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          title="Formato: Category, Tool Name, URL, Description"
                        >
                          <FileUp size={14} /> Importar CSV
                        </button>
                        <button 
                          onClick={() => setEditingItem({ type: 'tool' })}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${isDarkMode ? 'bg-sky-500 text-white' : 'bg-[#B02B2C] text-white'}`}
                        >
                          <Plus size={14} /> Nova Ferramenta
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {tools.map(t => (
                        <div key={t.id} className={`p-4 rounded-xl border backdrop-blur-md flex items-center justify-between group ${isDarkMode ? 'bg-slate-900/30 border-white/5 hover:bg-white/5' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-black truncate">{t.name}</span>
                              <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/5 uppercase opacity-50">
                                {categories.find(c => c.id === t.categoryId)?.name || 'Sem Categoria'}
                              </span>
                            </div>
                            <p className="text-[10px] opacity-40 truncate">{t.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setEditingItem({ type: 'tool', id: t.id })}
                              className="p-2 rounded-lg bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => deleteTool(t.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Categories Management */}
                {adminTab === 'categories' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-black uppercase tracking-tight">Gestão de Categorias</h2>
                      <button 
                        onClick={() => setEditingItem({ type: 'category' })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${isDarkMode ? 'bg-sky-500 text-white' : 'bg-[#B02B2C] text-white'}`}
                      >
                        <Plus size={14} /> Nova Categoria
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categories.map(c => (
                        <div key={c.id} className={`p-4 rounded-xl border backdrop-blur-md flex items-center justify-between group ${isDarkMode ? 'bg-slate-900/30 border-white/5 hover:bg-white/5' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                          <div className="flex-1">
                            <p className="text-xs font-black">{c.name}</p>
                            <p className="text-[9px] opacity-40 uppercase font-bold">{categoryCounts[c.id] || 0} Ferramentas</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => setEditingItem({ type: 'category', id: c.id })}
                              className="p-2 rounded-lg text-slate-500 hover:text-sky-500 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => deleteCategory(c.id)}
                              className="p-2 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Members Management */}
                {adminTab === 'members' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-black uppercase tracking-tight">Gestão de Agentes</h2>
                    </div>

                    <div className={`rounded-2xl border backdrop-blur-md overflow-hidden ${isDarkMode ? 'bg-slate-900/30 border-white/5' : 'bg-white border-slate-200'}`}>
                      <table className="w-full text-left">
                        <thead>
                          <tr className={`text-[9px] font-black uppercase tracking-widest border-b ${isDarkMode ? 'border-white/5 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                            <th className="px-6 py-4">Nome do Agente</th>
                            <th className="px-6 py-4">Identificação</th>
                            <th className="px-6 py-4">Ingresso</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-bold divide-y divide-white/5">
                          {members.map(m => (
                            <tr key={m.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4">{m.name}</td>
                              <td className="px-6 py-4 font-mono opacity-50">{m.username}</td>
                              <td className="px-6 py-4 opacity-50">{m.joinedAt}</td>
                              <td className="px-6 py-4 text-right">
                                <button onClick={() => setMembers(members.filter(x => x.id !== m.id))} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tab: Admins Management */}
                {adminTab === 'admins' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-black uppercase tracking-tight">Administradores Alpha</h2>
                      <button 
                        onClick={() => setEditingItem({ type: 'admin' })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${isDarkMode ? 'bg-sky-500 text-white' : 'bg-[#B02B2C] text-white'}`}
                      >
                        <Plus size={14} /> Novo Admin
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {users.map(u => (
                        <div key={u.id} className={`p-6 rounded-2xl border backdrop-blur-md flex items-center justify-between ${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-[#B02B2C]/10 text-[#B02B2C]'}`}>
                              <ShieldCheck size={24} />
                            </div>
                            <div>
                              <p className="text-sm font-black">{u.username}</p>
                              <p className="text-[9px] font-bold uppercase opacity-40">Cargo: {u.role}</p>
                            </div>
                          </div>
                          <button 
                            disabled={users.length <= 1}
                            onClick={() => deleteUser(u.id)} 
                            className={`p-2 rounded-lg transition-colors ${users.length <= 1 ? 'opacity-20 cursor-not-allowed' : 'text-red-500 hover:bg-red-500/10'}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Admin Login View */}
          {view === 'admin-login' && (
             <div className="flex-1 overflow-y-auto flex items-center justify-center py-12 w-full">
              <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl relative overflow-hidden backdrop-blur-md ${isDarkMode ? 'bg-slate-900/80 border-red-500/20' : 'bg-white/80 border-slate-200'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent opacity-50"></div>
                <div className="flex justify-center mb-6"><Lock className={`w-10 h-10 ${isDarkMode ? 'text-red-500' : 'text-[#B02B2C]'}`} /></div>
                <h2 className="text-xl font-black text-center mb-6 uppercase tracking-widest">Acesso Alpha</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAdminLogin((e.currentTarget.elements.namedItem('u') as HTMLInputElement).value, (e.currentTarget.elements.namedItem('p') as HTMLInputElement).value);
                }} className="space-y-4">
                  <input name="u" type="text" className={`w-full border p-4 rounded-xl text-sm outline-none transition font-mono ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-red-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#B02B2C]'}`} placeholder="ADMIN_ID" required />
                  <input name="p" type="password" className={`w-full border p-4 rounded-xl text-sm outline-none transition font-mono ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-red-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#B02B2C]'}`} placeholder="SECURE_TOKEN" required />
                  <button type="submit" className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-[0.3em] transition-all shadow-xl active:scale-95 ${isDarkMode ? 'bg-red-600 text-white shadow-red-600/20' : 'bg-[#3D1B1B] text-white shadow-[#3D1B1B]/20'}`}>Validar Autorização</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CRUD MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-8 ${isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase">
                {editingItem.id ? 'Editar' : 'Novo'} {
                  editingItem.type === 'tool' ? 'Ferramenta' : 
                  editingItem.type === 'category' ? 'Categoria' : 
                  'Administrador'
                }
              </h3>
              <button onClick={() => setEditingItem(null)} className="opacity-50 hover:opacity-100"><X /></button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                if (editingItem.type === 'tool') {
                  const data = { 
                    name: fd.get('name') as string, 
                    description: fd.get('description') as string,
                    url: fd.get('url') as string,
                    categoryId: fd.get('categoryId') as string
                  };
                  editingItem.id ? updateTool(editingItem.id, data) : addTool(data);
                } else if (editingItem.type === 'category') {
                  const name = fd.get('name') as string;
                  editingItem.id ? updateCategory(editingItem.id, name) : addCategory(name);
                } else if (editingItem.type === 'admin') {
                  const u = fd.get('u') as string;
                  const p = fd.get('p') as string;
                  addUser({ username: u, password: p, role: 'admin' });
                }
              }}
              className="space-y-4"
            >
              {editingItem.type === 'tool' && (
                <>
                  <input name="name" defaultValue={tools.find(t => t.id === editingItem.id)?.name} placeholder="Nome da Ferramenta" className={`w-full p-3 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`} required />
                  <textarea name="description" defaultValue={tools.find(t => t.id === editingItem.id)?.description} placeholder="Descrição curta" className={`w-full p-3 rounded-lg border text-sm outline-none h-20 ${isDarkMode ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`} required />
                  <input name="url" type="url" defaultValue={tools.find(t => t.id === editingItem.id)?.url} placeholder="URL Estratégica (https://...)" className={`w-full p-3 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`} required />
                  <select name="categoryId" defaultValue={tools.find(t => t.id === editingItem.id)?.categoryId} className={`w-full p-3 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`} required>
                    <option value="">Selecione a Categoria</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </>
              )}
              {editingItem.type === 'category' && (
                <input name="name" defaultValue={categories.find(c => c.id === editingItem.id)?.name} placeholder="Nome da Categoria" className={`w-full p-3 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`} required />
              )}
              {editingItem.type === 'admin' && (
                <>
                  <input name="u" placeholder="Identificador Alpha" className={`w-full p-3 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`} required />
                  <input name="p" type="password" placeholder="Código de Segurança" className={`w-full p-3 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`} required />
                </>
              )}
              
              <button type="submit" className={`w-full py-3.5 rounded-lg font-black uppercase text-xs tracking-widest ${isDarkMode ? 'bg-sky-500 text-white' : 'bg-[#B02B2C] text-white'}`}>
                {editingItem.id ? 'Salvar Alterações' : 'Confirmar Cadastro'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer - Fixed */}
      <footer className={`shrink-0 py-3 border-t ${isDarkMode ? 'border-slate-900/50 bg-slate-950/20' : 'border-slate-200 bg-white'}`}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
          <div className="flex items-center gap-4">
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>BASE TI - OSINT System v{APP_VERSION}</p>
            <div className={`flex items-center gap-1.5 text-[8px] font-bold uppercase transition-opacity ${isSyncing ? 'opacity-100' : 'opacity-30'} ${isDarkMode ? 'text-sky-400' : 'text-[#B02B2C]'}`}>
              <Zap size={10} className={isSyncing ? 'animate-bounce' : ''} /> 
              {isSyncing ? 'Sync' : 'Active'}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setView('admin-login')} className={`transition-colors text-[9px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-800 hover:text-red-500' : 'text-slate-400 hover:text-[#B02B2C]'}`}>Restrito</button>
            <span className={`text-[10px] opacity-20 hidden md:inline ${isDarkMode ? 'text-white' : 'text-black'}`}>|</span>
            <p className={`text-[8px] font-bold uppercase ${isDarkMode ? 'text-slate-800' : 'text-slate-400'}`}>© {new Date().getFullYear()} Security Protocol</p>
          </div>
        </div>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .neon-text { text-shadow: 0 0 10px rgba(56, 189, 248, 0.3), 0 0 20px rgba(56, 189, 248, 0.1); }
        #root { height: 100%; width: 100%; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default App;