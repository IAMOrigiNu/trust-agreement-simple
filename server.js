import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'placeholder@gmail.com',
        pass: process.env.EMAIL_PASS || 'placeholder'
    }
});

// API endpoint for form submission
app.post('/api/submit', async (req, res) => {
    try {
        const formData = req.body;
        
        console.log('Received submission from:', formData.fullName);
        console.log('User:', formData.user);
        console.log('Email:', formData.email);
        
        // Format selected services for email
        let servicesText = '';
        for (const [key, value] of Object.entries(formData.selectedServices)) {
            if (value) {
                servicesText += `- ${key}\n`;
            }
        }
        
        // Email content
        const emailContent = `
Trust Launch Agreement Submission

Submitted by: ${formData.fullName}
User: ${formData.user === 'eli' ? 'Eli' : 'Carmen'}
Date: ${new Date(formData.submittedAt).toLocaleString()}

=== Contact Information ===
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}

=== Selected Services ===
${servicesText}

=== Custom Requirements ===
${formData.customRequirements || 'None'}

Signature: [Included as attachment]
        `;
        
        // Send email - must succeed for submission to be successful
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'noreply@trust-agreement.com',
            to: 'ocasiowillson@gmail.com',
            subject: `Trust Agreement Submission - ${formData.fullName}`,
            text: emailContent,
            attachments: [
                {
                    filename: `signature-${formData.user}.png`,
                    content: formData.signature.split('base64,')[1],
                    encoding: 'base64'
                }
            ]
        });
        
        console.log('Email sent successfully to ocasiowillson@gmail.com');
        res.json({ success: true, message: 'Agreement submitted successfully' });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ success: false, message: 'Error processing submission' });
    }
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Trust Agreement Customizer running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

