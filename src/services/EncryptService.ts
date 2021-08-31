import bcrypt from 'bcrypt'

export default class EncryptService {
  static hash(originalString: string): string {
    return bcrypt.hashSync(originalString, 8)
  }

  static async check(originalString: string, encryptedString: string): Promise<boolean> {
    return await bcrypt.compare(originalString, encryptedString)
  }
}
