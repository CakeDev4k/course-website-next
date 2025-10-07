import { promises as fs } from 'fs'
import path from 'path'

export class StorageService {
  private uploadDir = './uploads'

  async upload(buffer: Buffer, key: string): Promise<string> {
    // Criar diretório se não existir
    const dir = path.join(this.uploadDir, path.dirname(key))
    await fs.mkdir(dir, { recursive: true })
    
    // Salvar arquivo
    const filePath = path.join(this.uploadDir, `${key}.jpg`)
    await fs.writeFile(filePath, buffer)

    // Retornar URL (em produção seria URL do CDN)
    return `/uploads/${key}.jpg`
  }

  async delete(key: string): Promise<void> {
    // Garantir que a chave aponte para o arquivo com extensão
    let relativePath = key
    if (!relativePath.endsWith('.jpg') && !relativePath.endsWith('.png') && !relativePath.endsWith('.webp') && !relativePath.endsWith('.jpeg')) {
      relativePath = `${key}.jpg`
    }

    const filePath = path.join(this.uploadDir, relativePath)
    await fs.unlink(filePath).catch(() => {
      // Arquivo pode não existir - ignorar erro
    })
  }
}