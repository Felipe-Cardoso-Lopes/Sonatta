import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import InstituicaoProfile from './InstituicaoProfile';

vi.mock('axios');

describe('Componente InstituicaoProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    Storage.prototype.getItem = vi.fn((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'userName') return 'Admin Teste';
      if (key === 'userNickname') return 'Admin';
      return null;
    });
    
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.clear = vi.fn();

    window.alert = vi.fn();
    window.confirm = vi.fn(() => true);
  });

  it('deve renderizar os formulários de perfil e segurança', async () => {
    render(
      <MemoryRouter>
        <InstituicaoProfile />
      </MemoryRouter>
    );

    // Click the admin tab to show admin content
    const adminTab = screen.getByText('Conta Administrativa');
    fireEvent.click(adminTab);

    // Wait for content to render
    await waitFor(() => {
      expect(screen.getByText('Dados Pessoais')).toBeInTheDocument();
      expect(screen.getByText('Nome do Administrador')).toBeInTheDocument();
      expect(screen.getByText('Apelido / Nickname')).toBeInTheDocument();
      expect(screen.getByText('Segurança de Acesso')).toBeInTheDocument();
    });
  });

  it('deve chamar a API ao atualizar o perfil', async () => {
    axios.put.mockResolvedValueOnce({ data: { message: 'Success' } });

    render(
      <MemoryRouter>
        <InstituicaoProfile />
      </MemoryRouter>
    );

    // Click the admin tab first
    const adminTab = screen.getByText('Conta Administrativa');
    fireEvent.click(adminTab);

    await waitFor(() => {
      const btnAtualizar = screen.getByText('Atualizar Administrador');
      fireEvent.click(btnAtualizar);
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/profile'),
        { name: 'Admin Teste', nickname: 'Admin', email: '' },
        expect.any(Object)
      );
    });
  });

  it('deve chamar a API ao alterar a senha', async () => {
    axios.put.mockResolvedValueOnce({ data: { message: 'Success' } });

    render(
      <MemoryRouter>
        <InstituicaoProfile />
      </MemoryRouter>
    );

    // Click the admin tab first
    const adminTab = screen.getByText('Conta Administrativa');
    fireEvent.click(adminTab);

    await waitFor(() => {
      const inputSenhaAtual = screen.getByPlaceholderText('********');
      const inputNovaSenha = screen.getByPlaceholderText('Mínimo 6 caracteres');

      fireEvent.change(inputSenhaAtual, { target: { value: 'senhaAntiga123' } });
      fireEvent.change(inputNovaSenha, { target: { value: 'senhaNova123' } });

      const btnAlterarSenha = screen.getByText('Alterar Senha');
      fireEvent.click(btnAlterarSenha);
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/change-password'),
        { currentPassword: 'senhaAntiga123', newPassword: 'senhaNova123' },
        expect.any(Object)
      );
    });
  });

  it('deve limpar o localStorage e fazer logout', async () => {
    render(
      <MemoryRouter>
        <InstituicaoProfile />
      </MemoryRouter>
    );

    // Click the admin tab first
    const adminTab = screen.getByText('Conta Administrativa');
    fireEvent.click(adminTab);

    await waitFor(() => {
      const btnLogout = screen.getByText('🚪 Sair da Conta Administrativa');
      fireEvent.click(btnLogout);
    });

    expect(window.confirm).toHaveBeenCalled();
    expect(localStorage.clear).toHaveBeenCalled();
  });
});