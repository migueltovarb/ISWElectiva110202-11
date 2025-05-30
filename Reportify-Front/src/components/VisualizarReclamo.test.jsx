import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import VisualizarReclamo from "./VisualizarReclamo";

// Mock de axios
vi.mock("axios");

describe("VisualizarReclamo", () => {
  const mockClaim = {
    id: 1,
    empresa: "Empresa Test",
    asunto: "Asunto del reclamo",
    descripcion: "Descripción del reclamo",
    evidencia: "https://example.com/evidencia.pdf",
    comentarios: [
      { texto: "Comentario previo", fecha: "2024-01-01T10:00:00Z" },
    ],
  };

  const mockOnBack = vi.fn();
  const mockOnComentarioGuardado = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar el contenido del reclamo", () => {
    render(
      <VisualizarReclamo
        claim={mockClaim}
        onBack={mockOnBack}
        onComentarioGuardado={mockOnComentarioGuardado}
      />
    );

    expect(screen.getByText("Tu Reclamo")).toBeInTheDocument();
    expect(screen.getByText("Empresa:")).toBeInTheDocument();
    expect(screen.getByText("Empresa Test")).toBeInTheDocument();
    expect(screen.getByText("Asunto:")).toBeInTheDocument();
    expect(screen.getByText("Asunto del reclamo")).toBeInTheDocument();
    expect(screen.getByText("Descripción:")).toBeInTheDocument();
    expect(screen.getByText("Descripción del reclamo")).toBeInTheDocument();
    expect(screen.getByText("Comentario previo")).toBeInTheDocument();
  });

  it("debe agregar un comentario y llamar onComentarioGuardado", async () => {
    const nuevoComentario = "Este es un nuevo comentario";

    axios.post.mockResolvedValueOnce({
      data: {
        comentarios: [
          ...mockClaim.comentarios,
          { texto: nuevoComentario, fecha: "2025-01-01T12:00:00Z" },
        ],
      },
    });

    render(
      <VisualizarReclamo
        claim={mockClaim}
        onBack={mockOnBack}
        onComentarioGuardado={mockOnComentarioGuardado}
      />
    );

    const textarea = screen.getByPlaceholderText(
      "Agrega un comentario adicional..."
    );
    const agregarBtn = screen.getByText("Agregar");

    fireEvent.change(textarea, { target: { value: nuevoComentario } });
    fireEvent.click(agregarBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/Reclamo/comentar/${mockClaim.id}/`,
        expect.objectContaining({
          texto: nuevoComentario,
        })
      );
    });

    await waitFor(() => {
      expect(mockOnComentarioGuardado).toHaveBeenCalled();
      expect(screen.getByText(nuevoComentario)).toBeInTheDocument();
    });
  });

  it("debe manejar clic en Cancelar", () => {
    render(
      <VisualizarReclamo
        claim={mockClaim}
        onBack={mockOnBack}
        onComentarioGuardado={mockOnComentarioGuardado}
      />
    );

    const cancelarBtn = screen.getByText("Cancelar");
    fireEvent.click(cancelarBtn);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it("no debe permitir guardar comentarios vacíos", () => {
    render(
      <VisualizarReclamo
        claim={mockClaim}
        onBack={mockOnBack}
        onComentarioGuardado={mockOnComentarioGuardado}
      />
    );

    const agregarBtn = screen.getByText("Agregar");
    fireEvent.click(agregarBtn);

    expect(axios.post).not.toHaveBeenCalled();
  });
});
