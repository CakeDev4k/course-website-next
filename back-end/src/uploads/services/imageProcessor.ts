import { StorageService } from './storageService.ts'
import { generateImageKey } from '../utils/imageValidation.ts'

export class ImageProcessor {
  private storageService: StorageService

  constructor() {
    this.storageService = new StorageService()
  }

  async processAndUpload(
    buffer: Buffer,
    filename: string,
    userId: string
  ): Promise<{ url: string; key: string }> {
    try {
      // Gerar chave única
      const key = generateImageKey(filename, userId)
      
      // Processar imagem (redimensionar, otimizar)
      const processedBuffer = await this.processImage(buffer)
      
      // Upload para storage
      const url = await this.storageService.upload(processedBuffer, key)
      
      return { url, key }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      throw new Error(`Erro ao processar imagem: ${errorMessage}`)
    }
  }

  private async processImage(buffer: Buffer): Promise<Buffer> {
    const sharp = await import('sharp')
    return sharp.default(buffer)
      .resize(800, 600, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer()
  }

  async deleteImage(key: string): Promise<void> {
    await this.storageService.delete(key)
  }
}
