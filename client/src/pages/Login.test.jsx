import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Mock do useNavigate
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve fazer login com sucesso e redirecionar para admin', async () => {
    // ✅ Mock do fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            token: 'fake-token',
            user: { role: 'admin', name: 'João' },
          }),
      })
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Preenche os campos
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'admin@test.com' },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });

    // Clica no botão
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Aguarda execução assíncrona
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Verifica localStorage
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('userRole')).toBe('admin');

    // Verifica redirecionamento
    expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
  });

  it('deve exibir erro quando login falhar', async () => {
    // Mock do alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock do fetch com erro
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            message: 'Credenciais inválidas',
          }),
      })
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'user@test.com' },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
    });
  });

  it('deve tratar erro de conexão com o servidor', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Simula erro de rede
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'user@test.com' },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
    });
  });
});