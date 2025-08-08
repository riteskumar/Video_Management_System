# Video Management System (VMS)

This project is a full-stack Video Management System with a React + Vite frontend and a Flask backend. It supports live video streams, AI model integration, and alert management.

---

## Backend (Flask)


### Setup

1. **Install dependencies:**
   ```sh
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the server:**
   ```sh
   python run.py
   ```
---

## Frontend (React + Vite)


### Setup

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```sh
   npm run dev
   ```
   - The app will be available at [http://localhost:5173](http://localhost:5173) by default.

3. **Build for production:**
   ```sh
   npm run build
   ```

---
## Screenshots

Below are example screenshots of the application:

### Dashboard

<img width="1894" height="842" alt="image" src="https://github.com/user-attachments/assets/70316b58-4765-42bf-a1a9-2d6a9cb4599e" />



## Usage

- **Frontend:** Visit the frontend URL in your browser.
- **Backend:** Ensure the Flask server is running (default at `http://127.0.0.1:5000`).
- The frontend communicates with the backend via REST API (`/api` endpoints).

---
- If you encounter CORS errors, ensure both servers are running and accessible.
- For camera/video streams, ensure OpenCV (`opencv-python`) is installed and your device supports video capture.

---
