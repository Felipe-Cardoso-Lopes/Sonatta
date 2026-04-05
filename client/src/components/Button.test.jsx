import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Button from './Button';

describe('Componente Button', () => {
  it('deve renderizar o botão com o texto correto', () => {
    render(<Button>Clique Aqui</Button>);
    expect(screen.getByRole('button', { name: 'Clique Aqui' })).toBeInTheDocument();
  });

  it('deve disparar a função onClick ao ser clicado', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Ação</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: 'Ação' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve aplicar as classes da variante primary por padrão', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button', { name: 'Primary' });
    
    // Verifica a classe específica da variante primária
    expect(button).toHaveClass('bg-dark-bg');
    expect(button).toHaveClass('text-pure-white');
  });

  it('deve aplicar as classes da variante secondary quando especificado', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: 'Secondary' });
    
    // A variante secundária não deve ter fundo preto por padrão
    expect(button).not.toHaveClass('bg-dark-bg');
    expect(button).toHaveClass('border-white-text');
  });
});