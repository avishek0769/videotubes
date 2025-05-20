# VideoTubes - A Video Streaming Platform

A feature-rich video streaming platform that allows users to upload, watch, and interact with videos, similar to YouTube. Built with Node.js and modern web technologies.

## 🌟 Key Features

### Video Management
- Upload and stream videos
- Adaptive video quality with resolution switching
- Real-time video transcoding using FFmpeg
- Video segmentation into 10-second chunks
- Bandwidth-optimized video delivery

### User Features
- Email verification with OTP for registration
- Customizable user profiles
- Channel management
- Password recovery with OTP verification
- Watch history tracking

### Social Features
- Subscribe to channels
- Like and comment on videos
- Create and manage playlists (public/private)
- Community posts with likes and comments
- View subscriber lists and subscriptions

## 🛠️ Technical Stack

- **Backend**: Express.js
- **Container**: Docker
- **Media Processing**: FFmpeg
- **Database**: MongoDB
- **Caching**: Redis
- **Frontend**: HTML, Tailwind CSS, JavaScript

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x
- Docker
- Redis
- FFmpeg

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
cd Project
npm install
```

3. Build and run with Docker:
```bash
docker build -t videotubes .
docker run -p 3000:3000 videotubes
```

## 🏗️ Project Structure

```
Project/
├── public/           # Static files
│   ├── HTML_files/   # HTML templates
│   └── Javascript/   # Client-side scripts
├── src/
│   ├── controllers/  # Request handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middlewares/  # Custom middlewares
│   └── utils/        # Utility functions
```

## 🎥 Video Processing

The platform uses FFmpeg for video processing:
- Automatically transcodes uploaded videos
- Creates multiple resolution versions
- Segments videos into 10-second chunks
- Enables adaptive streaming based on user's bandwidth

## 🔐 Security Features

- Email verification
- OTP-based authentication
- Secure password reset
- Protected routes
- Private/Public content options

<!-- ## 📝 License

[Your chosen license] -->

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.