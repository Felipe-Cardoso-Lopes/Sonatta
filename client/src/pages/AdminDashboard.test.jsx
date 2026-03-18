import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// CORREÇÃO 1: Importar todas as palavras-chave de teste do vitest
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminDashboard from './AdminDashboard';

// CORREÇÃO 2: Usar vi.hoisted para garantir que a função mockada
// seja criada ANTES do vi.mock tentar utilizá-la.
const { mockedNavigate } = vi.hoisted(() => {
  return { mockedNavigate: vi.fn() };
});

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
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('deve bloquear o acesso de um aluno logado e devolvê-lo ao seu dashboard', async () => {
    // Simula um aluno "espertinho" tentando acessar a rota de admin
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