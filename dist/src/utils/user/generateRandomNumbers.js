import otpGenerator from 'otp-generator';
export const generateRandomeNumber = ({ length = 6 }) => {
    return otpGenerator.generate(length, { upperCaseAlphabets: false, specialChars: false });
};
//# sourceMappingURL=generateRandomNumbers.js.map