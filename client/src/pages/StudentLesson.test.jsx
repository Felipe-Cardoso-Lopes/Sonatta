import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import StudentLessons from "./StudentLessons";

describe("Fluxo Principal - Aulas do Aluno (StudentLessons)", () => {
  it("deve renderizar a interface e exibir a lista de aulas configurada", async () => {
    render(
      <MemoryRouter>
        <StudentLessons />
      </MemoryRouter>,
    );

    // Aguarda o useEffect terminar de carregar os cursos mockados
    await waitFor(() => {
      // Usamos getAllByText porque o título do piano aparece na lista e nos detalhes (2 vezes)
      const pianoTitles = screen.getAllByText(
        /Piano Essencial: Do Zero às Suas Primeiras Melodias/i,
      );
      expect(pianoTitles.length).toBeGreaterThan(0);

      // O curso de guitarra aparece apenas na lista (1 vez)
      expect(screen.getByText(/Guitarra Rock - Nível 1/i)).toBeInTheDocument();

      // Verifica se o nome do professor também renderizou corretamente
      expect(screen.getByText(/Prof. Carlos Silva/i)).toBeInTheDocument();
    });
  });
});
