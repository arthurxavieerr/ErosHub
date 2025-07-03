interface User {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  register: (userData: User) => {
    try {
      // Verifica se já existe um usuário com este email
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((user: User) => user.email === userData.email)) {
        throw new Error('Este e-mail já está cadastrado');
      }

      // Adiciona o novo usuário
      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  },

  login: (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('E-mail ou senha inválidos');
      }

      // Guarda o usuário logado na sessão
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
};