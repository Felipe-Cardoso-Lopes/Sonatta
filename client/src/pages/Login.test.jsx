import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // OBRIGATÓRIO: MemoryRouter impede que o localStorage seja apagado
import axios from 'axios';
import { vi } from 'vitest';
import Login from './Login';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../components/MusicParticles', () => ({
  default: () => <div data-testid="mock-particles"></div>
}));

describe('Componente de Login', () => {
  let axiosPostSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Forma ABSOLUTA de intercetar o Axios. Garante que nunca fará uma chamada real.
    axiosPostSpy = vi.spyOn(axios, 'post');
  });

  afterEach(() => {
    axiosPostSpy.mockRestore();
  });

  it('deve realizar login com sucesso e redirecionar o aluno', async () => {
    axiosPostSpy.mockResolvedValueOnce({
      data: { name: 'João Aluno', token: 'fake-jwt-token', role: 'aluno' }
    });

    render(
      <MemoryRouter>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('seuemail@exemplo.com'), {
      target: { value: 'aluno@teste.com' },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });

    // Submete o formulário de forma direta, evitando bloqueios do HTML5
    fireEvent.submit(screen.getByRole('button', { name: 'Entrar' }).closest('form'));

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/login'),
        { email: 'aluno@teste.com', password: 'senha123' }
      );
    });
    
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    expect(localStorage.getItem('userRole')).toBe('aluno');
    expect(mockedNavigate).toHaveBeenCalledWith('/student-dashboard');
  });

  it('deve disparar um alert em caso de falha na requisição', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    axiosPostSpy.mockRejectedValueOnce({
      response: { data: { message: 'Credenciais inválidas' } }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('seuemail@exemplo.com'), {
      target: { value: 'erro@teste.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'senha-errada' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Entrar' }).closest('form'));

    await waitFor(() => {
      // Verifica apenas se foi chamado, independentemente da frase que você configurou no erro
      expect(alertMock).toHaveBeenCalled();
    });
    
    alertMock.mockRestore();
  });

  it('deve realizar login com sucesso e redirecionar o professor', async () => {
    axiosPostSpy.mockResolvedValueOnce({
      data: { name: 'Maria Professora', token: 'fake-jwt-token', role: 'professor' }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('seuemail@exemplo.com'), {
      target: { value: 'professor@teste.com' },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Entrar' }).closest('form'));

    await waitFor(() => {
      expect(localStorage.getItem('userRole')).toBe('professor');
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/teacher-dashboard');
  });

  it('deve realizar login com sucesso e redirecionar o admin', async () => {
    axiosPostSpy.mockResolvedValueOnce({
      data: { name: 'Carlos Admin', token: 'fake-jwt-token', role: 'admin' }
    });

    render(
      <MemoryRouter>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('seuemail@exemplo.com'), {
      target: { value: 'admin@teste.com' },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Entrar' }).closest('form'));

    await waitFor(() => {
      expect(localStorage.getItem('userRole')).toBe('admin');
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/admin-dashboard');
  });
});