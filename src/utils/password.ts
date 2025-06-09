// Your own logic for dealing with plaintext password strings; be careful!
import crypto from 'crypto';
    
export const saltAndHashPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
    
    }
