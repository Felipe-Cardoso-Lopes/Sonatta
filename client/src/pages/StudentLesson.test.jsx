import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import StudentLessons from "./StudentLessons";

// 1. Damos a instrução para o Vitest assumir o controle do Axios
vi.mock("axios");

describe("Fluxo Principal - Aulas do Aluno (StudentLessons)", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpa as chamadas antes de cada teste
  });

  it("deve renderizar a interface e exibir a lista de aulas configurada", async () => {
    // 2. Simulamos a resposta do servidor (API) devolvendo os dados que a tela precisa
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          title: "Piano Essencial: Do Zero às Suas Primeiras Melodias",
          professor: "Prof. Carlos Silva",
          instrument: "Piano",
          progress: 45,
          is_enrolled: true,
          description: "Curso completo de piano.",
        },
        {
          id: 2,
          title: "Guitarra Rock - Nível 1",
          professor: "Profa. Ana Rita",
          instrument: "Guitarra",
          progress: 0,
          is_enrolled: false,
          description: "Aprenda riffs clássicos.",
        },
      ],
    });

    render(
      <MemoryRouter>
        <StudentLessons />
      </MemoryRouter>
    );

    // Aguarda o axios ser chamado e a interface ser atualizada com os dados
    await waitFor(() => {
      // Usamos getAllByText porque o título do piano aparece na lista e nos detalhes (2 vezes)
      const pianoTitles = screen.getAllByText(
        /Piano Essencial: Do Zero às Suas Primeiras Melodias/i
      );
      expect(pianoTitles.length).toBeGreaterThan(0);

      // O curso de guitarra aparece apenas na lista (1 vez)
      expect(screen.getByText(/Guitarra Rock - Nível 1/i)).toBeInTheDocument();

      // Verifica se o nome do professor também renderizou corretamente
const professorNames = screen.getAllByText(/Prof. Carlos Silva/i);
expect(professorNames.length).toBeGreaterThan(0);
    });
  });
});