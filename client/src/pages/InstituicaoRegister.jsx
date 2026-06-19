import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';

function InstituicaoRegister() { // <-- Nome da função atualizado
  // Controle de estado do formulário e de feedbacks da UI
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', cidade: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  // URL base consumida via variável de ambiente (Vite)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Atualiza os dados do formulário dinamicamente
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Executa validações nos campos antes de permitir o envio
  const validateForm = () => {
    const errors = [];
    
    if (!formData.nome.trim() || formData.nome.length < 3) {
      errors.push('O Nome da Escola deve ter pelo menos 3 caracteres.');
    }
    
    // Validação básica de formato de e-mail via Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push('Informe um e-mail válido.');
    }
    
    // Garante que o telefone inserido possua ao menos 10 dígitos numéricos
    if (formData.telefone && formData.telefone.replace(/\D/g, '').length < 10) {
      errors.push('Informe um telefone válido (mínimo de 10 dígitos com DDD).');
    }
    
    if (!formData.cidade.trim() || formData.cidade.length < 3) {
      errors.push('A Cidade/Estado deve ter pelo menos 3 caracteres.');
    }
    
    return errors; // Retorna array vazio se não houver erros
  };

  // Lida com a submissão dos dados para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessages([]);

    // Bloqueia a requisição se a validação do frontend falhar
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessages(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // POST para a rota pública de registro de instituições
      const response = await fetch(`${API_URL}/api/auth/register-institution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Exibe mensagem de sucesso e limpa o formulário
        setSuccessMessage('Solicitação recebida com sucesso! A nossa equipe revisará os dados e entrará em contato em breve para liberar seu acesso.');
        setFormData({ nome: '', email: '', telefone: '', cidade: '' });
      } else {
        // Exibe o erro retornado pelo backend (ex: e-mail já existe)
        setErrorMessages([data.message || 'Ocorreu um erro no cadastro.']);
      }
    } catch (error) {
      setErrorMessages(['Erro de conexão com o servidor. Verifique sua internet e tente novamente.']);
    } finally {
      setIsSubmitting(false); // Libera o botão de submissão
    }
  };

  return (
    <div className="min-h-screen bg-piano-black flex flex-col justify-center items-center font-poppins px-4 py-8">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-xl border border-key-divider p-8 shadow-2xl">
        
        {/* Cabeçalho da página */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sonatta para Escolas</h1>
          <p className="text-gray-400 text-sm">
            Preencha os dados abaixo para solicitar o acesso da sua instituição à plataforma.
          </p>
        </div>

        {/* Feedback visual de Sucesso - Renderiza apenas se houver sucesso */}
        {successMessage && (
          <div className="bg-green-900/50 border border-green-500 text-green-300 p-5 rounded-lg text-sm mb-6 text-center shadow-lg" data-testid="inst-reg-success-msg">
            <svg className="w-10 h-10 mx-auto mb-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Feedback visual de Erros - Renderiza a lista de validações que falharam */}
        {errorMessages.length > 0 && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-sm mb-6 shadow-lg">
            <ul className="list-disc list-inside px-2">
              {errorMessages.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Formulário - Ocultado automaticamente após o cadastro bem-sucedido */}
        {!successMessage && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs text-gray-400 font-semibold mb-1">Nome da Escola *</label>
              <Input 
                type="text" name="nome" 
                value={formData.nome} onChange={handleChange} 
                data-testid="inst-reg-name-input"
                required placeholder="Ex: Escola Harmonia" 
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 font-semibold mb-1">E-mail de Contato *</label>
              <Input 
                type="email" name="email" 
                value={formData.email} onChange={handleChange} 
                data-testid="inst-reg-email-input"
                required placeholder="contato@escola.com" 
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-semibold mb-1">Telefone / WhatsApp *</label>
              <Input 
                type="text" name="telefone" 
                value={formData.telefone} onChange={handleChange} 
                data-testid="inst-reg-phone-input"
                required placeholder="(61) 90000-0000" 
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-semibold mb-1">Cidade / Estado *</label>
              <Input 
                type="text" name="cidade" 
                value={formData.cidade} onChange={handleChange} 
                required placeholder="Ex: Brasília - DF" 
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="inst-reg-submit-button"
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-purple-500/20"
            >
              {isSubmitting ? 'Enviando solicitação...' : 'Solicitar Acesso'}
            </button>
          </form>
        )}

        {/* Link de retorno */}
        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm text-gray-400 hover:text-purple-300 font-semibold transition-colors">
            &larr; Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InstituicaoRegister;