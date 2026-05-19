// importaciones fetch y axios
import axios from "axios";
import { toast } from "react-toastify"; 

// custom hook "use..." (para ser usado luego)
function useFetch(){
    const fetchDataBackend = async (url, form=null, method='POST')=>{ //peticion al backend
        try {
            let respuesta //
            if(method==="POST"){
                respuesta= await axios.post(url,form) //se ejecuta la libreria axios con la url y el formulario si es POST
            }else if (method==="GET"){
                respuesta =await axios.get(url) //se ejecuta la libreria axios con la url si es GET
        }
            toast.success(respuesta?.data?.msg)
            return respuesta?.data
        } catch (error) { //
            toast.error(error.response?.data?.msg) //por el formato json .data ....
            const errorMsg=error.response?.data?.msg || 'Un error ha ocurrido' // cargar el error o enviar el mensaje
            throw new Error(errorMsg)
        }
    }
    return {fetchDataBackend}
}
export default useFetch