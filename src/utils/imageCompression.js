import imageCompression from 'browser-image-compression'

export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 800,
    useWebWorker: true
  }
  
  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('이미지 압축 실패:', error)
    return file
  }
}