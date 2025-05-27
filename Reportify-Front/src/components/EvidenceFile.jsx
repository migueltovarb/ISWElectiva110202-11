import React from 'react';

export default function EvidenceFile({ url }) {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  if (!url) {
    return <p className="text-gray-500 italic">No hay evidencia adjunta</p>;
  }

  let fullUrl;
  try {
    fullUrl = url.startsWith('http') ? url : new URL(url, baseUrl).href;
  } catch {
    // fallback si URL es inválida
    fullUrl = url;
  }

  const fileName = fullUrl.split('/').pop();

  return (
    <div className="mt-2">
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Descargar evidencia: {fileName}
      </a>
    </div>
  );
}
