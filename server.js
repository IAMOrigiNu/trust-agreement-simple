import express from 'express';
import nodemailer from 'nodemailer';
const { createTransport } = nodemailer;
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Email configuration
const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'noreply@trustlaunch.com',
        pass: process.env.EMAIL_PASS || ''
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.post('/api/submit-agreement', async (req, res) => {
    try {
        const { formData, pdfBase64, csvData } = req.body;

        const userName = formData.user === 'eli' ? 'Eli Thompson' : 'Carmen Rodriguez';
        
        // Create email with attachments
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@trustlaunch.com',
            to: 'ocasiowillson@gmail.com',
            subject: `Trust Agreement Submission - ${userName}`,
            html: `
                <h2>New Trust Agreement Submission</h2>
                <p><strong>Submitted by:</strong> ${userName}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                <hr>
                <h3>Contact Information</h3>
                <p><strong>Name:</strong> ${formData.fullName}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Phone:</strong> ${formData.phone}</p>
                <p><strong>Address:</strong> ${formData.address}</p>
                <h3>Partner Information</h3>
                <p><strong>Name:</strong> ${formData.partnerName}</p>
                <p><strong>Email:</strong> ${formData.partnerEmail}</p>
                <p><strong>Phone:</strong> ${formData.partnerPhone}</p>
                ${formData.customRequirements ? `
                <h3>Custom Requirements</h3>
                <p>${formData.customRequirements}</p>
                ` : ''}
                <hr>
                <p>Please see the attached PDF for the complete agreement and CSV for the data export.</p>
            `,
            attachments: [
                {
                    filename: `Trust_Agreement_${userName.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
                    content: pdfBase64,
                    encoding: 'base64'
                },
                {
                    filename: `Trust_Data_${userName.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`,
                    content: csvData
                }
            ]
        };

        // For development/testing without email credentials, log instead
        if (!process.env.EMAIL_PASS) {
            console.log('Email would be sent with the following details:');
            console.log('To:', mailOptions.to);
            console.log('Subject:', mailOptions.subject);
            console.log('Form Data:', formData);
            
            // Simulate successful send
            res.json({ 
                success: true, 
                message: 'Agreement submitted successfully (development mode)',
                data: formData
            });
            return;
        }

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: 'Agreement submitted successfully'
        });

    } catch (error) {
        console.error('Error submitting agreement:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error submitting agreement',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Trust Agreement Customizer running on port ${PORT}`);
    console.log(`Access at: http://localhost:${PORT}`);
});

