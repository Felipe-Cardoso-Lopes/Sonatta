import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InstituicaoSidebar from '../components/InstituicaoSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function InstituicaoSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [preferences, setPreferences] = useState({ notif_email: true, notif_sms: false, notif_marketing: true });

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return alert("As senhas não coincidem!");
    try {
      await axios.put(`${API_URL}/api/instituicoes/security`, passwords, getAuthHeaders());
      alert("Senha atualizada com sucesso!");
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { alert(err.response?.data?.message || "Erro ao atualizar senha."); }
  };

  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/instituicoes/preferences`, preferences, getAuthHeaders());
      alert("Preferências salvas com sucesso!");
      setPreferences(res.data.preferences);
    } catch (err) { alert("Erro ao salvar preferências."); }
  };

  return (
    <div className="min-h-screen bg-piano-black text-white-text flex">
      <InstituicaoSidebar />
      <main className="flex-grow p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Configurações da Instituição</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          {['general', 'security', 'notifications'].map((tab, idx) => (
            <button
              key={idx}
              className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === tab ? 'text-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'general' ? 'Geral' : tab === 'security' ? 'Segurança' : 'Notificações'}
              {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"></span>}
            </button>
          ))}
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-gray-700 p-8 shadow-lg max-w-3xl">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Configurações Gerais</h2>
              <p className="text-gray-400">Edite as informações públicas da sua escola na tela de "Perfil".</p>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSecurityUpdate} className="space-y-5 animate-fadeIn">
              <h2 className="text-xl font-bold mb-4">Alterar Senha</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Senha Atual</label>
                <input type="password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded p-3 text-white" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nova Senha</label>
                  <input type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded p-3 text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Confirmar Nova Senha</label>
                  <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded p-3 text-white" required />
                </div>
              </div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white font-bold mt-4 transition">Atualizar Segurança</button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handlePreferencesUpdate} className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold mb-4">Preferências de Notificação</h2>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={preferences.notif_email} onChange={e => setPreferences({...preferences, notif_email: e.target.checked})} className="w-5 h-5 accent-purple-600" />
                <span className="text-gray-200">Receber e-mails sobre novas matrículas e repasses</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={preferences.notif_marketing} onChange={e => setPreferences({...preferences, notif_marketing: e.target.checked})} className="w-5 h-5 accent-purple-600" />
                <span className="text-gray-200">Receber dicas de marketing e novidades da Sonatta</span>
              </label>

              <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white font-bold transition">Salvar Preferências</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default InstituicaoSettings;