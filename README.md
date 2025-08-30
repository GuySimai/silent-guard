# Silent Guard

AI-powered security system for detecting suspicious events in security cameras.

## Project Structure

The project consists of two main components:

### 🖥️ Silent Guard Client

Next.js application with a modern user interface for managing security cameras.

**Technologies:**

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Drizzle ORM
- NextAuth.js

**Features:**

- Security camera management
- Camera categories
- Real-time viewing
- Video recordings
- User permission system

### 🤖 Silent Guard Server

Python server that handles suspicious event detection using artificial intelligence.

**Technologies:**

- Python
- OpenCV
- TensorFlow/PyTorch
- Flask/FastAPI

**Features:**

- Motion detection
- Real-time video analysis
- Automatic alerts
- Advanced image processing

## Installation and Setup

### Client

```bash
cd silent-guard-client
npm install
npm run dev
```

### Server

```bash
cd silent-guard-server/main-server
pip install -r requirements.txt
python app.py
```

## License

MIT License
