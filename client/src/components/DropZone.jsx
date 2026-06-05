import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';

function DropZone({ accept, label, onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  const handleUpload = useCallback(async (file) => {
    if (!file) return;

    setFileName(file.name);
    setStatus('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      setStatus('success');
      onUploadSuccess?.(response.data.url);
    } catch (error) {
      console.error('Erro no upload:', error);
      setStatus('error');
    }
  }, [API_URL, token, onUploadSuccess]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  const resetDropZone = () => {
    setStatus('idle');
    setUploadProgress(0);
    setFileName('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {/* Área de Drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => status === 'idle' && inputRef.current?.click()}
        className={`
          w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3
          transition-all cursor-pointer min-h-[140px]
          ${isDragging
            ? 'border-purple-400 bg-purple-500/10 scale-[1.01]'
            : status === 'success'
            ? 'border-green-500 bg-green-500/10 cursor-default'
            : status === 'error'
            ? 'border-red-500 bg-red-500/10 cursor-default'
            : 'border-gray-600 bg-gray-900 hover:border-purple-500 hover:bg-gray-800'
          }
        `}
      >
        {status === 'idle' && (
          <>
            <span className="text-3xl">📁</span>
            <p className="text-sm text-gray-400 text-center">
              <span className="text-purple-400 font-semibold">Clique para selecionar</span> ou arraste o arquivo aqui
            </p>
            <p className="text-xs text-gray-500">{label}</p>
          </>
        )}

        {status === 'uploading' && (
          <>
            <span className="text-3xl animate-bounce">⬆️</span>
            <p className="text-sm text-gray-300 font-medium">{fileName}</p>
            <p className="text-xs text-gray-400">Enviando... {uploadProgress}%</p>
          </>
        )}

        {status === 'success' && (
          <>
            <span className="text-3xl">✅</span>
            <p className="text-sm text-green-400 font-semibold">Upload concluído!</p>
            <p className="text-xs text-gray-400 truncate max-w-full px-2">{fileName}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <span className="text-3xl">❌</span>
            <p className="text-sm text-red-400 font-semibold">Erro no upload</p>
            <p className="text-xs text-gray-400">Tente novamente</p>
          </>
        )}
      </div>

      {/* Barra de Progresso */}
      {status === 'uploading' && (
        <div className="w-full mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">{uploadProgress}%</p>
        </div>
      )}

      {/* Botão de Reset */}
      {(status === 'success' || status === 'error') && (
        <button
          onClick={resetDropZone}
          className="mt-3 w-full text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 py-2 rounded-lg transition-colors"
        >
          {status === 'error' ? '🔄 Tentar novamente' : '📎 Enviar outro arquivo'}
        </button>
      )}

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default DropZone;