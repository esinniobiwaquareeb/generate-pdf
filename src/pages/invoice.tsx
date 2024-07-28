import { useState } from 'react';

export default function Invoice() {
  const [isGenerating, setIsGenerating] = useState(false);

  //   make api call
  const generatePdf = async () => {
    setIsGenerating(true);
    const response = await fetch('/api/generate-invoice');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setIsGenerating(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Generate Invoice</h1>
      <button onClick={generatePdf} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Receipt'}
      </button>
    </div>
  );
}
