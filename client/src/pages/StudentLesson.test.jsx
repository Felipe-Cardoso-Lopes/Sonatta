import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import StudentLessons from "./StudentLessons";

vi.mock("axios");

describe("Fluxo Principal - Aulas do Aluno (StudentLessons)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar a interface e exibir a lista de aulas configurada", async () => {
    // CORREÇÃO AQUI: Enviamos 'teacher_name' para bater com o que o map() do componente espera
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          title: "Piano Essencial: Do Zero às Suas Primeiras Melodias",
          teacher_name: "Prof. Carlos Silva", // <--- CHAVE CORRIGIDA AQUI
          instrument: "Piano",
          progress: 45,
          is_enrolled: true,
          description: "Curso completo de piano.",
        },
        {
          id: 2,
          title: "Guitarra Rock - Nível 1",
          teacher_name: "Profa. Ana Rita", // <--- CHAVE CORRIGIDA AQUI
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

    await waitFor(() => {
      // Verifica o título
      const pianoTitles = screen.getAllByText(/Piano Essencial/i);
      expect(pianoTitles.length).toBeGreaterThan(0);

      // Como o componente agora recebe o 'teacher_name' correto, ele vai renderizar o professor
      const professorNames = screen.getAllByText(/Prof. Carlos Silva/i);
      expect(professorNames.length).toBeGreaterThan(0);
    });
  });
});