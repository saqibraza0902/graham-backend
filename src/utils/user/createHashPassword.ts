import bcrypt from 'bcrypt'


export const createHashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
}