import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from './Login';

// Mock do navigate
const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock visual
vi.mock('../components/MusicParticles', () => ({
  default: () => <div data-testid="mock-particles"></div>,
}));

// Substitui a API fetch global pelo espião do Vitest
global.fetch = vi.fn();

describe('Componente de Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch.mockClear(); // Limpa o histórico de chamadas do fetch
  });

  it('deve realizar login com sucesso e redirecionar o aluno', async () => {
    // Simula a estrutura exata que o fetch e o seu Login.jsx esperam
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-jwt-token',
        name: 'João Aluno', 
        role: 'aluno' // Formato atual, direto na raiz
      }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText('seuemail@exemplo.com'), 'aluno@teste.com');
    await userEvent.type(screen.getByPlaceholderText('********'), 'senha123');

    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      expect(localStorage.getItem('userRole')).toBe('aluno');
      expect(mockNavigate).toHaveBeenCalledWith('/student-dashboard');
    });
  });

  it('deve disparar um alert em caso de falha na requisição', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Simula uma resposta ok: false vinda do backend
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Credenciais inválidas' }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText('seuemail@exemplo.com'), 'erro@teste.com');
    await userEvent.type(screen.getByPlaceholderText('********'), 'senha-errada');

    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Credenciais inválidas');
    });

    alertMock.mockRestore();
  });

  it('deve realizar login com sucesso e redirecionar o professor', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-jwt-token',
        name: 'Maria Professora', 
        role: 'professor'
      }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText('seuemail@exemplo.com'), 'professor@teste.com');
    await userEvent.type(screen.getByPlaceholderText('********'), 'senha123');

    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('userRole')).toBe('professor');
      expect(mockNavigate).toHaveBeenCalledWith('/teacher-dashboard');
    });
  });

  it('deve realizar login com sucesso e redirecionar o admin', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-jwt-token',
        name: 'Carlos Admin', 
        role: 'admin'
      }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText('seuemail@exemplo.com'), 'admin@teste.com');
    await userEvent.type(screen.getByPlaceholderText('********'), 'senha-segura-admin');

    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('userRole')).toBe('admin');
      expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
    });
  });
});