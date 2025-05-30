import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddReclamo from "./AddReclamo";
import axios from "axios";

vi.mock("axios");

describe("AddReclamo Component", () => {
  const mockOnReclamoCreado = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el formulario con campos y botón", () => {
    render(<AddReclamo onReclamoCreado={mockOnReclamoCreado} />);
    expect(screen.getByText(/Crear Reclamo/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Asunto/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Empresa/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Descripción/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Evidencia/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enviar Reclamo/i })).toBeInTheDocument();
  });

  it("permite ingresar datos y enviar el formulario exitosamente", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<AddReclamo onReclamoCreado={mockOnReclamoCreado} />);

    const asuntoInput = screen.getByRole('textbox', { name: /Asunto/i });
    const empresaSelect = screen.getByRole('combobox', { name: /Empresa/i });
    const descripcionTextarea = screen.getByRole('textbox', { name: /Descripción/i });
    const evidenciaInput = screen.getByLabelText(/Evidencia/i);
    const submitButton = screen.getByRole("button", { name: /Enviar Reclamo/i });

    fireEvent.change(asuntoInput, { target: { value: "Problema con entrega" } });
    fireEvent.change(empresaSelect, { target: { value: "InterRapidisimo" } });
    fireEvent.change(descripcionTextarea, { target: { value: "No llegó el paquete" } });

    const file = new File(["dummy content"], "evidencia.png", { type: "image/png" });
    fireEvent.change(evidenciaInput, { target: { files: [file] } });

    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent(/Enviando.../i);
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/Reclamo/crear`,
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      );
    });

    expect(await screen.findByText(/Reclamo creado exitosamente./i)).toBeInTheDocument();
    expect(mockOnReclamoCreado).toHaveBeenCalled();
    expect(asuntoInput).toHaveValue("");
    expect(descripcionTextarea).toHaveValue("");
  });

  it("muestra mensaje de error si falla la creación", async () => {
    axios.post.mockRejectedValueOnce(new Error("Error en servidor"));

    render(<AddReclamo />);

    const asuntoInput = screen.getByRole('textbox', { name: /Asunto/i });
    const descripcionTextarea = screen.getByRole('textbox', { name: /Descripción/i });
    const submitButton = screen.getByRole("button", { name: /Enviar Reclamo/i });

    fireEvent.change(asuntoInput, { target: { value: "Error test" } });
    fireEvent.change(descripcionTextarea, { target: { value: "Descripción test" } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(await screen.findByText(/Hubo un error al crear el reclamo/i)).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it("deshabilita campos y botón mientras se envía", async () => {
    let resolver;
    axios.post.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolver = resolve;
        })
    );

    render(<AddReclamo />);

    const asuntoInput = screen.getByRole('textbox', { name: /Asunto/i });
    const empresaSelect = screen.getByRole('combobox', { name: /Empresa/i });
    const descripcionTextarea = screen.getByRole('textbox', { name: /Descripción/i });
    const evidenciaInput = screen.getByLabelText(/Evidencia/i);
    const submitButton = screen.getByRole("button", { name: /Enviar Reclamo/i });

    fireEvent.change(asuntoInput, { target: { value: "Test" } });
    fireEvent.change(descripcionTextarea, { target: { value: "Test desc" } });
    fireEvent.click(submitButton);

    expect(asuntoInput).toBeDisabled();
    expect(empresaSelect).toBeDisabled();
    expect(descripcionTextarea).toBeDisabled();
    expect(evidenciaInput).toBeDisabled();
    expect(submitButton).toBeDisabled();

    resolver();
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
});