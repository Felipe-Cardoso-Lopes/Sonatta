import React, { useState, useRef } from 'react';
import axios from 'axios';

function DropZone({ accept = "*/*", label, onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const validateAndUpload = async (file) => {
    setErrorMessage('');
    
    // Validação de 10MB no Cliente
    if (file.size > 10 * 1024 * 1024) {
      setStatus('error');
      setErrorMessage('O arquivo excede o limite de 10MB.');
      return;
    }

    setStatus('uploading');

    try {
      const token = localStorage.getItem('token');
      
      // Passo 1: Solicitar URL pré-assinada ao Backend
      const authRes = await axios.post(`${API_URL}/api/upload`, {
        fileName: file.name,
        fileType: file.type
      }, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      const { signedUrl, token: supabaseToken, url: finalPublicUrl } = authRes.data;

      // Passo 2: Fazer o upload diretamente para o Storage (ex: Supabase) ignorando o Vercel
      await axios.put(signedUrl, file, {
        headers: { 
          'Content-Type': file.type,
          'Authorization': `Bearer ${supabaseToken}` // Necessário no Supabase v2
        },
      });

      setStatus('success');
      if (onUploadSuccess && finalPublicUrl) onUploadSuccess(finalPublicUrl);
      
      // Reseta após 3 segundos
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Erro ao enviar o arquivo.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) validateAndUpload(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) validateAndUpload(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => status !== 'uploading' && fileInputRef.current?.click()}
      className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer
        ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 bg-[#252525] hover:border-purple-400'}
        ${status === 'uploading' ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept={accept} />
      
      {status === 'idle' && (
        <>
          <span className="text-2xl mb-2">📁</span>
          <p className="text-sm text-gray-300 text-center font-semibold">{label || 'Arraste ou Clique para Anexar'}</p>
          <p className="text-xs text-gray-500 mt-1">PDF, DOCX, Imagens ou MP4 (Máx. 10MB)</p>
        </>
      )}

      {status === 'uploading' && (
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-purple-300 font-bold">Enviando arquivo...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center text-green-400">
          <span className="text-2xl mb-1">✅</span>
          <p className="text-sm font-bold">Documento salvo!</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center text-red-400">
          <span className="text-2xl mb-1">❌</span>
          <p className="text-sm font-bold text-center">{errorMessage}</p>
          <p className="text-xs mt-2 underline hover:text-red-300">Tentar novamente</p>
        </div>
      )}
    </div>
  );
}

export default DropZone;