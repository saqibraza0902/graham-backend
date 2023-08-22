import bcrypt from 'bcrypt';
export const createHashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};
//# sourceMappingURL=createHashPassword.js.map