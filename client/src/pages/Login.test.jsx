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
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'fake-token',
        user: { role: 'admin', name: 'João' },
      }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'admin@test.com' },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('userRole')).toBe('admin');
    expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
  });

  it('deve exibir erro quando login falhar', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'Credenciais inválidas',
      }),
    });

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

    fetch.mockRejectedValue(new Error('Network error'));

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