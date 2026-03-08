import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { vi } from 'vitest';
import Login from './Login';

// Mock do axios e do react-router-dom
vi.mock('axios');
const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('../components/MusicParticles', () => {
  return {
    default: () => <div data-testid="mock-particles"></div>
  };
});

describe('Componente de Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve realizar login com sucesso e redirecionar o aluno', async () => {
    // Configura o mock do axios para simular o retorno da API
    axios.post.mockResolvedValueOnce({
      data: { name: 'João Aluno', token: 'fake-jwt-token', role: 'aluno' }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Preenche os campos
    fireEvent.change(screen.getByPlaceholderText('seuemail@exemplo.com'), {
      target: { value: 'aluno@teste.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'senha123' },
    });

    // Submete o formulário
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      // Verifica se a API foi chamada com os dados corretos
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/login'),
        { email: 'aluno@teste.com', password: 'senha123' }
      );
      
      // Verifica o localStorage
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      expect(localStorage.getItem('userRole')).toBe('aluno');
      
      // Verifica o redirecionamento específico do aluno
      expect(mockedNavigate).toHaveBeenCalledWith('/student-dashboard');
    });
  });

  it('deve disparar um alert em caso de falha na requisição', async () => {
    // Mock do alert do window
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Simula erro 401
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Credenciais inválidas' } }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Erro no login: Credenciais inválidas');
    });
    
    alertMock.mockRestore();
  });

  it('deve realizar login com sucesso e redirecionar o professor', async () => {
    // Configura o mock simulando o retorno da API para um professor
    axios.post.mockResolvedValueOnce({
      data: { name: 'Maria Professora', token: 'fake-jwt-token', role: 'professor' }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Preenche os campos
    fireEvent.change(screen.getByPlaceholderText('seuemail@exemplo.com'), {
      target: { value: 'professor@teste.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'senha123' },
    });

    // Submete o formulário
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      // Verifica se a role salva é a correta
      expect(localStorage.getItem('userRole')).toBe('professor');
      
      // Verifica o redirecionamento específico do professor
      expect(mockedNavigate).toHaveBeenCalledWith('/teacher-dashboard');
    });
  });

  it('deve realizar login com sucesso e redirecionar o admin', async () => {
    // Configura o mock simulando o retorno da API para um administrador
    axios.post.mockResolvedValueOnce({
      data: { name: 'Carlos Admin', token: 'fake-jwt-token', role: 'admin' }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Preenche os campos
    fireEvent.change(screen.getByPlaceholderText('seuemail@exemplo.com'), {
      target: { value: 'admin@teste.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'senha-segura-admin' },
    });

    // Submete o formulário
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      // Verifica se a role salva é a correta
      expect(localStorage.getItem('userRole')).toBe('admin');
      
      // Verifica o redirecionamento específico do admin
      expect(mockedNavigate).toHaveBeenCalledWith('/admin-dashboard');
    });
  });
});