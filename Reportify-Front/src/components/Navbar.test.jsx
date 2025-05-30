import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('muestra el título correctamente', () => {
    render(<Navbar />);
    const titulo = screen.getByText('Bienvenido al Sistema de Reclamos');
    expect(titulo).toBeInTheDocument();
  });

  it('tiene botones "Mi perfil" y "Salir"', () => {
    render(<Navbar />);
    const botonPerfil = screen.getByText('Mi perfil');
    const botonSalir = screen.getByText('Salir');
    expect(botonPerfil).toBeInTheDocument();
    expect(botonSalir).toBeInTheDocument();
  });

  it('muestra alert al hacer click en los botones', () => {
    // Mockear window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Navbar />);
    
    const botonPerfil = screen.getByText('Mi perfil');
    fireEvent.click(botonPerfil);
    expect(alertMock).toHaveBeenCalledWith('Funcionalidad no disponible aún');

    const botonSalir = screen.getByText('Salir');
    fireEvent.click(botonSalir);
    expect(alertMock).toHaveBeenCalledWith('Funcionalidad no disponible aún');

    alertMock.mockRestore();
  });
});
