import { useNavigate } from 'react-router-dom';
export const NotFound = () => {
    const navigate = useNavigate();

    const salir = () => {
    navigate('/');
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-slate-200 to-purple-200 px-6">
      <div className="bg-amber-50 shadow-2xl rounded-3xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
            <img
            src="/images/notFound.png"
            alt="Página no encontrada"
            className="w-48 h-72 mx-auto object-cover [mask-image:radial-gradient(circle,white_60%,transparent_100%)]"
            />
        </div>

        <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          ¡Vaya! No encontramos esta página
        </h2>
        <p className="text-md text-gray-600 mb-6">
          Puede que el enlace esté roto o que la página haya sido movida.
        </p>

        <button
          onClick={salir}
          className="inline-block px-6 py-3 bg-gray-600
           text-white rounded-full shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300"
        >
          Regresar
        </button>
      </div>
    </div>
  );
};