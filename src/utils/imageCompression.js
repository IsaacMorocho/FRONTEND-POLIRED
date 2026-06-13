import imageCompression from 'browser-image-compression';

export const compressImage = async (imageFile) => {
  if (!imageFile) return null;
  
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };
  
  try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.error("Error al comprimir la imagen:", error);
    // Si falla, retornamos el archivo original para que no se bloquee el flujo
    return imageFile;
  }
};
