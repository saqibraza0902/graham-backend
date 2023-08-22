import bcrypt from 'bcrypt'



export const comparePassword = async (hashpassword: string, password: string) => {
    return await bcrypt.compare(password, hashpassword)
}