import CardPasswordAR from '../components/profile/CardPasswordAR'
import CardProfileAR from '../components/profile/CardProfileAR'
import FormProfileAR from '../components/profile/FormProfileAR'
import { motion } from 'framer-motion'

const ProfileAR = () => {
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
            <FormProfileAR />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardPasswordAR />
          </motion.div>
        </div>

        {/* Tarjeta de Perfil - 1 columna */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardProfileAR />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProfileAR
