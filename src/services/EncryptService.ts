import CryptoJS from 'crypto-js'

import { ENCRYPT_KEY } from '@Constants/encrypt'

export default class EncryptService {
  static encrypt(originalString: string) {
    return CryptoJS.AES.encrypt(originalString, ENCRYPT_KEY).toString()
  }

  static decrypt(encryptedString: string) {
    const bytes  = CryptoJS.AES.decrypt(encryptedString, ENCRYPT_KEY)
    const originalText = bytes.toString(CryptoJS.enc.Utf8)

    return originalText
  }

  static check(originalString: string, encryptedString: string) {
    return originalString === EncryptService.decrypt(encryptedString)
  }
}
