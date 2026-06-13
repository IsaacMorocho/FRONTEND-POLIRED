import CardProfileAR from '../components/profile/CardProfileAR'
import { motion } from 'framer-motion'

const ProfileAR = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6 p-2 sm:p-4"
    >
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className='text-3xl font-bold text-white'>
          Mi Perfil
        </h1>
      </div>


      {/* Contenido Principal */}
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-2xl">
          <CardProfileAR />
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileAR
