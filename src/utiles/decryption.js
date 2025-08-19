import crypto from 'node:crypto'
import env from 'dotenv'
env.config()

const key=process.env.CRYPTO_KEY

function decrypt(text){
const [Ivhex,encrypted]=text.split(":")
const Iv=Buffer.from(Ivhex,'hex')
    const decipher=crypto.createDecipheriv("aes-256-cbc",key,Iv)
    let decrypted=decipher.update(encrypted,'hex',"utf-8")
    decrypted+=decipher.final('utf-8')
    return decrypted
}


export default decrypt