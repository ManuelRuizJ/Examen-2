import { Menu } from "./components/Menu";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pb-6">
        <h1 className="text-5xl font-bold text-center mb-10 pt-9">
          Menu
        </h1>
        <Menu />
      </div>
    </>
  );
}

export default App;
