import dotenv from "dotenv";
import { User } from "../models/user.model.js"
import sgMail from "@sendgrid/mail"
import { ApiResponse } from "./ApiResponse.js";
import { ApiError } from "./ApiError.js";
import { asyncHandler } from "./asyncHandler.js";
import { Resend } from "resend";

// In-memory OTP storage with expiration
const otpStore = new Map();

dotenv.config({
    path: "./.env"
})

// sgMail.setApiKey(process.env.TWILIO_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY)

// Helper function to clean expired OTPs
const cleanExpiredOTPs = () => {
    const now = Date.now();
    for (const [key, value] of otpStore.entries()) {
        if (value.expiresAt < now) {
            otpStore.delete(key);
        }
    }
};

// Helper function to store OTP with expiration
const storeOTP = (recipient, otp, ttlSeconds) => {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    otpStore.set(`otp:${recipient}`, { otp, expiresAt });

    // Clean expired OTPs periodically
    cleanExpiredOTPs();
};

// Helper function to get OTP if not expired
const getOTP = (recipient) => {
    const stored = otpStore.get(`otp:${recipient}`);
    if (!stored) return null;

    if (stored.expiresAt < Date.now()) {
        otpStore.delete(`otp:${recipient}`);
        return null;
    }

    return stored.otp;
};

// Helper function to delete OTP
const deleteOTP = (recipient) => {
    return otpStore.delete(`otp:${recipient}`);
};

const sendOTP_ResetPass = asyncHandler(async (req, res) => {
    const { recipient } = req.body;
    const OTP = Math.floor((Math.random() * 9000)) + 1000;
    const OTP_TTL = 100; // Time-to-Live in seconds

    // Check if OTP already exists and delete it
    if (otpStore.has(`otp:${recipient}`)) {
        deleteOTP(recipient);
    }

    // Store new OTP with expiration
    storeOTP(recipient, OTP, OTP_TTL);

    const html = `<html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #ddd;">
            <header style="background-color: #4CAF50; color: white; padding: 10px 20px;">
              <h1 style="margin: 0;">Welcome!</h1>
            </header>
            <main style="padding: 20px;">
              <h2>Reset Password,</h2>
              <p>Thank you for joining our service. We're excited to have you on board!</p>
              <p style="line-height: 1.5;">
                Here is your OTP : ${OTP}
              </p>
              <hr>
              <p>If you have any questions, feel free to <a href="mailto:support@example.com">contact our support team</a>.</p>
              <p>Best regards,</p>
              <b>Avishek's Company</b>
            </main>
            <footer style="background-color: #f1f1f1; color: #555; text-align: center; padding: 10px 20px;">
              <p style="margin: 0;">&copy; 2024 Avishek's Company. All rights reserved.</p>
              <p style="margin: 0;">7-Purbasree Pally, Kolkata, India</p>
            </footer>
          </div>
        </body>
    </html>`

    const { data, error } = await resend.emails.send({
        from: "team@nexus-network.tech",
        to: recipient,
        subject: "Videotubes | OTP to reset your password",
        html: html
    });

    if (error) throw new ApiError(505, "Cannot send OTP");

    res.status(200).json(new ApiResponse(200, { status: "success" }, "OTP sent"))
})

const sendOTP_CreateAcc = asyncHandler(async (req, res) => {
    const { recipient } = req.body;

    const userExists = await User.findOne({ email: recipient });
    if (userExists) {
        console.log(userExists);
        return res.status(472).json(new ApiResponse(472, { userExists }, "User with same email exists"));
    }

    const OTP = Math.floor((Math.random() * 9000)) + 1000;
    console.log(OTP);
    const OTP_TTL = 100; // Time-to-Live in seconds

    // Check if OTP already exists and delete it
    if (otpStore.has(`otp:${recipient}`)) {
        deleteOTP(recipient);
    }

    // Store new OTP with expiration
    storeOTP(recipient, OTP, OTP_TTL);

    let html = `<html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #ddd;">
            <header style="background-color: #4CAF50; color: white; padding: 10px 20px;">
              <h1 style="margin: 0;">Welcome!</h1>
            </header>
            <main style="padding: 20px;">
              <h2>Create Your Account,</h2>
              <p>Thank you for joining our service. We're excited to have you on board!</p>
              <p style="line-height: 1.5;">
                Here is your OTP : ${OTP}
              </p>
              <hr>
              <p>If you have any questions, feel free to <a href="mailto:support@example.com">contact our support team</a>.</p>
              <p>Best regards,</p>
              <b>Avishek's Company</b>
            </main>
            <footer style="background-color: #f1f1f1; color: #555; text-align: center; padding: 10px 20px;">
              <p style="margin: 0;">&copy; 2024 Avishek's Company. All rights reserved.</p>
              <p style="margin: 0;">7-Purbasree Pally, Kolkata, India</p>
            </footer>
          </div>
        </body>
      </html>`

    const { data, error } = await resend.emails.send({
        from: "VideoTubes <team@nexus-network.tech>",
        to: recipient,
        subject: "Videotubes | Verification Code",
        html: html
    })
    console.log("Data", data)
    if (error) {
        console.log("Error --> ", error)
        throw new ApiError(505, "Cannot send OTP")
    }

    res.status(200).json(new ApiResponse(200, { mailId: data.id }, "OTP sent"))
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { recipient, otp } = req.body;
    console.log("Recipient-->", recipient);
    console.log("OTP-->", otp);

    const storedOTP = getOTP(recipient); // Retrieve the stored OTP

    if (storedOTP && storedOTP == otp) {
        // Delete OTP after successful verification
        deleteOTP(recipient);
        res.status(200).json(new ApiResponse(200, null, "OTP verified"));
    }
    else {
        throw new ApiError(400, "Invalid or expired OTP");
    }
})

export { sendOTP_CreateAcc, sendOTP_ResetPass, verifyOTP }