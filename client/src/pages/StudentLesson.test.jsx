import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudentLessons from './StudentLessons';

describe('Fluxo Principal - Aulas do Aluno (StudentLessons)', () => {
  it('deve renderizar a interface e exibir a lista de aulas configurada', async () => {
    render(
      <BrowserRouter>
        <StudentLessons />
      </BrowserRouter>
    );

    // Aguarda o useEffect terminar e renderizar a lista de cursos
    await waitFor(() => {
      // Valida o primeiro curso mockado no seu componente
      expect(screen.getByText('Piano Básico')).toBeInTheDocument();
      expect(screen.getByText('Prof. X')).toBeInTheDocument();

      // Valida o segundo curso mockado
      expect(screen.getByText('Guitarra Rock')).toBeInTheDocument();
      expect(screen.getByText('Prof. Y')).toBeInTheDocument();
    });

    // Valida se o conteúdo estático da coluna da direita (detalhes da aula) está a ser renderizado
    expect(screen.getByText('Piano Essencial: Do Zero às Suas Primeiras Melodias')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tocar' })).toBeInTheDocument();
  });
});