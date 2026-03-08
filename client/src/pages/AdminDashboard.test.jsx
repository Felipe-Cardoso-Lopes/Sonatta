import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AdminDashboard from './AdminDashboard';

// Mock do react-router-dom para capturar os redirecionamentos de bloqueio
const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('Proteção e Isolamento - AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve expulsar um visitante sem token e mandar para o login', () => {
    // NENHUM token ou role é inserido no localStorage

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // O sistema deve detectar a ausência de token e redirecionar para '/' ou '/login'
    expect(mockedNavigate).toHaveBeenCalledWith('/login'); 
  });

  it('deve bloquear o acesso de um aluno logado e devolvê-lo ao seu dashboard', () => {
    // Simula um aluno mal-intencionado (ou curioso) tentando forçar a URL de admin
    localStorage.setItem('token', 'token-valido-do-aluno');
    localStorage.setItem('userRole', 'aluno');

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // O sistema deve ler a role 'aluno' e redirecioná-lo de volta à sua área
    expect(mockedNavigate).toHaveBeenCalledWith('/student-dashboard');
  });
});