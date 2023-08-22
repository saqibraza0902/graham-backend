import sgMail from '@sendgrid/mail'
sgMail.setApiKey("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")



interface SendEmailProps {
    to: string
    from: string
    subject: string
    text: string
    html: string
}
export const sendEmail = async (msg: SendEmailProps) => {
    return await sgMail
        .send(msg)
}