import sgMail from '@sendgrid/mail';
sgMail.setApiKey("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");
export const sendEmail = async (msg) => {
    return await sgMail
        .send(msg);
};
//# sourceMappingURL=sendGrid.js.map