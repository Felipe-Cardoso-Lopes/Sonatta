import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import InstituicaoProfile from './InstituicaoProfile';
import { BrowserRouter } from 'react-router-dom';
import toast from 'react-hot-toast';

// Mocks
vi.mock('axios');
vi.mock('react-hot-toast', () => ({
  default: {
    loading: vi.fn(() => 'toast-id'),
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => <div data-testid="toaster" />
}));

describe('Componente InstituicaoProfile - Perfil Público', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'fake-token');
  });

  it('Deve renderizar os campos do formulário de perfil público', () => {
    render(
      <BrowserRouter>
        <InstituicaoProfile />
      </BrowserRouter>
    );

    expect(screen.getByText('Perfil Público da Escola')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Conte um pouco sobre a metodologia e história da instituição...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://suaescola.com.br')).toBeInTheDocument();
  });

  it('Deve chamar a API e exibir toast de sucesso ao submeter o formulário', async () => {
    axios.put.mockResolvedValueOnce({ data: { message: 'Sucesso' } });

    render(
      <BrowserRouter>
        <InstituicaoProfile />
      </BrowserRouter>
    );

    const descricaoInput = screen.getByPlaceholderText('Conte um pouco sobre a metodologia e história da instituição...');
    const btnSalvar = screen.getByText('Salvar Perfil Público');

    // Simula a digitação e submissão
    fireEvent.change(descricaoInput, { target: { value: 'Nossa escola é excelente.' } });
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/instituicoes/profile'),
        expect.objectContaining({ descricao_longa: 'Nossa escola é excelente.' }),
        { headers: { Authorization: 'Bearer fake-token' } }
      );
      expect(toast.success).toHaveBeenCalledWith('Perfil público atualizado com sucesso!', { id: 'toast-id' });
    });
  });
});