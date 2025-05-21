import './index.css';
import logo from './assets/logo-placeholder.svg'; // descomentei a linha

export default function App() {
  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center px-[50px] py-[30px]">
        <div className="flex items-center gap-[10px]">
          <img src={logo} alt="Logo Sonatta" className="w-7 h-7" />
          <span className="text-lg font-semibold">Sonatta</span>
        </div>
        <div>
          <a href="#" className="ml-6 text-white text-sm font-semibold hover:underline">Cadastrar</a>
          <a href="#" className="ml-6 text-white text-sm font-semibold hover:underline">Entrar</a>
        </div>
      </header>

      {/* Hero */}
      <main
        className="flex items-end h-[90vh] px-[50px] py-[40px]"
        style={{
          backgroundImage: 'url("/background-guitar.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div>
          <h1 className="text-2xl max-w-[400px] mb-6">
            Aprenda no seu ritmo,<br />com tecnologia que escuta você.
          </h1>
          <div className="flex gap-4">
            <button className="bg-white text-[#0C0C0C] font-bold py-3 px-5 rounded">Comece Agora Gratuitamente</button>
            <button className="border border-white text-white py-3 px-5 rounded">Veja como funciona</button>
          </div>
        </div>
      </main>
    </div>
  );
}
