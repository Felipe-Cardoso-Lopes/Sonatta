import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AdminDashboard from './AdminDashboard';

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

  it('deve expulsar um visitante sem token e mandar para o login', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('deve bloquear o acesso de um aluno logado e devolvê-lo ao seu dashboard', async () => {
    localStorage.setItem('token', 'token-valido-do-aluno');
    localStorage.setItem('userRole', 'aluno');

    render(
  <MemoryRouter>
    <AdminDashboard />
  </MemoryRouter>
);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/student-dashboard');
    });
  });
});