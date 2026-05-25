import AppStoreImage from '../assets/appstore.png'
import GooglePlayImage from '../assets/googleplay.png'
import { Link } from 'react-router-dom'
import { MdDashboard } from "react-icons/md";
import { FiActivity } from "react-icons/fi";
import { FiAlertCircle } from "react-icons/fi";
import { FaCommentSms } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { SiCashapp } from "react-icons/si";
import { FaCommentDots, FaBook, FaUsers, FaStore, FaGraduationCap, FaHandshake } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5';
import Aurora from '../components/Aurora';
import StarBorder from '../components/StarBorder';
import useSmoothScroll from '../hooks/useSmoothScroll';
import HeaderDynamic from '../components/HeaderDynamic';
import Masonry from '../components/Masonry';
import HeroWithAnimatedTitle from '../components/HeroWithAnimatedTitle';
import CountUp from '../components/CountUp';
import CommentsLoop from '../components/CommentsLoop';
import RotatingText from '../components/RotatingText';

// Contenido de Política de Privacidad
const POLITICA_PRIVACIDAD = `# POLÍTICA DE PRIVACIDAD DE POLIRED

**Versión:** 1.0
**Fecha de vigencia:** Lunes 25 de mayo del 2026

### 1. Introducción y responsable del tratamiento
PoliRed respeta su privacidad y está comprometida a proteger sus datos personales. Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos y protegemos su información cuando utiliza nuestra aplicación móvil y los servicios asociados. A los efectos de la Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador, el responsable del tratamiento de sus datos es Polired - Ecosistema Politecnico, con domicilio en Quito, Ecuador.

### 2. Datos que recopilamos
Recopilamos únicamente la información necesaria para brindarle el mejor servicio dentro de nuestra red universitaria:
*   **Datos de registro:** Correo electrónico institucional (requerido para verificación), nombre, apellido y carrera.
*   **Datos de perfil (Opcionales):** Fotografía de perfil y texto de biografía (información que usted decide hacer pública dentro de la red).
*   **Contenido generado por el usuario:** Publicaciones de texto e imágenes, comentarios, respuestas a comentarios, mensajes directos (chat privado), "me gusta" y elementos guardados.
*   **Datos técnicos y de uso:** Token de dispositivo (exclusivamente para enviar notificaciones push en tiempo real) y registros de actividad básicos o "logs" necesarios para el mantenimiento y depuración del sistema.

*Nota: PoliRed no recopila datos financieros, datos de tarjetas de crédito ni utiliza cookies de seguimiento o identificadores para publicidad de terceros.*

### 3. Cómo usamos los datos
Sus datos personales se utilizan exclusivamente para los siguientes fines:
*   Crear, verificar y administrar su cuenta como estudiante universitario.
*   Proporcionar las funcionalidades core de la aplicación (mostrar su perfil, procesar sus publicaciones, mensajes y redes comunitarias).
*   Enviar notificaciones en tiempo real sobre interacciones relevantes (como nuevos mensajes, comentarios o likes).
*   Garantizar la seguridad de la plataforma, prevenir fraudes, suplantación de identidad o comportamientos abusivos.
*   Mejorar el rendimiento técnico de la aplicación analizando métricas de uso generales.

### 4. Base legal del tratamiento
De conformidad con la LOPDP, procesamos sus datos fundamentados en las siguientes bases legales:
*   **Consentimiento explícito:** Al registrarse y crear un perfil en PoliRed.
*   **Ejecución de un contrato:** Para poder brindarle los servicios de red social, mensajería y notificaciones acordados en nuestros Términos y Condiciones.
*   **Interés legítimo:** Para garantizar la seguridad de la red y optimizar la experiencia técnica de nuestros usuarios.

### 5. Compartición de datos
**PoliRed NO vende, alquila ni comercializa sus datos personales a terceros bajo ninguna circunstancia.**
Solo compartimos la información estrictamente necesaria con proveedores de infraestructura tecnológica que actúan como encargados del tratamiento, sujetos a estrictos acuerdos de confidencialidad. Específicamente, utilizamos el servicio **Pusher** de manera exclusiva para facilitar la transmisión de notificaciones en tiempo real. 

### 6. Retención de datos
Conservaremos sus datos personales mientras su cuenta de PoliRed permanezca activa. Si usted decide eliminar su cuenta, sus datos de perfil y credenciales de acceso serán eliminados de nuestras bases de datos de forma inmediata. Sin embargo, podríamos retener información de manera anonimizada o por el tiempo estrictamente necesario que exijan las obligaciones legales aplicables en Ecuador.

### 7. Derechos del usuario
Como titular de los datos y de acuerdo con la LOPDP, usted goza de los siguientes derechos:
*   **Acceso:** Conocer qué datos personales suyos tenemos almacenados.
*   **Rectificación:** Corregir datos inexactos o incompletos.
*   **Eliminación (Derecho al olvido):** Solicitar la eliminación total de su cuenta y sus datos.
*   **Portabilidad:** Recibir sus datos en un formato estructurado y legible.
*   **Oposición y suspensión:** Oponerse a ciertos usos de sus datos o solicitar la suspensión temporal del tratamiento.

Para ejercer cualquiera de estos derechos, puede escribirnos directamente a nuestro correo de contacto proporcionado al final de este documento.

### 8. Seguridad de los datos
Hemos implementado medidas técnicas, administrativas y organizativas robustas (como el uso de conexiones cifradas y un servidor propio de almacenamiento de imágenes) diseñadas para proteger sus datos personales contra el acceso no autorizado, la pérdida, alteración o destrucción.

### 9. Datos de menores
PoliRed es una red social exclusiva para estudiantes universitarios. Por lo tanto, nuestros servicios están dirigidos estrictamente a personas mayores de 18 años. No recopilamos conscientemente datos de menores de edad. Si detectamos que una cuenta pertenece a un menor, procederemos a eliminarla inmediatamente.

### 10. Cambios a esta política
Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios legales o mejoras operativas. Cualquier cambio sustancial será notificado a los usuarios activos a través de la aplicación o al correo electrónico institucional asociado a su cuenta, antes de que las modificaciones entren en vigor.

### 11. Contacto
Si tiene alguna pregunta, inquietud o desea ejercer sus derechos de privacidad, por favor contáctenos en:
**Correo electrónico:** soportepolired@gmail.com`;

// Contenido de Términos y Condiciones
const TERMINOS_CONDICIONES = `# TÉRMINOS Y CONDICIONES DE USO

**Versión:** 1.0
**Fecha de vigencia:** Lunes 25 de mayo del 2026

### 1. Aceptación de los términos
Al descargar, acceder y registrarse en la aplicación móvil PoliRed ("la Aplicación"), usted acepta regirse legalmente por los presentes Términos y Condiciones de Uso. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.

### 2. Elegibilidad
El uso de PoliRed es estrictamente exclusivo para estudiantes universitarios activos. Para crear una cuenta, es un requisito obligatorio poseer y validar un correo electrónico institucional universitario válido. PoliRed se reserva el derecho de rechazar registros o revocar el acceso si se determina que un usuario no cumple con este criterio de elegibilidad.

### 3. Cuenta de usuario
Usted es el único responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta. 
*   Se prohíbe terminantemente la creación de cuentas falsas, el uso de correos institucionales de terceros o la suplantación de identidad.
*   Usted se compromete a notificar de inmediato a PoliRed sobre cualquier uso no autorizado de su cuenta.

### 4. Contenido del usuario
Usted retiene todos los derechos de propiedad intelectual sobre los textos, imágenes y comentarios que publique a través de PoliRed. Sin embargo, al publicar contenido, usted otorga a PoliRed una licencia mundial, no exclusiva y libre de regalías para alojar, almacenar y mostrar dicho contenido dentro de los límites de la Aplicación. 
Usted es legal y éticamente el único responsable de todo el contenido que comparta.

### 5. Conducta prohibida
Para mantener a PoliRed como un espacio seguro, respetuoso y académico, está estrictamente prohibido utilizar la aplicación para:
1.  Publicar o promover contenido ofensivo, difamatorio, discriminatorio, violento o que incite al odio.
2.  Acosar, amenazar, intimidar o realizar prácticas de *bullying* contra otros usuarios.
3.  Enviar spam, publicidad no solicitada o contenido que no guarde relación con la vida o el contexto universitario.
4.  Suplantar la identidad de autoridades académicas, profesores, otros estudiantes o instituciones.
5.  Distribuir, sin autorización, material académico, imágenes o contenido protegido por derechos de autor.
6.  Utilizar la plataforma para coordinar o promover actividades ilegales bajo las leyes ecuatorianas.
7.  Intentar hackear, descompilar, inyectar código malicioso o explotar vulnerabilidades técnicas del sistema.

### 6. Mensajes directos
PoliRed ofrece un servicio de mensajería privada entre usuarios. Respetamos la privacidad de sus comunicaciones y no moderamos proactivamente los mensajes directos. No obstante, en caso de recibir denuncias formales por abuso, acoso o violaciones a estos términos, PoliRed se reserva el derecho de investigar y tomar medidas disciplinarias sobre las cuentas infractoras.

### 7. Redes comunitarias
Los usuarios pueden crear o unirse a "Redes" (grupos temáticos). El creador o administrador de una Red es responsable de gestionar a sus miembros y el contenido que allí se genere. PoliRed puede disolver Redes que infrinjan los lineamientos de Conducta Prohibida (Sección 5).

### 8. Propiedad intelectual de PoliRed
El diseño de la aplicación, código fuente, logotipos, interfaces, arquitectura del servidor backend (Node.js) y cualquier tecnología subyacente desarrollada para la Aplicación son propiedad exclusiva de PoliRed. No se permite copiar, modificar o distribuir nuestro software sin autorización explícita por escrito.

### 9. Disponibilidad del servicio
PoliRed se esfuerza por mantener la plataforma operativa de forma ininterrumpida, pero no garantiza una disponibilidad del 100% (24/7). El servicio puede verse temporalmente interrumpido por labores de mantenimiento, actualizaciones en los servidores de imágenes, incidencias con proveedores externos o causas de fuerza mayor.

### 10. Limitación de responsabilidad
En la máxima medida permitida por la ley ecuatoriana, PoliRed no será responsable de los daños directos, indirectos o incidentales que puedan derivarse del uso de la Aplicación. PoliRed actúa como una plataforma intermediaria y no avala, respalda ni se hace responsable por el contenido, opiniones o materiales compartidos por los usuarios en sus perfiles, redes comunitarias o chats.

### 11. Suspensión y terminación
PoliRed se reserva el derecho, a su entera discreción y sin previo aviso, de suspender o eliminar de forma permanente la cuenta de cualquier usuario que incumpla los presentes Términos y Condiciones, o cuyo comportamiento atente contra la integridad y seguridad de la comunidad universitaria.

### 12. Modificaciones
PoliRed puede revisar y actualizar estos Términos y Condiciones en cualquier momento. Notificaremos a los usuarios sobre cambios importantes a través de una alerta en la Aplicación o vía correo electrónico. El uso continuo de la Aplicación después de la entrada en vigencia de los cambios constituirá su aceptación de los nuevos términos.

### 13. Ley aplicable
Estos Términos y Condiciones se rigen e interpretan de acuerdo con las leyes de la República del Ecuador. Cualquier disputa que surja en relación con el uso de la Aplicación estará sujeta a la jurisdicción exclusiva de los tribunales competentes en el Ecuador.

### 14. Contacto
Para reportar violaciones a estos términos, resolver dudas o realizar consultas, contáctenos en:
**Correo electrónico:** soportepolired@gmail.com`;

const RegresarBoton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
    const toggleVisibility = () => {
        if (window.scrollY >100) {
            setIsVisible(true);
        } else {
        setIsVisible(false);
        }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
    isVisible && (
        <button
            onClick={scrollToTop}
            className="fixed bottom-4.5 left-4 z-50 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition"
            aria-label="Volver arriba"
            >
        <FaArrowUp className="w-5 h-5" />
        </button>
    )
);

};

const ModalTerminosCondiciones = ({ isOpen, onClose, content, title }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur">
                            <h2 className="text-2xl font-bold text-white">{title}</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                                aria-label="Cerrar modal"
                            >
                                <IoClose size={28} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 text-gray-300 space-y-4 prose-invert max-w-none">
                            {content.split('\n').map((line, idx) => {
                                if (line.startsWith('# ')) {
                                    return <h1 key={idx} className="text-2xl font-bold text-white mt-6 mb-4">{line.replace('# ', '')}</h1>;
                                } else if (line.startsWith('### ')) {
                                    return <h3 key={idx} className="text-lg font-bold text-purple-400 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                                } else if (line.startsWith('**') && line.endsWith('**')) {
                                    return <p key={idx} className="font-semibold text-white">{line.replace(/\*\*/g, '')}</p>;
                                } else if (line.startsWith('*   ')) {
                                    return <li key={idx} className="ml-4">{line.replace('*   ', '')}</li>;
                                } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ') || line.startsWith('6. ') || line.startsWith('7. ')) {
                                    return <li key={idx} className="ml-4">{line.replace(/^\d\.\s/, '')}</li>;
                                } else if (line.trim() === '') {
                                    return <div key={idx} className="h-2" />;
                                } else {
                                    return <p key={idx} className="text-gray-300">{line}</p>;
                                }
                            })}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Home =()=>{
    // Aplicar scroll suave en toda la página
    useSmoothScroll();
    
    const [poliredPosition, setPoliredPosition] = useState({ x: 0, y: 0, opacity: 0 });
    const [modalOpen, setModalOpen] = useState(null); // null, 'privacidad', o 'terminos'
    
    return ( 
        <>
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full overflow-x-hidden">
                
                <div className="relative w-full bg-black min-h-screen overflow-x-hidden">
                    {/* Aurora Background - Responsive */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1500px', minHeight: '1200px', zIndex: 0, backgroundColor: '#000000', overflow: 'hidden' }}>
                        <Aurora
                            colorStops={["#4a5fec","#b390d3","#e72f1f"]}
                            blend={2.5}
                            amplitude={0.80}
                            speed={0.5}
                        />
                    </div>

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                    
                        {/* Header Dinámico con transiciones smooth */}
                        <HeaderDynamic poliredPosition={poliredPosition} />

                        {/* Hero con animación de PoliRED */}
                        <HeroWithAnimatedTitle onPoliredUpdate={setPoliredPosition} />

                        {/* Features Card Section - Resto del contenido */}
                        <section className='w-full py-8 md:py-16 px-4'>
                            <div className='container mx-auto'>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className='relative overflow-hidden rounded-3xl bg-slate-800 shadow-xl p-8 md:p-12'
                                >
                                    {/* Animated Shine Border */}
                                    <div className='absolute inset-0 rounded-3xl p-[2px] z-0 pointer-events-none'>
                                        <div 
                                            className='absolute inset-0 rounded-3xl opacity-100'
                                            style={{
                                                background: 'conic-gradient(from 0deg, #A07CFE, #FE8FB5, #FFBE7B, #A07CFE)',
                                                animation: 'spin 25s linear infinite'
                                            }}
                                        />
                                        <div className='absolute inset-0.5 rounded-3xl bg-slate-900' />
                                    </div>

                                    <div className='relative z-10 flex flex-col gap-12'>
                                        {/* Title - Top Animation */}
                                        <motion.div
                                            initial={{ opacity: 0, y: -50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.5 }}
                                            transition={{ duration: 0.7, ease: 'easeOut' }}
                                            className='w-full text-center'
                                        >
                                            <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight'>
                                                ¿Qué puedes hacer con <span className='text-purple-400'>PoliRED</span>?
                                            </h2>
                                        </motion.div>

                                        {/* Grid of 6 Features - Bottom Animation */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                                            {/* Feature 1 */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 100 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                                                className='relative flex flex-col items-start gap-4 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-colors overflow-hidden'
                                            >
                                                <FaCommentDots className='absolute bottom-0 right-0 w-32 h-32 text-purple-600 opacity-15 -mb-8 -mr-8' />
                                                <div className='relative z-10'>
                                                    <h3 className='text-white font-bold text-xl'>Chats en tiempo real</h3>
                                                    <p className='text-gray-300 text-base mt-2'>Comunicate con tus compañeros al instante.</p>
                                                </div>
                                            </motion.div>

                                            {/* Feature 2 */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 100 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                                                className='relative flex flex-col items-start gap-4 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-colors overflow-hidden'
                                            >
                                                <FaBook className='absolute bottom-0 right-0 w-32 h-32 text-purple-600 opacity-15 -mb-8 -mr-8' />
                                                <div className='relative z-10'>
                                                    <h3 className='text-white font-bold text-xl'>Comparte recursos</h3>
                                                    <p className='text-gray-300 text-base mt-2'>Publica y encuentra apuntes, guías y más.</p>
                                                </div>
                                            </motion.div>

                                            {/* Feature 3 */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 100 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
                                                className='relative flex flex-col items-start gap-4 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-colors overflow-hidden'
                                            >
                                                <FaUsers className='absolute bottom-0 right-0 w-32 h-32 text-purple-600 opacity-15 -mb-8 -mr-8' />
                                                <div className='relative z-10'>
                                                    <h3 className='text-white font-bold text-xl'>Red universitaria</h3>
                                                    <p className='text-gray-300 text-base mt-2'>Conéctate con estudiantes de toda la EPN.</p>
                                                </div>
                                            </motion.div>

                                            {/* Feature 4 */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 100 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                                                className='relative flex flex-col items-start gap-4 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-colors overflow-hidden'
                                            >
                                                <FaHandshake className='absolute bottom-0 right-0 w-32 h-32 text-purple-600 opacity-15 -mb-8 -mr-8' />
                                                <div className='relative z-10'>
                                                    <h3 className='text-white font-bold text-xl'>Construye tu comunidad</h3>
                                                    <p className='text-gray-300 text-base mt-2'>Crea grupos y espacios para estudiantes con intereses similares.</p>
                                                </div>
                                            </motion.div>

                                            {/* Feature 5 */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 100 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
                                                className='relative flex flex-col items-start gap-4 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-colors overflow-hidden'
                                            >
                                                <FaStore className='absolute bottom-0 right-0 w-32 h-32 text-purple-600 opacity-15 -mb-8 -mr-8' />
                                                <div className='relative z-10'>
                                                    <h3 className='text-white font-bold text-xl'>Compra y venta de libros</h3>
                                                    <p className='text-gray-300 text-base mt-2'>Intercambia libros y materiales académicos con otros estudiantes.</p>
                                                </div>
                                            </motion.div>

                                            {/* Feature 6 */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 100 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
                                                className='relative flex flex-col items-start gap-4 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-colors overflow-hidden'
                                            >
                                                <FaGraduationCap className='absolute bottom-0 right-0 w-32 h-32 text-purple-600 opacity-15 -mb-8 -mr-8' />
                                                <div className='relative z-10'>
                                                    <h3 className='text-white font-bold text-xl'>Artefactos universitarios</h3>
                                                    <p className='text-gray-300 text-base mt-2'>Vende y compra artículos, equipos y recursos estudiantiles.</p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </section>
                        <section id="publicaciones" className='w-full py-12 md:py-20 px-4'>
                            <div className='container mx-auto'>
                                <div className='relative mb-12 md:mb-16'>
                                    <h1 className='font-semibold text-white text-2xl sm:text-3xl md:text-4xl relative z-1 w-full text-center'>Aprovecha las oportunidades que ofrecen otros usuarios</h1>
                                </div>
                                <Masonry
                                    items={[
                                    { id: "1", img: "/images/publicaciones/pub1.jpeg", url: "#", height: 400 },
                                    { id: "2", img: "/images/publicaciones/pub2.jpeg", url: "#", height: 500 },
                                    { id: "3", img: "/images/publicaciones/pub3.jpeg", url: "#", height: 350 },
                                    { id: "4", img: "/images/publicaciones/pub4.jpeg", url: "#", height: 450 },
                                    { id: "5", img: "/images/publicaciones/pub5.jpeg", url: "#", height: 380 },
                                    { id: "6", img: "/images/publicaciones/pub6.jpeg", url: "#", height: 420 },
                                    { id: "7", img: "/images/publicaciones/pub7.jpeg", url: "#", height: 390 },
                                    { id: "8", img: "/images/publicaciones/pub8.jpeg", url: "#", height: 460 },
                                    { id: "9", img: "/images/publicaciones/pub9.jpeg", url: "#", height: 370 },
                                    { id: "10", img: "/images/publicaciones/pub10.jpeg", url: "#", height: 410 },
                                    { id: "11", img: "/images/publicaciones/pub11.jpeg", url: "#", height: 400 },
                                    { id: "12", img: "/images/publicaciones/pub12.jpeg", url: "#", height: 430 },
                                    { id: "13", img: "/images/publicaciones/pub13.jpeg", url: "#", height: 360 },
                                    ]}
                                    ease="power4.out"
                                    duration={0.8}
                                    stagger={0.11}
                                    animateFrom="center"
                                    scaleOnHover
                                    hoverScale={0.95}
                                    blurToFocus
                                    colorShiftOnHover={false}
                                />
                            </div>
                        </section>
                        <section id='comentarios' className='w-full py-10 md:py-28 px-4'>
                                <div className='w-full px-4 md:px-10'>
                                    <div className='flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8'>
                                    {/* Left side - Statistics */}
                                    <div className='flex-1'>
                                        <h3 className='text-white text-5xl sm:text-6xl md:text-7xl font-bold mb-4'>
                                            +<CountUp
                                                from={0}
                                                to={400}
                                                separator=","
                                                direction="up"
                                                duration={1}
                                                className="text-purple-500"
                                            />
                                        </h3>
                                        <p className='text-gray-300 text-lg md:text-xl'>Estudiantes activos en la app.</p>
                                    </div>

                                    {/* Right side - Comments Loop */}
                                    <div className='flex-1 w-full'>
                                        <CommentsLoop
                                        comments={[
                                            {
                                            name: "María Fernanda",
                                            career: "Ingeniería de Software",
                                            rating: 5,
                                            text: "La app me ayudó a encontrar apuntes y conectar con compañeros rápidamente."
                                            },
                                            {
                                            name: "Carlos M.",
                                            career: "Electrónica",
                                            rating: 5,
                                            text: "Los chats funcionan perfecto, es como tener un grupo por cada materia."
                                            },
                                            {
                                            name: "Valeria P.",
                                            career: "Civil",
                                            rating: 4,
                                            text: "Muy útil para compartir recursos y resolver dudas en tiempo real."
                                            },
                                            {
                                            name: "Andrés C.",
                                            career: "Mecánica",
                                            rating: 5,
                                            text: "La mejor plataforma para estudiantes de la Poli, todo en un solo lugar."
                                            }
                                        ]}
                                        speed={1.2}
                                        direction="left"
                                        interactive
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section id="servicios" className='w-full bg-black py-16 px-4'>
                            <style>{`
                                .card {
                                  position: relative;
                                  width: 350px;
                                  height: 280px;
                                  background-color: #200f46ef;
                                  border-radius: 16px;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  overflow: hidden;
                                  perspective: 1000px;
                                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                                  transition: all 5.0s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                                }

                                .card-logo {
                                  position: absolute;
                                  width: 80px;
                                  height: 80px;
                                  object-fit: contain;
                                  opacity: 1.15;
                                  z-index: 1;
                                }
                                .grid-center-logo {
                                  position: absolute;
                                  top: 50%;
                                  left: 50%;
                                  transform: translate(-50%, -50%);
                                  width: 450px;
                                  height: 440px;
                                  object-fit: contain;
                                  opacity: 0.8;
                                  z-index: 10;
                                  pointer-events: none;
                                }
                                .card svg {
                                  width: 50px;
                                  fill: #af2d2d;
                                  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                                }

                                .card img {
                                  width: 100%;
                                  height: 100%;
                                  object-fit: cover;
                                  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                                }   

                                .card:hover {
                                  transform: scale(1.05);
                                  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
                                }

                                .card__content {
                                  position: absolute;
                                  top: 0;
                                  left: 0;
                                  width: 100%;
                                  height: 100%;
                                  padding: 20px;
                                  box-sizing: border-box;
                                  background-color: #f2f2f2;
                                  transform: rotateX(-90deg);
                                  transform-origin: bottom;
                                  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                                }

                                .card:hover .card__content {
                                  transform: rotateX(0deg);
                                }

                                .card__title {
                                  margin: 0;
                                  font-size: 28px;
                                  color: #333;
                                  font-weight: 700;
                                }

                                .card:hover img {
                                  scale: 0;
                                }

                                .card__description {
                                  margin: 10px 0 0;
                                  font-size: 16px;
                                  color: #777;
                                  line-height: 1.4;
                                }
                            `}</style>
                            <div className='w-full'>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className='mb-16 text-center'
                                >
                                    <h2 className='font-semibold text-white text-2xl sm:text-3xl md:text-4xl'>Nuestras Redes Comunitarias</h2>
                                    <p className='text-gray-400 text-base md:text-lg mt-4'>Descubre las comunidades académicas disponibles y únete a la que te interese</p>
                                </motion.div>
                                
                                {/* Grid de 2x2 con tarjetas tipo card */}
                                <div className='w-full px-4 md:px-8 lg:px-20 py-12'>
                                    <div className='relative grid grid-cols-1 md:grid-cols-2 gap-8 justify-center'>
                                        {/* Logo centrado */}
                                        <img className='grid-center-logo' src="/images/logo_facus.png" alt="Logo" />
                                        {/* Red FIQA */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                            className='flex justify-center'
                                        >
                                            <div className='card'>
                                                <img src="/images/facus/fiqa.png" alt="FIQA" />
                                                <div className='card__content'>
                                                    <p className='card__title text-center'>Red FIQA</p>
                                                    <p className='card__description'>Ingeniería Química y Agroindustria</p>
                                                    <p className='card__description' style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>+90 miembros</p>
                                                    <p className='card__description' style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>+15 publicaciones por dia</p>
                                                    <p className='card__description' style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>#Química #Agroindustria #Sostenibilidad</p>
                                                    <p className='card__description' style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}>↑ 12% Actividad</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Red FIM */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                                            className='flex justify-center'
                                        >
                                            <div className='card'>
                                                <img src="/images/facus/fim.png" alt="FIM" />
                                                <div className='card__content'>
                                                    <p className='card__title text-center'>Red FIM</p>
                                                    <p className='card__description'>Ingeniería Mecánica</p>
                                                    <p className='card__description' style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>+95 miembros</p>
                                                    <p className='card__description' style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>+18 publicaciones por dia</p>
                                                    <p className='card__description' style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>#Mecánica #Diseño #Ingeniería</p>
                                                    <p className='card__description' style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}>↑ 18% Actividad</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Red FIEE */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                                            className='flex justify-center'
                                        >
                                            <div className='card'>
                                                <img src="/images/facus/fiee.jpg" alt="FIEE" />
                                                <div className='card__content'>
                                                    <p className='card__title text-center'>Red FIEE</p>
                                                    <p className='card__description'>Ingeniería Eléctrica y Electrónica</p>
                                                    <p className='card__description' style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>+100 miembros</p>
                                                    <p className='card__description' style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>+22 publicaciones por dia</p>
                                                    <p className='card__description' style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>#Electrónica #Programación #IoT</p>
                                                    <p className='card__description' style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}>↑ 24% Actividad</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Red ESFOT */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
                                            className='flex justify-center'
                                        >
                                            <div className='card'>
                                                <img src="/images/facus/esfot.jpg" alt="ESFOT" />
                                                <div className='card__content'>
                                                    <p className='card__title text-center'>Red ESFOT</p>
                                                    <p className='card__description'>Escuela de Formación de Tecnólogos</p>
                                                    <p className='card__description' style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>+80 miembros</p>
                                                    <p className='card__description' style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>+12 publicaciones por dia</p>
                                                    <p className='card__description' style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>#Tecnología #Desarrollo #Innovación</p>
                                                    <p className='card__description' style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}>↑ 15% Actividad</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* CONTROL DE ESPACIADO ENTRE SECCIONES: Cambiar py-12 md:py-20 */}
                        <section id="about" className='w-full py-20 md:py-32 px-4 bg-black'>
                            <div className='container mx-auto bg-slate-900 rounded-3xl p-8 md:p-12 lg:p-16'>
                                <div className='flex flex-col lg:flex-row gap-12 md:gap-16 items-start'>
                                    {/* Título e imagen lado izquierdo */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                        className='w-full lg:w-1/2 flex flex-col gap-8'
                                    >
                                        <div>
                                            <h2 className='font-bold text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-6'>
                                                ¿QUIÉNES
                                                <br />
                                                <span className='text-purple-500'>SOMOS?</span>
                                            </h2>
                                        </div>
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                                        >
                                            <img src="/images/logo_actual.png" alt="Logo PoliRED" className='w-10 sm:w-40 md:w-52 h-auto object-contain' />
                                        </motion.div>
                                    </motion.div>

                                    {/* Texto descriptivo lado derecho */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                        className='w-full lg:w-1/2 flex flex-col justify-start'
                                    >
                                        <div className='mb-6'>
                                            <p className='text-gray-300 text-sm uppercase tracking-wider mb-4'>PLATAFORMA ACADÉMICA COLABORATIVA</p>
                                            <p className='text-white text-base sm:text-lg leading-relaxed mb-6'>PoliRED es una plataforma creada para conectar a la comunidad estudiantil de la Escuela Politécnica Nacional mediante un entorno digital seguro, dinámico y colaborativo.</p>
                                        </div>

                                        <div className='mb-6'>
                                            <p className='text-purple-500 font-semibold text-sm uppercase tracking-wider mb-3'>→ NUESTRO OBJETIVO</p>
                                            <p className='text-white text-base sm:text-lg leading-relaxed'>Facilitar el intercambio de información académica, recursos estudiantiles y comunicación entre estudiantes de distintas carreras y facultades, fortaleciendo la interacción dentro de la EPN.</p>
                                        </div>

                                        <div>
                                            <p className='text-purple-500 font-semibold text-sm uppercase tracking-wider mb-3'>→ LA VISIÓN</p>
                                            <p className='text-white text-base sm:text-lg leading-relaxed'>Más que una red social, PoliRED busca convertirse en un espacio universitario donde la colaboración y la participación formen parte de la experiencia estudiantil diaria.</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </section>

                        {/* RotatingText Component */}
                        <section className='w-full py-16 md:py-24 px-4 bg-black'>
                            <div className='container mx-auto flex justify-center items-center'>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className='text-center flex flex-wrap justify-center items-center gap-3 md:gap-4'
                                >
                                    <h3 className='text-4xl sm:text-5xl md:text-6xl font-bold text-white'>
                                        Conectamos
                                    </h3>
                                    <RotatingText
                                        texts={['estudiantes', 'ideas', 'comunidades', 'conocimientos','carreras']}
                                        mainClassName="px-3 sm:px-4 md:px-6 bg-slate-900 text-white overflow-hidden py-1 sm:py-2 md:py-3 justify-center rounded-lg inline-block text-4xl sm:text-5xl md:text-6xl font-bold"
                                        staggerFrom="first"
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "-120%" }}
                                        staggerDuration={0.055}
                                        splitLevelClassName="overflow-hidden pb-1 sm:pb-1.5 md:pb-2"
                                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                        rotationInterval={2300}
                                        splitBy="characters"
                                        auto
                                        loop
                                    />
                                </motion.div>
                            </div>
                        </section>

                    </div>
                </div>

                <footer className='relative w-full bg-black py-12 sm:py-16 md:py-20 text-center overflow-hidden'>
                    {/* Aurora Background - Invertido */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '600px', zIndex: 0, backgroundColor: '#000000', transform: 'scaleY(-1)', overflow: 'hidden' }}>
                        <Aurora
                            colorStops={["#4a5fec","#b390d3","#e72f1f"]}
                            blend={1.2}
                            amplitude={4.50}
                            speed={0.5}
                        />
                    </div>

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 10 }} className='px-4 sm:px-6 md:px-20 space-y-6 md:space-y-8'>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                            <div className='flex justify-center md:justify-start gap-4 md:gap-6'>
                                <ul className='flex gap-3 md:gap-4'>
                                    <li>
                                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                            <FaFacebook className="text-lg sm:text-xl md:text-2xl text-white hover:text-blue-400 transition-colors" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                            <FaSquareInstagram className="text-lg sm:text-xl md:text-2xl text-white hover:text-pink-400 transition-colors" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                                            <FaXTwitter className="text-lg sm:text-xl md:text-2xl text-white hover:text-gray-300 transition-colors" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <p className="text-center md:text-right text-white/70 text-xs sm:text-sm">Envíanos tus sugerencias o comunícate con nosotros al correo: <span className="text-purple-400">soportepolired@gmail.com</span></p>
                        </div>
                        <hr className='border-1 border-gray-700' />
                        
                        {/* Footer Links - Términos y Condiciones / Políticas de Privacidad */}
                        <div className='flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6'>
                            <p className='text-xs sm:text-sm font-semibold text-gray-300'>
                                EPN - ESFOT - Desarrollo de Software
                            </p>
                            <span className='text-gray-600'>|</span>
                            <button
                                onClick={() => setModalOpen('terminos')}
                                className='text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors underline cursor-pointer'
                            >
                                Términos y Condiciones
                            </button>
                            <span className='text-gray-600'>|</span>
                            <button
                                onClick={() => setModalOpen('privacidad')}
                                className='text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors underline cursor-pointer'
                            >
                                Políticas de Privacidad
                            </button>
                        </div>
                    </div>
                </footer>

                {/* Modales */}
                <ModalTerminosCondiciones
                    isOpen={modalOpen === 'terminos'}
                    onClose={() => setModalOpen(null)}
                    content={TERMINOS_CONDICIONES}
                    title="Términos y Condiciones"
                />
                <ModalTerminosCondiciones
                    isOpen={modalOpen === 'privacidad'}
                    onClose={() => setModalOpen(null)}
                    content={POLITICA_PRIVACIDAD}
                    title="Política de Privacidad"
                />
            <RegresarBoton />
</motion.div>
        </>
    )
}    
export default Home;