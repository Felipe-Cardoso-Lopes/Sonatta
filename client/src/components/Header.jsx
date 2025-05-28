function NavigationBar() {
  return (
    <nav className="flex justify-between items-center p-5 ">
      <div className="flex items-center gap-3 ">
        <img src="/img/sonatta-logo.png" alt="Sonatta Logo" className="w-12 h-12 scale-150 transition-transform hover:scale-125"/>
        <h2 className="text-white text-2xl font-bold">Sonatta</h2>
      </div>

      <div className="flex gap-6">
        <a href="#" className="text-white text-xl hover:font-bold">
          Cadastrar
        </a>
        <a href="#" className="text-white text-xl hover:font-bold">
          Entrar
        </a>
      </div>
    </nav>
  );
}

export default NavigationBar;
