import React from 'react';

function isValidAbsoluteUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function EvidenceFile({ url }) {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  if (!url) {
    return <p className="text-gray-500 italic">No hay evidencia adjunta</p>;
  }

  let fullUrl;
  if (isValidAbsoluteUrl(url)) {
    fullUrl = url;
  } else {
    try {
      fullUrl = new URL(url, baseUrl).href;
    } catch {
      fullUrl = url;
    }
  }

  const fileName = fullUrl.split('/').pop();

  return (
    <div className="mt-2">
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-3 py-1 bg-[#325224] text-white rounded"
      >
        Descargar evidencia: {fileName}
      </a>
    </div>
  );
}
