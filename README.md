# 🛡️ AdShield AI - AI-Powered Scam Detection Platform

![AdShield AI Banner](https://img.shields.io/badge/AdShield-AI-purple?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?style=flat-square)

AdShield AI is an advanced AI-powered platform that helps users detect and prevent various types of online scams, including phishing emails, fraudulent documents, and AI-generated deepfake images.

## 🚀 Features

- **📧 Text Analysis**: Detect phishing emails and scam messages using advanced NLP
- **📄 Document Verification**: Analyze documents for forgery and fraud indicators
- **🤖 Deepfake Detection**: Identify AI-generated or manipulated images
- **🔍 Real-time Analysis**: Get instant results with detailed explanations
- **🎯 High Accuracy**: Powered by state-of-the-art Hugging Face models
- **🔒 Privacy-First**: All analysis is done securely without storing personal data

## 🏗️ Project Structure

```
AdShield-AI/
├── backend/              # FastAPI backend server
│   ├── main.py          # Main API application
│   ├── config.py        # Configuration management
│   ├── deepfake_analyzer.py  # Deepfake detection module
│   ├── services/        # API services
│   └── requirements.txt # Python dependencies
├── frontend/            # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/      # Application pages
│   │   ├── components/ # Reusable components
│   │   └── services/   # API services
│   ├── package.json    # Node dependencies
│   └── vercel.json     # Vercel deployment config
└── README.md           # This file
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Hugging Face Transformers** - AI model integration
- **PyTorch** - Deep learning framework
- **Pillow & PyPDF2** - Document processing

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **Lucide React** - Icon library

## 📋 Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn
- Hugging Face API token (free at [huggingface.co](https://huggingface.co))

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/adshield-ai.git
cd adshield-ai
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env and add your Hugging Face API token

# Run the backend
python -m uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL=http://localhost:8000

# Run the frontend
npm run dev
```

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173`

## 🌐 Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub (without .env files!)
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure environment variables:
   - `VITE_API_BASE_URL`: Your backend API URL
4. Deploy!

### Deploy Backend

The backend can be deployed to various platforms:

#### Option 1: Railway.app
1. Push to GitHub
2. Connect Railway to your GitHub repo
3. Add environment variables from `.env.example`
4. Deploy!

#### Option 2: Render.com
1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy!

#### Option 3: Google Cloud Run
```bash
# Build and deploy
gcloud run deploy adshield-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔑 Environment Variables

### Backend (.env)
```env
HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx  # Required
FRONTEND_URL=https://your-app.vercel.app
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend-api.com
```

## 📊 API Endpoints

- `POST /api/v1/text/analyze` - Analyze text for phishing
- `POST /api/v1/doc/analyze` - Analyze documents for fraud
- `POST /api/v1/deepfake/analyze` - Detect deepfake images
- `POST /api/v1/text/extract` - Extract text from images (OCR)
- `GET /health` - Health check endpoint

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co) for providing amazing AI models
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- [Vercel](https://vercel.com) for frontend hosting
- The open-source community for various tools and libraries

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**⚠️ Important Security Notes:**
- Never commit `.env` files to GitHub
- Keep your Hugging Face API token secret
- Use environment variables for all sensitive configuration
- Enable CORS only for trusted domains in production

Built with ❤️ by the AdShield AI Team
