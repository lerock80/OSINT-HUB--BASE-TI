
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Shield, Settings, LogOut, Plus, Trash2, Edit3, 
  ExternalLink, Menu, X, Globe, User, Upload, FileText, 
  LayoutGrid, RotateCcw, Filter, Key, Users, UserPlus, 
  Lock, Download, Mail, UserCheck, LogIn
} from 'lucide-react';
import { Tool, Category, User as UserType, Member, View } from './types';
import { INITIAL_CATEGORIES, INITIAL_TOOLS } from './constants';

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
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence
  useEffect(() => {
    const savedTools = localStorage.getItem('osint_tools');
    const savedCategories = localStorage.getItem('osint_categories');
    const savedUsers = localStorage.getItem('osint_users');
    const savedMembers = localStorage.getItem('osint_members');

    if (savedTools) setTools(JSON.parse(savedTools));
    else setTools(INITIAL_TOOLS);

    if (savedCategories) setCategories(JSON.parse(savedCategories));
    else setCategories(INITIAL_CATEGORIES);

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    else setUsers([{ id: '1', username: 'Admin', password: 'baseti123456', role: 'admin' }]);

    if (savedMembers) setMembers(JSON.parse(savedMembers));
  }, []);

  useEffect(() => { localStorage.setItem('osint_tools', JSON.stringify(tools)); }, [tools]);
  useEffect(() => { localStorage.setItem('osint_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('osint_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('osint_members', JSON.stringify(members)); }, [members]);

  // Derived state
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || tool.categoryId === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, activeCategory]);

  // Auth Handlers
  const handleLogin = (u: string, p: string) => {
    const foundUser = users.find(usr => usr.username === u && usr.password === p);
    if (foundUser) {
      setIsLoggedIn(true);
      setCurrentUser(foundUser);
      setView('admin-panel');
    } else {
      alert('Credenciais inválidas!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setView('home');
  };

  // Mock Google Social Login
  const handleGoogleLogin = () => {
    // In a real app, this would trigger the Google Auth SDK
    const mockName = prompt("Simulação Google Login: Digite seu Nome Completo:");
    const mockEmail = prompt("Simulação Google Login: Digite seu E-mail:");

    if (mockName && mockEmail) {
      const existingMember = members.find(m => m.email === mockEmail);
      if (existingMember) {
        setCurrentMember(existingMember);
      } else {
        const newMember: Member = {
          id: 'mem-' + Date.now(),
          name: mockName,
          email: mockEmail,
          joinedAt: new Date().toLocaleDateString('pt-BR')
        };
        setMembers(prev => [...prev, newMember]);
        setCurrentMember(newMember);
      }
      setIsMemberLoggedIn(true);
      alert(`Bem-vindo, ${mockName}! Você agora tem acesso à Área de Membros.`);
    }
  };

  const handleMemberLogout = () => {
    setIsMemberLoggedIn(false);
    setCurrentMember(null);
    setView('home');
  };

  // Export Handlers
  const exportMembers = (format: 'csv' | 'txt') => {
    if (members.length === 0) return alert("Nenhum membro para exportar.");
    
    let content = "";
    const filename = `membros_base_ti_${Date.now()}.${format}`;

    if (format === 'csv') {
      content = "ID,Nome,Email,Data de Adesão\n";
      members.forEach(m => {
        content += `${m.id},"${m.name}",${m.email},${m.joinedAt}\n`;
      });
    } else {
      content = "RELATÓRIO DE MEMBROS - BASE TI OSINT\n";
      content += "====================================\n\n";
      members.forEach(m => {
        content += `Membro: ${m.name}\nEmail: ${m.email}\nDesde: ${m.joinedAt}\n--------------------\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // CRUD Handlers (Tools & Categories)
  const addTool = (tool: Omit<Tool, 'id'>) => {
    const newTool = { ...tool, id: 'tool-' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 4) };
    setTools(prev => [...prev, newTool]);
  };

  const removeTool = (id: string) => { setTools(tools.filter(t => t.id !== id)); };

  const addCategory = (name: string): string => {
    const existing = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing.id;
    const newId = 'cat-' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 4);
    setCategories(prev => [...prev, { id: newId, name }]);
    return newId;
  };

  const removeCategory = (id: string) => {
    if (confirm('Atenção: Remover esta categoria excluirá também todas as ferramentas associadas. Continuar?')) {
      setCategories(categories.filter(c => c.id !== id));
      setTools(tools.filter(t => t.categoryId !== id));
    }
  };

  // CRUD Handlers (Users/Operators)
  const addUser = (username: string, p: string, role: 'admin' | 'user') => {
    if (users.find(u => u.username === username)) return alert('Usuário já existe!');
    setUsers([...users, { id: Date.now().toString(), username, password: p, role }]);
  };

  const removeUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user?.username === 'Admin' || user?.id === currentUser?.id) return alert('Impossível remover este usuário agora.');
    if (confirm(`Remover usuário ${user?.username}?`)) setUsers(users.filter(u => u.id !== id));
  };

  const updateUser = (id: string, updates: Partial<UserType>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  // Import Handler
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n');
      const newTools: Tool[] = [];
      const tempCategories = [...categories];
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.toLowerCase().startsWith('categoria')) return;
        const parts = trimmed.includes(';') ? trimmed.split(';') : trimmed.split(',');
        if (parts.length >= 3) {
          const [catName, toolName, toolUrl] = parts.map(p => p.replace(/"/g, '').trim());
          let catId = tempCategories.find(c => c.name.toLowerCase() === catName.toLowerCase())?.id;
          if (!catId) {
            catId = 'cat-' + Date.now();
            tempCategories.push({ id: catId, name: catName });
          }
          newTools.push({
            id: 'tool-' + Date.now() + index,
            categoryId: catId,
            name: toolName,
            description: 'Importado',
            url: toolUrl.startsWith('http') ? toolUrl : `https://${toolUrl}`
          });
        }
      });
      setCategories(tempCategories);
      setTools(prev => [...prev, ...newTools]);
      alert('Importação concluída!');
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-sky-900/50">
        <a href="https://basetic.com.br/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 cursor-pointer group">
          <div className="p-2 bg-sky-500 rounded-lg shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase group-hover:text-sky-400 transition-colors">
              Base TI <span className="text-sky-400">- OSINT</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block -mt-1">
              Terminal de Operações
            </span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {!isMemberLoggedIn ? (
            <button 
              onClick={handleGoogleLogin}
              className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-200 transition"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Área de Membros
            </button>
          ) : (
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{currentMember?.name.split(' ')[0]}</span>
              </div>
              <button onClick={handleMemberLogout} className="text-xs font-bold text-slate-500 hover:text-red-400 transition">Sair</button>
            </div>
          )}

          {isLoggedIn && (
            <div className="flex items-center gap-2 px-3 py-1 bg-sky-500/10 rounded-full border border-sky-500/20">
              <User className="w-3 h-3 text-sky-400" />
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Op: {currentUser?.username}</span>
            </div>
          )}
          
          <button onClick={() => setView('home')} className={`text-sm font-semibold hover:text-sky-400 transition ${view === 'home' ? 'text-sky-400' : 'text-slate-400'}`}>Início</button>
          
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <button onClick={() => setView('admin-panel')} className={`text-sm font-semibold hover:text-sky-400 transition ${view === 'admin-panel' ? 'text-sky-400' : 'text-slate-400'}`}>Painel</button>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition"><LogOut className="w-5 h-5" /></button>
            </div>
          )}
        </div>

        <button className="md:hidden p-2 text-slate-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/95 flex flex-col items-center justify-center gap-8 text-xl">
          <button onClick={() => { setView('home'); setIsMobileMenuOpen(false); }}>Início</button>
          {!isMemberLoggedIn && <button onClick={() => { handleGoogleLogin(); setIsMobileMenuOpen(false); }}>Área de Membros</button>}
          {isLoggedIn && <button onClick={() => { setView('admin-panel'); setIsMobileMenuOpen(false); }}>Painel de Gestão</button>}
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-sky-500 rounded-full text-white"><X /></button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12">
        {view === 'home' && (
          <>
            {/* Hero */}
            <section className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full mb-6">
                <Shield className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-sky-400 tracking-widest uppercase">Base de Dados Unificada: {tools.length} Ferramentas</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-4 neon-text tracking-tighter">
                OSINT <span className="text-sky-500">Analytics</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 uppercase tracking-[0.2em] font-light">
                Inteligência de Fontes Abertas & Contexto Brasileiro
              </p>
              
              <div className="max-w-2xl mx-auto relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Busque por termos, órgãos, siglas ou links..."
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition shadow-2xl backdrop-blur-sm text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </section>

            {/* Categories */}
            <div className="z-40 glass border border-sky-900/30 mb-8 rounded-[2rem] overflow-hidden backdrop-blur-xl">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                  <Filter className="w-4 h-4 text-sky-500" />
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Categorias Inteligentes</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                  <button onClick={() => setActiveCategory('all')} className={`px-3 py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all border flex items-center justify-between gap-2 ${activeCategory === 'all' ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20' : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}>
                    <span className="truncate">Todos</span>
                    <span className="flex-shrink-0 text-[10px] opacity-60 bg-white/10 px-1.5 py-0.5 rounded">{tools.length}</span>
                  </button>
                  {categories.map(cat => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all border flex items-center justify-between gap-2 ${activeCategory === cat.id ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20' : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}>
                      <span className="truncate">{cat.name}</span>
                      <span className="flex-shrink-0 text-[10px] opacity-60 bg-white/10 px-1.5 py-0.5 rounded">{tools.filter(t => t.categoryId === cat.id).length}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map(tool => (
                <div key={tool.id} className="glass p-6 rounded-2xl flex flex-col group hover:border-sky-500/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-sky-950/50 text-sky-400 rounded-lg border border-sky-500/20 uppercase tracking-widest truncate max-w-[150px]">
                      {categories.find(c => c.id === tool.categoryId)?.name || 'Outros'}
                    </span>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800/80 rounded-xl hover:bg-sky-500 transition-colors group/link border border-slate-700">
                      <ExternalLink className="w-4 h-4 text-slate-300 group-hover/link:text-white" />
                    </a>
                  </div>
                  <h4 className="text-lg font-bold mb-2 group-hover:text-sky-400 transition-colors truncate">{tool.name}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-8 flex-1 line-clamp-3">{tool.description}</p>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="w-full text-center py-2.5 bg-slate-800/50 hover:bg-sky-500 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-slate-700">Acessar</a>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'admin-login' && (
          <div className="max-w-md mx-auto py-20">
            <div className="glass p-10 rounded-[2.5rem] shadow-2xl border border-sky-500/10">
              <div className="text-center mb-10 relative">
                <div className="p-4 bg-sky-500/10 rounded-3xl w-fit mx-auto mb-6 border border-sky-500/20">
                  <Lock className="w-12 h-12 text-sky-500" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Acesso Restrito</h2>
                <p className="text-slate-400 text-sm">Autenticação de Operador do Sistema</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const u = (e.currentTarget.elements.namedItem('user') as HTMLInputElement).value;
                const p = (e.currentTarget.elements.namedItem('pass') as HTMLInputElement).value;
                handleLogin(u, p);
              }}>
                <div className="space-y-5">
                  <input name="user" type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white" placeholder="Usuário" required />
                  <input name="pass" type="password" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white" placeholder="Senha" required />
                  <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-2xl transition-all">Entrar no Terminal</button>
                  <button type="button" onClick={() => setView('home')} className="w-full text-slate-500 text-xs font-bold uppercase py-2">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {view === 'admin-panel' && (
          <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tighter">Gestão de <span className="text-sky-500">Operações</span></h2>
                <p className="text-slate-400 mt-1">Terminal de controle centralizado</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv,.txt" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"><Upload className="w-4 h-4" /> Importar</button>
                <button onClick={() => { setTools(INITIAL_TOOLS); setCategories(INITIAL_CATEGORIES); }} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"><RotateCcw className="w-4 h-4" /> Resetar</button>
              </div>
            </header>

            {/* Members Section */}
            <section className="glass p-8 rounded-[2rem] border-emerald-500/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <Users className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Diretório de Membros</h3>
                    <p className="text-xs text-slate-500">Usuários registrados via login social</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => exportMembers('csv')} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Download className="w-3.5 h-3.5" /> Exportar CSV</button>
                  <button onClick={() => exportMembers('txt')} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Exportar TXT</button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                      <th className="pb-4">Nome</th>
                      <th className="pb-4">E-mail</th>
                      <th className="pb-4">Data de Adesão</th>
                      <th className="pb-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id} className="border-b border-slate-900 hover:bg-slate-900/30 transition-all">
                        <td className="py-4 font-bold text-sm text-white">{m.name}</td>
                        <td className="py-4 text-sm text-slate-400">{m.email}</td>
                        <td className="py-4 text-xs text-slate-500">{m.joinedAt}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => setMembers(members.filter(mem => mem.id !== m.id))} className="text-slate-600 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                    {members.length === 0 && (
                      <tr><td colSpan={4} className="py-8 text-center text-slate-600 italic">Nenhum membro registrado no momento.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Existing Tool Management Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
               {/* Operators Section */}
              <section className="glass p-8 rounded-[2rem] xl:col-span-2">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Key className="w-5 h-5 text-sky-400" /> Operadores do Sistema</h3>
                  <button onClick={() => { const u = prompt('User:'); const p = prompt('Pass:'); if(u&&p) addUser(u,p,'admin'); }} className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-xl text-xs font-bold uppercase">Novo Operador</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {users.map(u => (
                    <div key={u.id} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs block">{u.username}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{u.role}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { const p = prompt('Nova Senha:'); if(p) updateUser(u.id, {password: p}); }} className="text-slate-500 hover:text-sky-400"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => removeUser(u.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Categorias */}
              <section className="glass p-8 rounded-[2rem] xl:col-span-2">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2"><Globe className="w-5 h-5 text-sky-400" /> Categorias</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {categories.map(cat => (
                    <div key={cat.id} className="bg-slate-900/40 p-4 rounded-xl flex items-center justify-between border border-slate-800 group hover:border-sky-500/30 transition-all">
                      <div className="truncate"><span className="font-bold text-xs text-slate-200">{cat.name}</span></div>
                      <button onClick={() => removeCategory(cat.id)} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Ativos */}
              <section className="glass p-8 rounded-[2rem] xl:col-span-2">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-sky-400" /> Ativos</h3>
                  <button onClick={() => { const n = prompt('Nome:'); const d = prompt('Desc:'); const u = prompt('URL:'); const c = prompt('Cat ID:'); if(n&&d&&u&&c) addTool({name:n,description:d,url:u,categoryId:c}); }} className="bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all">Novo Ativo</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="text-slate-500 text-[10px] font-bold uppercase border-b border-slate-800"><th className="pb-4 text-left">Recurso</th><th className="pb-4 text-left">Categoria</th><th className="pb-4 text-right">Ação</th></tr></thead>
                    <tbody>
                      {tools.slice().reverse().map(tool => (
                        <tr key={tool.id} className="border-b border-slate-900 hover:bg-slate-900/30"><td className="py-4 font-bold text-sm">{tool.name}</td><td><span className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-800 rounded uppercase">{categories.find(c => c.id === tool.categoryId)?.name || 'Outros'}</span></td><td className="py-4 text-right"><button onClick={() => removeTool(tool.id)} className="text-slate-600 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-slate-900/50 text-center bg-slate-950/50">
        <a href="https://basetic.com.br/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 mb-6 group inline-flex">
           <Shield className="w-5 h-5 text-sky-500/40 group-hover:text-sky-500 transition-colors" />
           <span className="text-xl font-black text-slate-800 uppercase tracking-[0.3em] group-hover:text-slate-600 transition-colors">Base TI OSINT</span>
        </a>
        
        <div className="flex flex-col items-center gap-8">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-lg">
            Inteligência de Fontes Abertas & Monitoramento de Riscos Digitais. 
            © 2024 Terminal Central de Operações.
          </p>

          <div className="h-px w-20 bg-slate-900"></div>

          {/* Moved Painel Button to Footer */}
          {!isLoggedIn ? (
            <button 
              onClick={() => setView('admin-login')} 
              className="group flex items-center gap-2 text-slate-600 hover:text-sky-500 transition-all text-[10px] font-black uppercase tracking-[0.3em] border border-slate-900 hover:border-sky-500/30 px-6 py-2.5 rounded-full"
            >
              <Lock className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> 
              Terminal Administrativo
            </button>
          ) : (
            <button 
              onClick={() => setView('admin-panel')} 
              className="text-sky-500 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              Logado como Operador
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
