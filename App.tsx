import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ExternalLink, Filter, Key, Users, Lock, UserCheck, ChevronDown, ChevronUp, Trash2, LogOut, Sun, Moon
} from 'lucide-react';
import { Tool, Category, User as UserType, Member, View } from './types';
import { INITIAL_CATEGORIES, INITIAL_TOOLS, APP_VERSION } from './constants';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<View>('home');
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
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('osint_theme');
    return saved === null ? true : saved === 'dark';
  });

  // Persistence
  useEffect(() => {
    const savedTools = localStorage.getItem('osint_tools');
    const savedCategories = localStorage.getItem('osint_categories');
    const savedUsers = localStorage.getItem('osint_users');
    const savedMembers = localStorage.getItem('osint_members');

    setTools(savedTools ? JSON.parse(savedTools) : INITIAL_TOOLS);
    setCategories(savedCategories ? JSON.parse(savedCategories) : INITIAL_CATEGORIES);
    setUsers(savedUsers ? JSON.parse(savedUsers) : [{ id: '1', username: 'Admin', password: 'baseti123456', role: 'admin' }]);
    setMembers(savedMembers ? JSON.parse(savedMembers) : []);
    
    setIsInitialized(true);
  }, []);

  useEffect(() => { 
    if (isInitialized) {
      localStorage.setItem('osint_tools', JSON.stringify(tools));
      localStorage.setItem('osint_theme', isDarkMode ? 'dark' : 'light');
    }
  }, [tools, isDarkMode, isInitialized]);

  useEffect(() => { if (isInitialized) localStorage.setItem('osint_members', JSON.stringify(members)); }, [members, isInitialized]);

  // Contadores de ferramentas por categoria
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length };
    categories.forEach(cat => {
      counts[cat.id] = tools.filter(t => t.categoryId === cat.id).length;
    });
    return counts;
  }, [tools, categories]);

  // Auth Handlers
  const handleAdminLogin = (u: string, p: string) => {
    const found = users.find(usr => usr.username === u && usr.password === p);
    if (found) { setIsLoggedIn(true); setView('admin-panel'); }
    else { alert('Acesso Negado.'); }
  };

  const handleMemberLogin = (u: string, p: string) => {
    const found = members.find(m => (m.username === u || m.email === u) && m.password === p);
    if (found) { setIsMemberLoggedIn(true); setCurrentMember(found); setView('home'); }
    else { alert('Credenciais inválidas.'); }
  };

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'all' || t.categoryId === activeCategory;
      return matchSearch && matchCat;
    });
  }, [tools, searchQuery, activeCategory]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#f1f5f9] text-slate-900'}`}>
      {/* Header */}
      <nav className={`${isDarkMode ? 'bg-slate-900/80 border-sky-900/50' : 'bg-white border-slate-200'} sticky top-0 z-50 px-6 py-3 flex items-center justify-between border-b backdrop-blur-md`}>
        <div className="flex items-center gap-3 group">
          <a 
            href="https://basetic.com.br/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 transition-transform hover:scale-105 active:scale-95"
          >
            <span className="text-black font-black text-lg tracking-tighter">BASE TI</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button onClick={() => setView('home')} className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400 hover:text-sky-400' : 'text-slate-600 hover:text-[#B02B2C]'}`}>Início</button>
          
          {!isMemberLoggedIn ? (
            <button 
              onClick={() => { setView('member-auth'); setMemberAuthMode('login'); }} 
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition ${isDarkMode ? 'bg-sky-500 text-white hover:bg-sky-400' : 'bg-[#B02B2C] text-white hover:opacity-90'}`}
            >
              Membros
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-emerald-400' : 'text-[#3D1B1B]'}`}>{currentMember?.name.split(' ')[0]}</span>
              <button onClick={() => setIsMemberLoggedIn(false)} className="text-red-500"><LogOut className="w-4 h-4" /></button>
            </div>
          )}
          {isLoggedIn && (
            <button onClick={() => setView('admin-panel')} className={`text-xs font-bold uppercase ${isDarkMode ? 'text-sky-500' : 'text-[#B02B2C]'}`}>Painel</button>
          )}
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-10">
        {view === 'home' && (
          <>
            <div className="text-center mb-12">
              <h1 className={`text-5xl md:text-7xl font-black mb-2 tracking-tighter transition-all ${isDarkMode ? 'text-white neon-text' : 'text-[#3D1B1B]'}`}>
                OSINT <span className={isDarkMode ? 'text-sky-500' : 'text-[#B02B2C]'}>TERMINAL</span>
              </h1>
              <p className={`font-bold uppercase tracking-[0.4em] text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Terminal Operacional de Inteligência</p>
              
              <div className="max-w-xl mx-auto mt-10 relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                <input 
                  type="text" placeholder="Buscar ferramenta estratégica..."
                  className={`w-full rounded-xl py-4 pl-12 pr-4 outline-none transition shadow-sm border ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-white focus:ring-2 focus:ring-sky-500/50' : 'bg-white border-slate-200 text-slate-900 focus:border-[#B02B2C]'}`}
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Menu de Categorias Reorganizado em Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10 max-w-7xl mx-auto">
              <button 
                onClick={() => setActiveCategory('all')} 
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-[10px] font-bold uppercase border transition shadow-sm ${
                  activeCategory === 'all' 
                    ? (isDarkMode ? 'bg-sky-500 border-sky-400 text-white ring-2 ring-sky-500/20' : 'bg-[#B02B2C] border-[#B02B2C] text-white ring-2 ring-[#B02B2C]/20') 
                    : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:border-[#B02B2C]')
                }`}
              >
                <span>Todos</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${isDarkMode ? 'bg-black/30 text-sky-400' : 'bg-white/20 text-white'}`}>
                  {categoryCounts.all}
                </span>
              </button>
              
              {categories.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setActiveCategory(c.id)} 
                  className={`flex items-center justify-between px-3 py-3 rounded-lg text-[10px] font-bold uppercase border transition shadow-sm ${
                    activeCategory === c.id 
                      ? (isDarkMode ? 'bg-sky-500 border-sky-400 text-white ring-2 ring-sky-500/20' : 'bg-[#B02B2C] border-[#B02B2C] text-white ring-2 ring-[#B02B2C]/20') 
                      : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:border-[#B02B2C]')
                  }`}
                >
                  <span className="truncate mr-2">{c.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] shrink-0 ${
                    activeCategory === c.id 
                      ? (isDarkMode ? 'bg-black/30 text-sky-400' : 'bg-white/20 text-white')
                      : (isDarkMode ? 'bg-slate-950 text-slate-600' : 'bg-slate-100 text-slate-400')
                  }`}>
                    {categoryCounts[c.id] || 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredTools.map(t => (
                <a 
                  key={t.id} href={t.url} target="_blank" rel="noreferrer" 
                  className={`p-5 rounded-xl border transition-all group hover:-translate-y-1 shadow-sm ${
                    isDarkMode ? 'bg-slate-900/40 border-slate-800 hover:border-sky-500/50' : 'bg-white border-slate-200 hover:border-[#B02B2C]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                      isDarkMode ? 'bg-sky-950 text-sky-400 border-sky-500/30' : 'bg-[#B02B2C]/10 text-[#B02B2C] border-[#B02B2C]/20'
                    }`}>
                      {categories.find(cat => cat.id === t.categoryId)?.name}
                    </span>
                    <ExternalLink className={`w-3 h-3 ${isDarkMode ? 'text-slate-600 group-hover:text-sky-400' : 'text-slate-400 group-hover:text-[#B02B2C]'}`} />
                  </div>
                  <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-[#3D1B1B]'}`}>{t.name}</h3>
                  <p className={`text-[11px] leading-tight line-clamp-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{t.description}</p>
                </a>
              ))}
            </div>
          </>
        )}

        {/* Member Auth View */}
        {view === 'member-auth' && (
          <div className="max-w-md mx-auto py-10">
            <div className={`p-8 rounded-2xl border shadow-xl ${isDarkMode ? 'bg-slate-900/80 border-sky-500/20' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-black text-center mb-6 uppercase tracking-tighter">
                {memberAuthMode === 'login' ? 'Acesso Membro' : 'Cadastro BaseTI'}
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
                <input name="user" type="text" className={`w-full border p-3 rounded-lg outline-none transition ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#B02B2C]'}`} placeholder="Usuário/Email" required />
                <input name="pass" type="password" className={`w-full border p-3 rounded-lg outline-none transition ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#B02B2C]'}`} placeholder="Senha" required />
                <button type="submit" className={`w-full py-3 rounded-lg font-bold uppercase text-xs transition ${isDarkMode ? 'bg-sky-500 text-white' : 'bg-[#B02B2C] text-white'}`}>Entrar no Terminal</button>
                <button type="button" onClick={() => setMemberAuthMode(memberAuthMode === 'login' ? 'signup' : 'login')} className={`w-full text-[10px] font-bold uppercase mt-2 ${isDarkMode ? 'text-sky-400' : 'text-[#B02B2C]'}`}>Alternar Modo</button>
              </form>
            </div>
          </div>
        )}

        {/* Admin Login View */}
        {view === 'admin-login' && (
          <div className="max-w-md mx-auto py-20">
            <div className={`p-8 rounded-2xl border shadow-xl ${isDarkMode ? 'bg-slate-900/80 border-red-500/20' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-center mb-6"><Lock className={`w-10 h-10 ${isDarkMode ? 'text-red-500' : 'text-[#B02B2C]'}`} /></div>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAdminLogin((e.currentTarget.elements.namedItem('u') as HTMLInputElement).value, (e.currentTarget.elements.namedItem('p') as HTMLInputElement).value);
              }} className="space-y-4">
                <input name="u" type="text" className={`w-full border p-3 rounded-lg outline-none transition ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="ID Admin" required />
                <input name="p" type="password" className={`w-full border p-3 rounded-lg outline-none transition ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Token" required />
                <button type="submit" className={`w-full py-3 rounded-lg font-black uppercase text-xs ${isDarkMode ? 'bg-white text-black' : 'bg-[#3D1B1B] text-white'}`}>Validar Credenciais</button>
              </form>
            </div>
          </div>
        )}

        {/* Admin Panel View */}
        {view === 'admin-panel' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black uppercase">Gestão <span className={isDarkMode ? 'text-sky-500' : 'text-[#B02B2C]'}>Master</span></h2>
              <button onClick={() => { setIsLoggedIn(false); setView('home'); }} className="text-red-500 font-bold uppercase text-[10px]">Sair do Painel</button>
            </div>

            <section className={`rounded-xl overflow-hidden border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2"><Users className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-[#3D1B1B]'}`} /><span className="text-xs font-bold uppercase">Membros Cadastrados</span></div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#B02B2C]/10 text-[#B02B2C]'}`}>{members.length}</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead><tr className={`${isDarkMode ? 'text-slate-500 border-white/5' : 'text-slate-400 border-slate-100'} border-b`}><th className="pb-2">Nome</th><th className="pb-2">Login</th><th className="pb-2 text-right">Ação</th></tr></thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id} className={`${isDarkMode ? 'border-white/5' : 'border-slate-50'} border-b`}><td className="py-3 font-bold">{m.name}</td><td>{m.username}</td><td className="text-right"><button onClick={() => setMembers(members.filter(x => x.id !== m.id))} className="text-red-500 hover:scale-110 transition-transform"><Trash2 className="w-3 h-3" /></button></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className={`py-10 border-t text-center ${isDarkMode ? 'border-slate-900/50 bg-slate-950/20' : 'border-slate-200 bg-white'}`}>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>BASE TI - OSINT System v{APP_VERSION}</p>
        <button onClick={() => setView('admin-login')} className={`transition-colors text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-800 hover:text-sky-900' : 'text-slate-400 hover:text-[#B02B2C]'}`}>Acesso Restrito</button>
      </footer>
    </div>
  );
};

export default App;