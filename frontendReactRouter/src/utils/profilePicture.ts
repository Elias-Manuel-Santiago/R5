const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 1.5 * 1024 * 1024

export async function readProfilePicture(file: File | undefined) {
  if (!file) throw new Error('Selecciona una imagen.')
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) throw new Error('Usa una imagen PNG, JPG, WEBP o GIF.')
  if (file.size > MAX_FILE_SIZE) throw new Error('La imagen no puede superar 1.5 MB.')

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    reader.onload = () => typeof reader.result === 'string'
      ? resolve(reader.result)
      : reject(new Error('No se pudo leer la imagen.'))
    reader.readAsDataURL(file)
  })
}
