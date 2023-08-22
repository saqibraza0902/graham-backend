import bcrypt from 'bcrypt';
export const comparePassword = async (hashpassword, password) => {
    return await bcrypt.compare(password, hashpassword);
};
//# sourceMappingURL=comparePassword.js.map