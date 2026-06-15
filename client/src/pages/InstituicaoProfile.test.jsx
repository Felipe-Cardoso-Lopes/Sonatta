import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import InstituicaoProfile from './InstituicaoProfile';

vi.mock('axios');

describe('Componente InstituicaoProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Simula os dados que a página busca ao iniciar
    Storage.prototype.getItem = vi.fn((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'userName') return 'Admin Teste';
      if (key === 'userNickname') return 'Admin';
      return null;
    });
    
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.clear = vi.fn();

    // Mock dos alertas e confirmações nativas do navegador
    window.alert = vi.fn();
    window.confirm = vi.fn(() => true);
  });

  it('deve renderizar os formulários de perfil e segurança', () => {
    render(
      <MemoryRouter>
        <InstituicaoProfile />
      </MemoryRouter>
    );

    // Valida a presença dos blocos e labels
    expect(screen.getByText('Meu Perfil de Administrador')).toBeInTheDocument();
    expect(screen.getByText('Dados do Usuário')).toBeInTheDocument();
    expect(screen.getByText('Nome do Administrador')).toBeInTheDocument();
    expect(screen.getByText('Apelido / Nickname')).toBeInTheDocument();
    expect(screen.getByText('Segurança da Conta')).toBeInTheDocument();
  });

  it('deve chamar a API ao atualizar o perfil', async () => {
    axios.put.mockResolvedValueOnce({ data: { message: 'Success' } });

    render(
      <MemoryRouter>
        <InstituicaoProfile />
      </MemoryRouter>
    );

    const btnAtualizar = screen.getByText('Atualizar Perfil');
    fireEvent.click(btnAtualizar);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/profile'),
        { name: 'Admin Teste', nickname: 'Admin', email: '' },
        expect.any(Object)
      );
      expect(window.alert).toHaveBeenCalledWith('Informações atualizadas com sucesso!');
    });
  });

  it('deve chamar a API ao alterar a senha', async () => {
    axios.put.mockResolvedValueOnce({ data: { message: 'Success' } });

    render(
      <MemoryRouter>
        <InstituicaoProfile />
      </MemoryRouter>
    );

    // Localizamos os inputs de senha pelos placeholders
    const inputSenhaAtual = screen.getByPlaceholderText('********');
    const inputNovaSenha = screen.getByPlaceholderText('Mínimo 6 caracteres');

    fireEvent.change(inputSenhaAtual, { target: { value: 'senhaAntiga123' } });
    fireEvent.change(inputNovaSenha, { target: { value: 'senhaNova123' } });

    const btnAlterarSenha = screen.getByText('Alterar Senha de Acesso');
    fireEvent.click(btnAlterarSenha);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/change-password'),
        { currentPassword: 'senhaAntiga123', newPassword: 'senhaNova123' },
        expect.any(Object)
      );
      expect(window.alert).toHaveBeenCalledWith('Senha alterada com sucesso!');
    });
  });

  it('deve limpar o localStorage e fazer logout', () => {
    render(
      <MemoryRouter>
        <InstituicaoProfile />
      </MemoryRouter>
    );

    const btnLogout = screen.getByText('🚪 Sair da Conta Administrativa');
    fireEvent.click(btnLogout);

    // Verifica se o aviso de confirmação apareceu e se a sessão foi limpa
    expect(window.confirm).toHaveBeenCalled();
    expect(localStorage.clear).toHaveBeenCalled();
  });
});