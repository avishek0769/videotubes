import dotenv from "dotenv";
import { User } from "../models/user.model.js"
import sgMail from "@sendgrid/mail"
import { ApiResponse } from "./ApiResponse.js";
import { ApiError } from "./ApiError.js";
import { asyncHandler } from "./asyncHandler.js";
import Redis from "ioredis";
const redis = new Redis(); // Connects to the server running in my localhost:6379

dotenv.config({
  path: "./.env"
})

sgMail.setApiKey(process.env.TWILIO_API_KEY);

const sendOTP_ResetPass = asyncHandler(async (req, res) => {
  const { recipient } = req.body;
  const OTP = Math.floor((Math.random() * 9000)) + 1000;
  const OTP_TTL = 100; // Time-to-Live

  let user = await redis.get(`otp:${recipient}`);
  if (user) {
    let result = await redis.del(`otp:${recipient}`)
    if (result != 1) throw new ApiError(505, "Cannot delete the previous OTP");
  }

  await redis.set(`otp:${recipient}`, OTP, 'EX', OTP_TTL); // Store OTP in Redis with expiration
  const msg = {
    to: recipient, // Change to your recipient
    from: 'avishekadhikary42@gmail.com', // Change to your verified sender
    subject: "I am from YouTube clone App",
    text: "I do not what is this",
    html: `<html>
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
  };
  const mail = await sgMail.send(msg);
  if (mail[0].statusCode > 399) throw new ApiError(505, "Cannot send OTP");

  res.status(200).json(new ApiResponse(200, { status: mail[0].statusCode }, "OTP sent"))
})

const sendOTP_CreateAcc = asyncHandler(async (req, res) => {
  const { recipient } = req.body;

  const userExists = await User.findOne({ email: recipient });
  if(userExists) {
    console.log(userExists);
    res.status(472).json(new ApiResponse(472, { userExists }, "User with same email exists"));
  }

  const OTP = Math.floor((Math.random() * 9000)) + 1000;
  console.log(OTP);
  const OTP_TTL = 100; // Time-to-Live

  let user = await redis.get(`otp:${recipient}`);
  if (user) {
    let result = await redis.del(`otp:${recipient}`)
    if (result != 1) throw new ApiError(505, "Cannot delete the previous OTP");
  }

  await redis.set(`otp:${recipient}`, OTP, 'EX', OTP_TTL); // Store OTP in Redis with expiration
  const msg = {
    to: recipient, // Change to your recipient
    from: 'avishekadhikary42@gmail.com', // Change to your verified sender
    subject: "I am from YouTube clone App",
    text: "I do not what is this",
    html: `<html>
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
  };
  const mail = await sgMail.send(msg);
  if (mail[0].statusCode > 399) throw new ApiError(505, "Cannot send OTP");

  res.status(200).json(new ApiResponse(200, { status: mail[0].statusCode }, "OTP sent"))
})

const verifyOTP = asyncHandler(async (req, res) => {
  const { recipient, otp } = req.body;
  console.log("Recipient-->", recipient);
  console.log("OTP-->", otp);

  const storedOTP = await redis.get(`otp:${recipient}`); // Retrieve the stored OTP from Redis

  if (storedOTP == otp) {
    res.status(200).json(new ApiResponse(200, null, "OTP verified"));
  }
  else {
    throw new ApiError(400, "Invalid or expired OTP");
  }
})

export { sendOTP_CreateAcc, sendOTP_ResetPass, verifyOTP }