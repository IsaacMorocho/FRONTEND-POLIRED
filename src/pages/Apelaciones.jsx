import Apelaciones_Panel_Admin from '../components/list/Apelaciones_Panel_Admin';

const Apelaciones = () => {
  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Apelaciones de Estudiantes</h1>
        <p className="text-slate-400 mt-1">Revisa y resuelve las solicitudes de reactivación de cuentas suspendidas por acumulación de strikes.</p>
      </div>

      <Apelaciones_Panel_Admin />
    </div>
  );
};

export default Apelaciones;
