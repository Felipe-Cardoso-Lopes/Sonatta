import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Input from './Input';

describe('Componente Input', () => {
  it('deve renderizar a label e o input corretamente', () => {
    render(<Input label="E-mail" id="email" placeholder="Digite seu e-mail" />);
    
    expect(screen.getByText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu e-mail')).toBeInTheDocument();
  });

  it('não deve renderizar a label se ela não for passada como prop', () => {
    // Renderiza sem a prop 'label'
    render(<Input placeholder="Sem label" id="nolabel" />);
    
    const labelElements = screen.queryAllByRole('label');
    expect(labelElements.length).toBe(0);
  });

  it('deve repassar as digitações acionando a função onChange', () => {
    const handleChange = vi.fn();
    render(<Input id="nome" value="" onChange={handleChange} placeholder="Seu nome" />);
    
    const input = screen.getByPlaceholderText('Seu nome');
    // Simula o usuário digitando a letra 'A'
    fireEvent.change(input, { target: { value: 'A' } });
    
    // A função passada no onChange deve ter sido acionada
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});