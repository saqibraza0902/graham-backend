import jwt from 'jsonwebtoken';
export const generateResetToken = (data) => {
    return jwt.sign(data, process.env.RESET_TOKEN, { expiresIn: 60 * 10 }); // 10 minutes
};
export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.RESET_TOKEN, (err, user) => {
            if (err) {
                reject({ message: 'Invalid token or token has been expired.' });
            }
            else {
                resolve(user);
            }
        });
    });
};
//# sourceMappingURL=resetToken.js.map