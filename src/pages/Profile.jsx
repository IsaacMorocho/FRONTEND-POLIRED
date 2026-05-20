import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'
import { motion } from 'framer-motion'

const Profile = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}>
      <h1 
        style={{ fontFamily: 'Lora, serif' }}
        className='font-black text-2xl md:text-3xl lg:text-4xl text-gray-600'>Perfil</h1>
      <hr className='my-2 md:my-4' />
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start w-full px-2 md:px-4">
          <div className="w-full lg:w-2/3">
            <FormProfile />
            <CardPassword/>
          </div>
          <div className="w-full lg:w-1/3">
            <CardProfile />
          </div>
        </div>
    </motion.div>
  )
}

export default Profile
