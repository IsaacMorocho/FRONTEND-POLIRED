import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'
import { motion } from 'framer-motion'

const Profile = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div>
        <h1 
          style={{ fontFamily: 'Lora, serif' }}
          className='text-3xl font-bold text-white mb-2'
        >
          Mi Perfil
        </h1>
        <p className='text-slate-400'>Administra tu información personal y seguridad</p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información y Contraseña - 2 columnas */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FormProfile />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardPassword />
          </motion.div>
        </div>

        {/* Tarjeta de Perfil - 1 columna */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardProfile />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Profile
