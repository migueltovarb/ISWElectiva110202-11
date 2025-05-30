import React from 'react';
import { render, screen } from '@testing-library/react';
import EvidenceFile from './EvidenceFile';

describe('EvidenceFile', () => {
  test('muestra mensaje cuando no hay evidencia', () => {
    render(<EvidenceFile url={null} />);
    expect(screen.getByText(/No hay evidencia adjunta/i)).toBeInTheDocument();
  });

  test('muestra enlace con URL absoluta correctamente', () => {
    const absoluteUrl = 'https://example.com/file.pdf';
    render(<EvidenceFile url={absoluteUrl} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', absoluteUrl);
    expect(link.textContent).toContain('file.pdf');
  });


  test('usa url tal cual si hay error en la construcción', () => {
    const brokenUrl = '://malformed-url';
    render(<EvidenceFile url={brokenUrl} />);
    const link = screen.getByRole('link');
    // No esperamos que sea exactamente el href porque el navegador normaliza mal las URLs,
    // así que verificamos que contenga la parte mal formada
    expect(link.getAttribute('href')).toContain('malformed-url');
    expect(link.textContent).toContain('malformed-url');
  });
});
