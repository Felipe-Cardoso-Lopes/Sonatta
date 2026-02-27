import React from 'react';
import StudentSidebar from '../components/StudentSidebar';

function StudentProfile() {
  // Dados de exemplo - no futuro, isso virá do seu backend
  const user = {
    name: 'Nome do Usuário',
    email: 'email@email.com',
    joinDate: '00/00/00',
    gender: 'M',
  };

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <StudentSidebar />

      {/* Conteúdo Principal do Perfil */}
      <main className="flex-grow p-6 md:p-12">
        <div className="w-full h-full flex flex-col gap-8">
          
          {/* Seção Superior: Perfil e Medalhas */}
          <section className="flex flex-col lg:flex-row gap-8">
            {/* Card de Perfil */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="w-32 h-32 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  {/* Placeholder para a imagem do avatar */}
                </div>
                {/* Informações do Usuário */}
                <div className="bg-gray-700 p-4 rounded-lg flex-1 w-full">
                  <p className="font-bold text-xl">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <div className="flex justify-between text-gray-400 text-sm mt-2">
                    <span>{user.joinDate}</span>
                    <span>{user.gender}</span>
                  </div>
                </div>
              </div>
              <button className="bg-sidebar-bg w-32 py-2 rounded-lg hover:bg-opacity-80">
                Editar Perfil
              </button>
            </div>

            {/* Card de Medalhas */}
            <div className="w-full lg:w-1/3 bg-gray-700 rounded-lg flex flex-col items-center justify-center p-4 min-h-[200px]">
              <p className="text-lg font-semibold mb-2">Badges</p>
              <div className="w-full h-full bg-gray-600 rounded-md flex items-center justify-center">
                <span>Medalhas</span>
              </div>
            </div>
          </section>

          {/* Seção Inferior: Estatísticas */}
          <section className="flex-grow flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/4 flex flex-col gap-8">
              <div className="bg-gray-700 rounded-lg flex-1 flex items-center justify-center min-h-[150px]">Streak de Exercícios</div>
              <div className="bg-gray-700 rounded-lg flex-1 flex items-center justify-center min-h-[150px]">Certificados</div>
            </div>
            <div className="flex-grow bg-gray-700 rounded-lg flex items-center justify-center min-h-[332px]">
              Estatísticas
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default StudentProfile;