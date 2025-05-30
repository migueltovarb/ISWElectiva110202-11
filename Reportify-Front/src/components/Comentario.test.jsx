import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Comentario from "./Comentario";
import axios from "axios";

vi.mock("axios");

describe("Comentario Component", () => {
  const mockClaim = {
    id: 1,
    titulo: "Problema con entrega",
    descripcion: "El paquete no llegó en la fecha estimada",
    fecha_creacion: "2023-05-15",
    empresa: "Servientrega",
    comentario: "Comentario inicial"
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it("renders claim information correctly", () => {
    render(<Comentario claim={mockClaim} />);
    
    expect(screen.getByText(mockClaim.titulo)).toBeInTheDocument();
    
    // Check description - now properly handling the <strong> element
    expect(screen.getByText(/Descripción:/)).toBeInTheDocument();
    expect(screen.getByText(mockClaim.descripcion)).toBeInTheDocument();
    
    // Check creation date
    expect(screen.getByText(/Fecha de creación:/)).toBeInTheDocument();
    expect(screen.getByText(mockClaim.fecha_creacion)).toBeInTheDocument();
    
    // Check company
    expect(screen.getByText(/Empresa:/)).toBeInTheDocument();
    expect(screen.getByText(mockClaim.empresa)).toBeInTheDocument();
    
    // Check form elements
    expect(screen.getByLabelText(/Comentario Adicional/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Actualizar Comentario/i })).toBeInTheDocument();
  });

  it("displays existing comment in textarea", () => {
    render(<Comentario claim={mockClaim} />);
    const textarea = screen.getByLabelText(/Comentario Adicional/i);
    expect(textarea).toHaveValue(mockClaim.comentario);
  });

  it("updates comment text when typing", () => {
    render(<Comentario claim={mockClaim} />);
    const textarea = screen.getByLabelText(/Comentario Adicional/i);
    fireEvent.change(textarea, { target: { value: "Nuevo comentario" } });
    expect(textarea).toHaveValue("Nuevo comentario");
  });

  it("calls API and shows success when updating comment", async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    render(<Comentario claim={mockClaim} />);

    const textarea = screen.getByLabelText(/Comentario Adicional/i);
    const button = screen.getByRole('button', { name: /Actualizar Comentario/i });

    fireEvent.change(textarea, { target: { value: "Comentario actualizado" } });
    fireEvent.click(button);

    expect(button).toHaveTextContent("Actualizando...");
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/comentar/${mockClaim.id}/`,
        { comentario: "Comentario actualizado" }
      );
    });

    expect(window.alert).toHaveBeenCalledWith("Comentario actualizado correctamente");
    expect(button).not.toBeDisabled();
  });

  it("shows error when API call fails", async () => {
    axios.put.mockRejectedValueOnce(new Error("API Error"));
    render(<Comentario claim={mockClaim} />);

    const button = screen.getByRole('button', { name: /Actualizar Comentario/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });

    expect(window.alert).toHaveBeenCalledWith("Error al actualizar el comentario.");
    expect(button).not.toBeDisabled();
  });

  it("handles empty comment update", async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    render(<Comentario claim={mockClaim} />);

    const textarea = screen.getByLabelText(/Comentario Adicional/i);
    const button = screen.getByRole('button', { name: /Actualizar Comentario/i });

    fireEvent.change(textarea, { target: { value: "" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/comentar/${mockClaim.id}/`,
        { comentario: "" }
      );
    });
  });
});