const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailToMe = ({ from, text, contact, name }) => {
    console.log(process.env.EMAIL);
    return new Promise((resolve, reject) => {
        const msg = {
            from: process.env.FROM_EMAIL,
            to: process.env.TO_EMAIL,
            subject: "EMAIL FROM PORTFOLIO",
            text: `
                From: ${from}

                Text: ${text}

                Sender: ${name}

                contact: ${contact}
            `,
        };
        sgMail
            .send(msg)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
                console.trace(error);
            });
    });
};

module.exports = {
    sendEmailToMe
}
