import React, { useState, useEffect } from 'react';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays, startOfDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// 1. Configuração de Localização e Datas para o Calendário (Português)
const locales = {
  'pt-BR': ptBR,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

function SoloTeacherSchedule() {
  const [availabilities, setAvailabilities] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados do formulário de novo horário
  const [dayOfWeek, setDayOfWeek] = useState('1'); // Padrão: Segunda-feira
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');

  const teacherId = 1; // Temporário: Aqui entrará o ID do professor logado vindo do AuthContext

  // 2. Função para mapear 'day_of_week' (0-6) para uma data real na semana atual
  const mapToCurrentWeek = (dayOfWeekStr, timeStr) => {
    const today = new Date();
    const currentDayOfWeek = getDay(today);
    const targetDayOfWeek = parseInt(dayOfWeekStr);
    
    // Encontra a diferença de dias para mapear para a semana atual do calendário
    const diff = targetDayOfWeek - currentDayOfWeek;
    const targetDate = addDays(startOfDay(today), diff);
    
    const [hours, minutes] = timeStr.split(':');
    targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return targetDate;
  };

  // 3. Simulação/Fetch dos dados (Na integração real, chamaremos a API GET)
  useEffect(() => {
    // Aqui entrará o fetch: GET /api/schedule/availability/${teacherId}
    const fetchAvailabilities = async () => {
      // Dados de exemplo simulando o retorno do nosso backend
      const mockData = [
        { id: 1, day_of_week: 1, start_time: '14:00', end_time: '16:00' },
        { id: 2, day_of_week: 3, start_time: '09:00', end_time: '11:00' },
      ];
      setAvailabilities(mockData);

      // Converte os dados do banco para o formato exigido pelo react-big-calendar
      const calendarEvents = mockData.map(slot => ({
        id: slot.id,
        title: 'Horário Livre',
        start: mapToCurrentWeek(slot.day_of_week, slot.start_time),
        end: mapToCurrentWeek(slot.day_of_week, slot.end_time),
      }));
      setEvents(calendarEvents);
    };

    fetchAvailabilities();
  }, []);

  // 4. Lógica para adicionar um novo horário
  const handleAddAvailability = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aqui entrará o fetch: POST /api/schedule/availability
      console.log('A enviar para a API:', { day_of_week: dayOfWeek, start_time: startTime, end_time: endTime });
      
      // Simulação visual imediata de sucesso
      const newSlot = {
        id: Date.now(),
        title: 'Horário Livre',
        start: mapToCurrentWeek(dayOfWeek, startTime),
        end: mapToCurrentWeek(dayOfWeek, endTime),
      };
      
      setEvents([...events, newSlot]);
      alert('Horário adicionado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar horário.');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Customização visual dos blocos do calendário
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#22c55e', // Verde (indicando livre)
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <SoloTeacherSidebar />

      <main className="flex-grow p-4 md:p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold border-b border-gray-700 pb-4">Gerir Agenda</h1>
        
        {/* Formulário de Adição Rápida */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Adicionar Disponibilidade</h2>
          <form onSubmit={handleAddAvailability} className="flex flex-col md:flex-row gap-4 items-end">
            
            <div className="w-full md:w-1/3">
              <label className="block text-sm text-gray-300 mb-1">Dia da Semana</label>
              <select 
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="0">Domingo</option>
                <option value="1">Segunda-feira</option>
                <option value="2">Terça-feira</option>
                <option value="3">Quarta-feira</option>
                <option value="4">Quinta-feira</option>
                <option value="5">Sexta-feira</option>
                <option value="6">Sábado</option>
              </select>
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm text-gray-300 mb-1">Início</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm text-gray-300 mb-1">Fim</label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors h-[42px]"
            >
              {isLoading ? 'A adicionar...' : '+ Adicionar'}
            </button>
          </form>
        </section>

        {/* Visualização do Calendário */}
        <section className="bg-white p-6 rounded-lg shadow-md text-black h-[600px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            views={['week', 'day']}
            culture="pt-BR"
            eventPropGetter={eventStyleGetter}
            min={new Date(2025, 0, 1, 6, 0)} // Inicia o dia às 06:00
            max={new Date(2025, 0, 1, 23, 0)} // Termina o dia às 23:00
            formats={{
              dayFormat: 'EEEE' // Oculta a data específica, mostra apenas "Segunda-feira", etc.
            }}
          />
        </section>

      </main>
    </div>
  );
}

export default SoloTeacherSchedule;