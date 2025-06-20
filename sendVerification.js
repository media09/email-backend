const express = require('express');
const cors = require('cors');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // Set this in your .env file

const tranEmailApi = new Sib.TransactionalEmailsApi();

const SENDER = {
  email: 'finalmediabooster@gmail.com', // Must be verified in Brevo
  name: 'MyAfrique Support'
};

app.post('/send-code', async (req, res) => {
  const { email, code } = req.body;

  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender: SENDER,
      to: [{ email }],
      subject: 'Your MyAfrique Verification Code',
      htmlContent: `<p>Hello,</p><p>Your verification code is: <strong>${code}</strong></p><p>Thank you for using MYA PAY.</p>`,
    });

    console.log('Email sent:', response);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
