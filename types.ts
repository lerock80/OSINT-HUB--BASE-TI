
export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'user';
}

export interface Member {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  joinedAt: string;
}

export type View = 'home' | 'admin-login' | 'admin-panel' | 'member-auth';
