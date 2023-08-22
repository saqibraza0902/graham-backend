import jwt from 'jsonwebtoken'

export const generateResetToken = (data: { email: string }) => {
    return jwt.sign(data, process.env.RESET_TOKEN, { expiresIn: 60 * 10 }) // 10 minutes
}

export const verifyToken = (token: string): Promise<{ email: string } | null> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.RESET_TOKEN as string, (err, user) => {
            if (err) {
                reject({message:'Invalid token or token has been expired.'});
            } else {
                resolve(user as { email: string });
            }
        });
    });
};