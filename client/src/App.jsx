import NavigationBar from "./components/Header";

function App() {
  return (
    <div className="h-screen-full w-screen-full bg-bgDarkSonatta font-raleway p-1">
      <NavigationBar />

      <main className="flex flex-col justify-center min-h-[calc(100vh-96px)] p-10">
        
        <h1 className="text-white text-4xl md:text-6xl max-w-2xl leading-tight">
          Aprenda no seu ritmo, com tecnologia que escuta você.
        </h1>

        <div className="mt-10 flex flex-col gap-4 w-full max-w-sm">
          <button className="bg-[#222222] text-white p-5 rounded-xl hover:bg-neutral-800 hover:font-bold">
            Comece Agora Gratuitamente
          </button>

          <button className="bg-[#222222] text-white p-5 rounded-xl hover:bg-neutral-800 hover:font-bold">
            Veja como funciona
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
