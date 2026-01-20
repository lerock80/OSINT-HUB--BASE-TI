
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Shield, Settings, LogOut, Plus, Trash2, Edit3, 
  ExternalLink, Menu, X, Globe, User, Upload, FileText, 
  LayoutGrid, RotateCcw, Filter, Key, Users, UserPlus, 
  Lock, Download, Mail, UserCheck, LogIn, RefreshCw, AlertTriangle
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
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence & Cache Control (Aggressive Reconciliation)
  useEffect(() => {
    const initApp = () => {
      const savedToolsRaw = localStorage.getItem('osint_tools');
      const savedCategoriesRaw = localStorage.getItem('osint_categories');
      const savedUsersRaw = localStorage.getItem('osint_users');
      const savedMembersRaw = localStorage.getItem('osint_members');
      const savedVersion = localStorage.getItem('osint_version');

      let currentTools: Tool[] = savedToolsRaw ? JSON.parse(savedToolsRaw) : [...INITIAL_TOOLS];
      let currentCategories: Category[] = savedCategoriesRaw ? JSON.parse(savedCategoriesRaw) : [...INITIAL_CATEGORIES];

      // Version Mismatch Check
      if (savedVersion !== APP_VERSION) {
        console.warn(`Atualização detectada: ${savedVersion} -> ${APP_VERSION}. Aplicando patches de dados...`);
        
        // Ensure all new default tools are present
        INITIAL_TOOLS.forEach(defaultTool => {
          if (!currentTools.find(t => t.id === defaultTool.id)) {
            currentTools.push(defaultTool);
          }
        });

        // Ensure all new default categories are present
        INITIAL_CATEGORIES.forEach(defaultCat => {
          if (!currentCategories.find(c => c.id === defaultCat.id)) {
            currentCategories.push(defaultCat);
          }
        });

        localStorage.setItem('osint_version', APP_VERSION);
        setShowUpdateToast(true);
        setTimeout(() => setShowUpdateToast(false), 5000);
      }

      setTools(currentTools);
      setCategories(currentCategories);
      
      if (savedUsersRaw) setUsers(JSON.parse(savedUsersRaw));
      else setUsers([{ id: '1', username: 'Admin', password: 'baseti123456', role: 'admin' }]);

      if (savedMembersRaw) setMembers(JSON.parse(savedMembersRaw));
      
      setIsInitialized(true);
    };

    initApp();
  }, []);

  // Persistent Storage Updates
  useEffect(() => { if (isInitialized) localStorage.setItem('osint_tools', JSON.stringify(tools)); }, [tools, isInitialized]);
  useEffect(() => { if (isInitialized) localStorage.setItem('osint_categories', JSON.stringify(categories)); }, [categories, isInitialized]);
  useEffect(() => { if (isInitialized) localStorage.setItem('osint_users', JSON.stringify(users)); }, [users, isInitialized]);
  useEffect(() => { if (isInitialized) localStorage.setItem('osint_members', JSON.stringify(members)); }, [members, isInitialized]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;
      try {
        if (e.key === 'osint_tools') setTools(JSON.parse(e.newValue || '[]'));
        if (e.key === 'osint_categories') setCategories(JSON.parse(e.newValue || '[]'));
        if (e.key === 'osint_users') setUsers(JSON.parse(e.newValue || '[]'));
        if (e.key === 'osint_members') setMembers(JSON.parse(e.newValue || '[]'));
      } catch (err) { console.error("Erro na sincronização de abas:", err); }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const forceDataSync = () => {
    if (confirm('Deseja forçar a sincronização de dados? Isso recarregará todas as ferramentas padrão e removerá qualquer cache corrompido.')) {
      localStorage.removeItem('osint_tools');
      localStorage.removeItem('osint_categories');
      localStorage.setItem('osint_version', APP_VERSION);
      window.location.reload();
    }
  };

  const fullSystemReset = () => {
    if (confirm('ATENÇÃO: Isso apagará TODOS os dados salvos neste navegador, incluindo membros, ferramentas personalizadas e operadores. Continuar?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

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
    } else { alert('Credenciais inválidas!'); }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setView('home');
  };

  // Fix: Added missing handleMemberLogout function
  const handleMemberLogout = () => {
    setIsMemberLoggedIn(false);
    setCurrentMember(null);
  };

  const handleGoogleLogin = () => {
    const mockName = prompt("Simulação Google Login: Nome Completo:");
    const mockEmail = prompt("Simulação Google Login: E-mail:");
    if (mockName && mockEmail) {
      const existingMember = members.find(m => m.email === mockEmail);
      if (existingMember) { setCurrentMember(existingMember); } 
      else {
        const newMember: Member = { id: 'mem-' + Date.now(), name: mockName, email: mockEmail, joinedAt: new Date().toLocaleDateString('pt-BR') };
        setMembers(prev => [...prev, newMember]);
        setCurrentMember(newMember);
      }
      setIsMemberLoggedIn(true);
      alert(`Bem-vindo, ${mockName}!`);
    }
  };

  const exportMembers = (format: 'csv' | 'txt') => {
    if (members.length === 0) return alert("Nenhum membro.");
    let content = format === 'csv' ? "ID,Nome,Email,Data\n" : "RELATÓRIO DE MEMBROS\n\n";
    members.forEach(m => {
      content += format === 'csv' ? `${m.id},"${m.name}",${m.email},${m.joinedAt}\n` : `Membro: ${m.name} | ${m.email}\n`;
    });
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `membros_base_ti.${format}`;
    link.click();
  };

  // CRUD
  const addTool = (tool: Omit<Tool, 'id'>) => { setTools(prev => [...prev, { ...tool, id: 'tool-' + Date.now() }]); };
  const removeTool = (id: string) => { setTools(tools.filter(t => t.id !== id)); };
  const addCategory = (name: string) => { setCategories(prev => [...prev, { id: 'cat-' + Date.now(), name }]); };
  const removeCategory = (id: string) => {
    if (confirm('Remover categoria e suas ferramentas?')) {
      setCategories(categories.filter(c => c.id !== id));
      setTools(tools.filter(t => t.categoryId !== id));
    }
  };

  const addUser = (u: string, p: string) => { setUsers(prev => [...prev, { id: 'usr-' + Date.now(), username: u, password: p, role: 'admin' }]); };
  const removeUser = (id: string) => { if(users.length > 1) setUsers(prev => prev.filter(u => u.id !== id)); };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = (event.target?.result as string).split('\n');
      const newTools: Tool[] = [];
      lines.forEach((line, i) => {
        const parts = line.split(/[;,]/);
        if (parts.length >= 3) {
          const [cat, name, url] = parts.map(p => p.trim());
          if(name && url) newTools.push({ id: 'imp-' + Date.now() + i, categoryId: 'cat-tel', name, url, description: 'Importado' });
        }
      });
      setTools(prev => [...prev, ...newTools]);
      alert('Importado!');
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Update Toast */}
      {showUpdateToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-sky-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm font-bold">Sistema atualizado para v{APP_VERSION}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-sky-900/50">
        <a href="https://basetic.com.br/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
          <div className="p-2 bg-sky-500 rounded-lg group-hover:scale-110 transition-transform"><Shield className="w-6 h-6 text-white" /></div>
          <div>
            <h1 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">Base TI <span className="text-sky-400">- OSINT</span></h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block -mt-1">Terminal Operacional v{APP_VERSION}</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {!isMemberLoggedIn ? (
            <button onClick={handleGoogleLogin} className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-200 transition">
              <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" /> Área de Membros
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
          <button onClick={() => setView('home')} className={`text-sm font-semibold hover:text-sky-400 transition ${view === 'home' ? 'text-sky-400' : 'text-slate-400'}`}>Início</button>
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <button onClick={() => setView('admin-panel')} className="text-sm font-semibold text-sky-400">Painel</button>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition"><LogOut className="w-5 h-5" /></button>
            </div>
          )}
        </div>
        <button className="md:hidden p-2 text-slate-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X /> : <Menu />}</button>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-12">
        {view === 'home' && (
          <>
            <section className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full mb-6">
                <Shield className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-sky-400 tracking-widest uppercase">Base de Dados: {tools.length} Ativos</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-4 neon-text tracking-tighter">OSINT <span className="text-sky-500">Analytics</span></h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 uppercase tracking-[0.2em] font-light">Inteligência de Fontes Abertas</p>
              <div className="max-w-2xl mx-auto relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors w-5 h-5" />
                <input type="text" placeholder="Busque por termos, órgãos ou siglas..." className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-sky-500/30 transition text-lg outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </section>

            <div className="glass border border-sky-900/30 mb-8 rounded-[2rem] p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4"><Filter className="w-4 h-4 text-sky-500" /><h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Explorar Categorias</h3></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                <button onClick={() => setActiveCategory('all')} className={`px-3 py-2.5 rounded-xl text-[10px] md:text-xs font-bold border flex items-center justify-between gap-2 ${activeCategory === 'all' ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-900/30 border-slate-800 text-slate-400'}`}><span>Todos</span><span className="opacity-60 bg-white/10 px-1.5 rounded">{tools.length}</span></button>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-2.5 rounded-xl text-[10px] md:text-xs font-bold border flex items-center justify-between gap-2 ${activeCategory === cat.id ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-900/30 border-slate-800 text-slate-400'}`}><span className="truncate">{cat.name}</span><span className="opacity-60 bg-white/10 px-1.5 rounded">{tools.filter(t => t.categoryId === cat.id).length}</span></button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map(tool => (
                <div key={tool.id} className="glass p-6 rounded-2xl flex flex-col group hover:border-sky-500/50 transition-all hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-sky-950/50 text-sky-400 rounded-lg border border-sky-500/20 uppercase truncate max-w-[150px]">{categories.find(c => c.id === tool.categoryId)?.name || 'Geral'}</span>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800/80 rounded-xl hover:bg-sky-500 transition-colors border border-slate-700"><ExternalLink className="w-4 h-4 text-slate-300" /></a>
                  </div>
                  <h4 className="text-lg font-bold mb-2 group-hover:text-sky-400 truncate">{tool.name}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-8 flex-1 line-clamp-3">{tool.description}</p>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="w-full text-center py-2.5 bg-slate-800/50 hover:bg-sky-500 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-700">Acessar</a>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'admin-login' && (
          <div className="max-w-md mx-auto py-20">
            <div className="glass p-10 rounded-[2.5rem] border border-sky-500/10">
              <div className="text-center mb-10"><Lock className="w-12 h-12 text-sky-500 mx-auto mb-4" /><h2 className="text-3xl font-bold">Acesso Administrativo</h2></div>
              <form onSubmit={(e) => { e.preventDefault(); const u = (e.currentTarget.elements.namedItem('user') as HTMLInputElement).value; const p = (e.currentTarget.elements.namedItem('pass') as HTMLInputElement).value; handleLogin(u,p); }}>
                <div className="space-y-5">
                  <input name="user" type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white" placeholder="Operador" required />
                  <input name="pass" type="password" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white" placeholder="Senha" required />
                  <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-2xl">Acessar Terminal</button>
                  <button type="button" onClick={() => setView('home')} className="w-full text-slate-500 text-xs font-bold uppercase py-2">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {view === 'admin-panel' && (
          <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
              <div><h2 className="text-4xl font-extrabold">Gestão de <span className="text-sky-500">Operações</span></h2><p className="text-slate-400">Sincronização Ativa v{APP_VERSION}</p></div>
              <div className="flex flex-wrap gap-3">
                <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv,.txt" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="bg-emerald-600 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"><Upload className="w-4 h-4" /> Importar</button>
                <button onClick={forceDataSync} className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border border-sky-500/20"><RefreshCw className="w-4 h-4" /> Forçar Sincronização</button>
              </div>
            </header>

            <section className="glass p-8 rounded-[2rem] border-emerald-500/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4"><Users className="w-6 h-6 text-emerald-500" /><div><h3 className="text-xl font-bold">Diretório de Membros</h3><p className="text-xs text-slate-500">Registros via login social</p></div></div>
                <div className="flex gap-2">
                  <button onClick={() => exportMembers('csv')} className="bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2">CSV</button>
                  <button onClick={() => exportMembers('txt')} className="bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2">TXT</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="text-slate-500 text-[10px] font-bold uppercase border-b border-slate-800"><th className="pb-4">Nome</th><th className="pb-4">E-mail</th><th className="pb-4">Data</th><th className="pb-4 text-right">Ação</th></tr></thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id} className="border-b border-slate-900 hover:bg-slate-900/30">
                        <td className="py-4 font-bold text-sm">{m.name}</td>
                        <td className="py-4 text-sm text-slate-400">{m.email}</td>
                        <td className="py-4 text-xs text-slate-500">{m.joinedAt}</td>
                        <td className="py-4 text-right"><button onClick={() => setMembers(members.filter(mem => mem.id !== m.id))} className="text-slate-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <section className="glass p-8 rounded-[2rem] xl:col-span-2">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Key className="w-5 h-5 text-sky-400" /> Operadores do Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {users.map(u => (
                    <div key={u.id} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex justify-between">
                      <span className="font-bold text-xs">{u.username}</span>
                      <button onClick={() => removeUser(u.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => { const u = prompt('User:'); const p = prompt('Pass:'); if(u&&p) addUser(u,p); }} className="border border-dashed border-slate-700 p-4 rounded-xl text-xs text-slate-500 hover:border-sky-500 transition-colors">Adicionar Operador</button>
                </div>
              </section>

              <section className="glass p-8 rounded-[2rem] xl:col-span-2">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-sky-400" /> Ativos do Sistema ({tools.length})</h3><button onClick={() => { const n = prompt('Nome:'); const d = prompt('Desc:'); const u = prompt('URL:'); const c = prompt('Cat ID:'); if(n&&d&&u&&c) addTool({name:n,description:d,url:u,categoryId:c}); }} className="bg-sky-500 px-4 py-2 rounded-xl text-xs font-bold uppercase">Novo Ativo</button></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="text-slate-500 text-[10px] font-bold border-b border-slate-800"><th className="pb-4">Ativo</th><th className="pb-4">Categoria</th><th className="pb-4 text-right">Ação</th></tr></thead>
                    <tbody>
                      {tools.slice().reverse().map(tool => (
                        <tr key={tool.id} className="border-b border-slate-900"><td className="py-4 text-sm font-bold">{tool.name}</td><td><span className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-800 rounded uppercase">{categories.find(c => c.id === tool.categoryId)?.name || 'Geral'}</span></td><td className="py-4 text-right"><button onClick={() => removeTool(tool.id)} className="text-slate-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Maintenance Section */}
              <section className="glass p-8 rounded-[2rem] xl:col-span-2 border-red-900/20">
                <div className="flex items-center gap-4 text-red-400 mb-6">
                  <AlertTriangle className="w-6 h-6" />
                  <div><h3 className="text-xl font-bold">Zona de Manutenção Crítica</h3><p className="text-xs text-slate-500">Utilize em caso de problemas persistentes com a visualização de dados</p></div>
                </div>
                <div className="flex gap-4">
                  <button onClick={forceDataSync} className="flex-1 bg-slate-900 hover:bg-slate-800 text-sky-400 py-4 rounded-2xl font-bold text-xs border border-sky-500/30 uppercase tracking-widest flex items-center justify-center gap-3"><RefreshCw className="w-5 h-5" /> Invalidação de Cache</button>
                  <button onClick={fullSystemReset} className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-500 py-4 rounded-2xl font-bold text-xs border border-red-500/30 uppercase tracking-widest flex items-center justify-center gap-3"><Trash2 className="w-5 h-5" /> Reset Total de Fábrica</button>
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
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-lg">Inteligência & Segurança. © 2024 v{APP_VERSION}</p>
          <div className="h-px w-20 bg-slate-900"></div>
          {!isLoggedIn ? (
            <button onClick={() => setView('admin-login')} className="group flex items-center gap-2 text-slate-600 hover:text-sky-500 transition-all text-[10px] font-black uppercase tracking-[0.3em] border border-slate-900 px-6 py-2.5 rounded-full"><Lock className="w-3.5 h-3.5" /> Terminal Admin</button>
          ) : (
            <button onClick={() => setView('admin-panel')} className="text-sky-500 text-[10px] font-black uppercase tracking-[0.3em]">Modo Operador Ativo</button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
