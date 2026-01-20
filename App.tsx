
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Shield, Settings, LogOut, Plus, Trash2, Edit3, 
  ExternalLink, Menu, X, Globe, User, Upload, FileText, 
  LayoutGrid, RotateCcw, Filter, Key, Users, UserPlus, 
  Lock, Download, Mail, UserCheck, LogIn, ChevronDown, ChevronUp, AlertTriangle
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
  const [memberAuthMode, setMemberAuthMode] = useState<'login' | 'signup'>('login');

  // Collapsible Sections State
  const [adminSections, setAdminSections] = useState({
    members: true,
    operators: false,
    categories: false,
    tools: true,
    maintenance: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence & Versioning
  useEffect(() => {
    const savedToolsRaw = localStorage.getItem('osint_tools');
    const savedCategoriesRaw = localStorage.getItem('osint_categories');
    const savedUsersRaw = localStorage.getItem('osint_users');
    const savedMembersRaw = localStorage.getItem('osint_members');
    const savedVersion = localStorage.getItem('osint_version');

    let finalTools: Tool[] = savedToolsRaw ? JSON.parse(savedToolsRaw) : INITIAL_TOOLS;
    let finalCategories: Category[] = savedCategoriesRaw ? JSON.parse(savedCategoriesRaw) : INITIAL_CATEGORIES;

    if (savedVersion !== APP_VERSION) {
      INITIAL_CATEGORIES.forEach(defaultCat => {
        if (!finalCategories.find(c => c.id === defaultCat.id)) finalCategories.push(defaultCat);
      });
      INITIAL_TOOLS.forEach(defaultTool => {
        if (!finalTools.find(t => t.id === defaultTool.id)) finalTools.push(defaultTool);
      });
      localStorage.setItem('osint_version', APP_VERSION);
    }

    setTools(finalTools);
    setCategories(finalCategories);
    if (savedUsersRaw) setUsers(JSON.parse(savedUsersRaw));
    else setUsers([{ id: '1', username: 'Admin', password: 'baseti123456', role: 'admin' }]);
    if (savedMembersRaw) setMembers(JSON.parse(savedMembersRaw));
    
    setIsInitialized(true);
  }, []);

  useEffect(() => { if (isInitialized) localStorage.setItem('osint_tools', JSON.stringify(tools)); }, [tools, isInitialized]);
  useEffect(() => { if (isInitialized) localStorage.setItem('osint_categories', JSON.stringify(categories)); }, [categories, isInitialized]);
  useEffect(() => { if (isInitialized) localStorage.setItem('osint_users', JSON.stringify(users)); }, [users, isInitialized]);
  useEffect(() => { if (isInitialized) localStorage.setItem('osint_members', JSON.stringify(members)); }, [members, isInitialized]);

  // Auth Handlers - Admin
  const handleAdminLogin = (u: string, p: string) => {
    const foundUser = users.find(usr => usr.username === u && usr.password === p);
    if (foundUser) {
      setIsLoggedIn(true);
      setCurrentUser(foundUser);
      setView('admin-panel');
    } else { alert('Credenciais Administrativas Inválidas!'); }
  };

  // Auth Handlers - Member
  const handleMemberLogin = (u: string, p: string) => {
    const foundMember = members.find(m => (m.username === u || m.email === u) && m.password === p);
    if (foundMember) {
      setIsMemberLoggedIn(true);
      setCurrentMember(foundMember);
      setView('home');
    } else { alert('Usuário ou Senha incorretos.'); }
  };

  const handleMemberSignup = (data: Omit<Member, 'id' | 'joinedAt'> & { confirmPass: string }) => {
    if (data.password !== data.confirmPass) return alert('As senhas não conferem.');
    if (members.find(m => m.email === data.email || m.username === data.username)) return alert('Usuário ou e-mail já cadastrado.');

    const newMember: Member = {
      id: 'mem-' + Date.now(),
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      joinedAt: new Date().toLocaleDateString('pt-BR')
    };

    setMembers(prev => [...prev, newMember]);
    alert('Cadastro realizado com sucesso! Agora você pode entrar.');
    setMemberAuthMode('login');
  };

  const handleMemberLogout = () => {
    setIsMemberLoggedIn(false);
    setCurrentMember(null);
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

  const toggleSection = (section: keyof typeof adminSections) => {
    setAdminSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-sky-900/50">
        <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer group">
          <div className="p-2 bg-sky-500 rounded-lg group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">OSINT <span className="text-sky-400">Terminal</span></h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block -mt-1">Terminal Operacional de Inteligência</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {!isMemberLoggedIn ? (
            <button 
              onClick={() => { setView('member-auth'); setMemberAuthMode('login'); }}
              className="px-5 py-2 bg-sky-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-sky-600 transition shadow-lg shadow-sky-500/20"
            >
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
          
          <button onClick={() => setView('home')} className={`text-sm font-semibold hover:text-sky-400 transition ${view === 'home' ? 'text-sky-400' : 'text-slate-400'}`}>Início</button>
          
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <button onClick={() => setView('admin-panel')} className={`text-sm font-semibold hover:text-sky-400 transition ${view === 'admin-panel' ? 'text-sky-400' : 'text-slate-400'}`}>Painel</button>
              <button onClick={() => {setIsLoggedIn(false); setView('home');}} className="text-red-400 hover:text-red-300 transition"><LogOut className="w-5 h-5" /></button>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-12">
        {view === 'home' && (
          <>
            <section className="text-center mb-10">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-4 neon-text tracking-tighter">OSINT <span className="text-sky-500">Terminal</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">Terminal Operacional de Inteligência</p>
              <div className="max-w-2xl mx-auto relative group mt-8">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Pesquisar ferramentas estratégicas..."
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-sky-500/30 transition text-lg outline-none backdrop-blur-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </section>

            <div className="glass border border-sky-900/30 mb-12 rounded-[2rem] p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4"><Filter className="w-4 h-4 text-sky-500" /><h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Filtrar por Categoria</h3></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                <button onClick={() => setActiveCategory('all')} className={`px-3 py-2.5 rounded-xl text-[10px] md:text-xs font-bold border flex items-center justify-between gap-2 transition ${activeCategory === 'all' ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200'}`}><span>Todos</span><span className="opacity-60 bg-white/10 px-1.5 rounded">{tools.length}</span></button>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-2.5 rounded-xl text-[10px] md:text-xs font-bold border flex items-center justify-between gap-2 transition ${activeCategory === cat.id ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200'}`}><span className="truncate">{cat.name}</span><span className="opacity-60 bg-white/10 px-1.5 rounded">{tools.filter(t => t.categoryId === cat.id).length}</span></button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map(tool => (
                <div key={tool.id} className="glass p-6 rounded-2xl flex flex-col group hover:border-sky-500/50 transition-all hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-sky-950/50 text-sky-400 rounded-lg border border-sky-500/20 uppercase truncate max-w-[150px]">{categories.find(c => c.id === tool.categoryId)?.name || 'Geral'}</span>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-sky-400" />
                  </div>
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-bold mb-2 text-white hover:text-sky-400 transition-colors inline-block"
                  >
                    {tool.name}
                  </a>
                  <p className="text-slate-400 text-xs leading-relaxed flex-1 line-clamp-3">{tool.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'member-auth' && (
          <div className="max-w-md mx-auto py-10">
            <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-sky-500/20 shadow-2xl">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">{memberAuthMode === 'login' ? 'Área de Membros' : 'Novo Cadastro'}</h2>
                <p className="text-slate-500 text-sm">Acesse o ecossistema OSINT Terminal</p>
              </div>

              {memberAuthMode === 'login' ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const u = (e.currentTarget.elements.namedItem('user') as HTMLInputElement).value;
                  const p = (e.currentTarget.elements.namedItem('pass') as HTMLInputElement).value;
                  handleMemberLogin(u, p);
                }} className="space-y-4">
                  <input name="user" type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-sky-500 outline-none transition" placeholder="Usuário ou E-mail" required />
                  <input name="pass" type="password" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-sky-500 outline-none transition" placeholder="Senha" required />
                  <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl transition-all">Acessar Terminal</button>
                  <button type="button" onClick={() => setMemberAuthMode('signup')} className="w-full text-sky-400 font-bold text-sm mt-4 hover:underline">Ainda não sou membro</button>
                </form>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  handleMemberSignup({
                    name: (target.elements.namedItem('name') as HTMLInputElement).value,
                    username: (target.elements.namedItem('username') as HTMLInputElement).value,
                    email: (target.elements.namedItem('email') as HTMLInputElement).value,
                    password: (target.elements.namedItem('pass') as HTMLInputElement).value,
                    confirmPass: (target.elements.namedItem('confirm') as HTMLInputElement).value,
                  });
                }} className="space-y-4">
                  <input name="name" type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500 outline-none" placeholder="Nome Completo" required />
                  <input name="username" type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500 outline-none" placeholder="Username" required />
                  <input name="email" type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500 outline-none" placeholder="E-mail" required />
                  <input name="pass" type="password" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500 outline-none" placeholder="Senha" required />
                  <input name="confirm" type="password" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500 outline-none" placeholder="Repetir Senha" required />
                  <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all">Confirmar Cadastro</button>
                  <button type="button" onClick={() => setMemberAuthMode('login')} className="w-full text-sky-400 font-bold text-sm mt-4 hover:underline">Já possuo cadastro</button>
                </form>
              )}
            </div>
          </div>
        )}

        {view === 'admin-login' && (
          <div className="max-w-md mx-auto py-20">
            <div className="glass p-10 rounded-[2.5rem] border border-red-500/20 shadow-2xl">
              <div className="text-center mb-10"><Lock className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-3xl font-bold">Administrador</h2></div>
              <form onSubmit={(e) => { e.preventDefault(); handleAdminLogin((e.currentTarget.elements.namedItem('user') as HTMLInputElement).value, (e.currentTarget.elements.namedItem('pass') as HTMLInputElement).value); }}>
                <div className="space-y-5">
                  <input name="user" type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white" placeholder="ID de Acesso" required />
                  <input name="pass" type="password" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white" placeholder="Token" required />
                  <button type="submit" className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl transition-all">Validar Acesso</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {view === 'admin-panel' && (
          <div className="space-y-6">
            <header className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-extrabold">Painel <span className="text-sky-500">Gestor</span></h2>
              <div className="flex gap-3">
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-xs font-bold border border-red-500/20 uppercase tracking-widest">Reset Total</button>
              </div>
            </header>

            {/* Members Section - Collapsible */}
            <section className="glass rounded-[2rem] overflow-hidden border-emerald-500/10">
              <button 
                onClick={() => toggleSection('members')}
                className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl"><Users className="w-6 h-6 text-emerald-500" /></div>
                  <div className="text-left"><h3 className="text-xl font-bold">Base de Membros ({members.length})</h3><p className="text-xs text-slate-500">Dados coletados via formulário</p></div>
                </div>
                {adminSections.members ? <ChevronUp /> : <ChevronDown />}
              </button>
              {adminSections.members && (
                <div className="px-8 pb-8 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="text-slate-500 text-[10px] font-bold uppercase border-b border-slate-800"><th className="pb-4">Membro</th><th className="pb-4">Login/Email</th><th className="pb-4">Adesão</th><th className="pb-4 text-right">Ação</th></tr></thead>
                    <tbody>
                      {members.map(m => (
                        <tr key={m.id} className="border-b border-slate-900"><td className="py-4 font-bold text-sm">{m.name}</td><td className="py-4 text-sm text-slate-400">@{m.username} / {m.email}</td><td className="py-4 text-xs text-slate-500">{m.joinedAt}</td><td className="py-4 text-right"><button onClick={() => setMembers(members.filter(mem => mem.id !== m.id))} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Operators Section - Collapsible */}
            <section className="glass rounded-[2rem] overflow-hidden">
              <button 
                onClick={() => toggleSection('operators')}
                className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sky-500/10 rounded-xl"><Key className="w-6 h-6 text-sky-500" /></div>
                  <div className="text-left"><h3 className="text-xl font-bold">Operadores Administrativos</h3><p className="text-xs text-slate-500">Gestão de acessos restritos</p></div>
                </div>
                {adminSections.operators ? <ChevronUp /> : <ChevronDown />}
              </button>
              {adminSections.operators && (
                <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {users.map(u => (
                    <div key={u.id} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex justify-between">
                      <span className="font-bold text-xs">{u.username}</span>
                      <button onClick={() => {if(users.length > 1) setUsers(users.filter(usr => usr.id !== u.id))}} className="text-slate-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => { const u = prompt('User:'); const p = prompt('Pass:'); if(u&&p) setUsers([...users, {id: Date.now().toString(), username: u, password: p, role: 'admin'}]) }} className="border border-dashed border-slate-700 p-4 rounded-xl text-xs text-slate-500 hover:border-sky-500 transition-colors">Novo Operador</button>
                </div>
              )}
            </section>

            {/* Tools Section - Collapsible */}
            <section className="glass rounded-[2rem] overflow-hidden border-sky-500/10">
              <button 
                onClick={() => toggleSection('tools')}
                className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sky-500/10 rounded-xl"><Settings className="w-6 h-6 text-sky-500" /></div>
                  <div className="text-left"><h3 className="text-xl font-bold">Gestão de Ativos ({tools.length})</h3><p className="text-xs text-slate-500">Inventário total de ferramentas</p></div>
                </div>
                {adminSections.tools ? <ChevronUp /> : <ChevronDown />}
              </button>
              {adminSections.tools && (
                <div className="px-8 pb-8">
                  <div className="flex justify-end mb-6">
                    <button onClick={() => { const n = prompt('Nome:'); const u = prompt('URL:'); if(n&&u) setTools([{id: Date.now().toString(), name: n, url: u, description: '', categoryId: 'cat-tel'}, ...tools]) }} className="bg-sky-500 px-4 py-2 rounded-xl text-xs font-bold uppercase">Novo Ativo</button>
                  </div>
                  <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left">
                      <thead><tr className="text-slate-500 text-[10px] font-bold border-b border-slate-800"><th className="pb-4">Ativo</th><th className="pb-4">Categoria</th><th className="pb-4 text-right">Ação</th></tr></thead>
                      <tbody>
                        {tools.map(tool => (
                          <tr key={tool.id} className="border-b border-slate-900"><td className="py-4 text-sm font-bold">{tool.name}</td><td><span className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-800 rounded uppercase">{categories.find(c => c.id === tool.categoryId)?.name || 'Outros'}</span></td><td className="py-4 text-right"><button onClick={() => setTools(tools.filter(t => t.id !== tool.id))} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button></td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900/50 text-center bg-slate-950/50">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">OSINT Terminal Platform</p>
        {!isLoggedIn ? (
          <button onClick={() => setView('admin-login')} className="text-slate-700 hover:text-sky-500 transition-colors text-[10px] font-bold uppercase tracking-widest"><Lock className="w-3 h-3 inline mr-2" /> Acesso Restrito</button>
        ) : (
          <span className="text-sky-500 text-[10px] font-bold uppercase tracking-widest">Painel Administrativo Ativo</span>
        )}
      </footer>
    </div>
  );
};

export default App;
