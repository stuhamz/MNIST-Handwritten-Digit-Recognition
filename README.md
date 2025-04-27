# 🔢 MNIST Handwritten Digit Recognition

![MNIST Handwritten Digit Recognition Logo](your-logo-url-here)

---

## Overview
**MNIST Handwritten Digit Recognition** is an AI-powered web application that allows users to draw digits (0-9) on a canvas and instantly predict the digit using a trained machine learning model. Built with **Next.js**, **React**, and **TailwindCSS**, this application offers a responsive, intuitive interface that bridges AI and interactive user experience.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Workflow](#workflow)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [File Structure](#file-structure)
- [Modules and Components](#modules-and-components)
- [API Endpoints](#api-endpoints)
- [Styling](#styling)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Features
- **Draw and Predict:** Draw digits on a canvas and get real-time predictions.
- **Clear Canvas:** Reset the canvas easily to draw a new digit.
- **Confidence Level:** View the prediction confidence level.
- **MNIST Dataset Examples:** Displays random samples for reference.
- **Responsive Design:** Works across mobile, tablet, and desktop devices.

---

## 🛏️ Architecture
The architecture comprises:
- **Frontend:** Next.js & React app for UI and canvas interactions.
- **Backend:** API route processes the drawn digit and sends it to the ML model.
- **ML Model:** Pre-trained MNIST model predicts the drawn digit.


---

## 🔥 Workflow
1. **User draws a digit** on the canvas.
2. **Canvas image** is captured and sent to the backend.
3. **Backend** forwards the image to the **trained ML model**.
4. **Model prediction** is returned and displayed to the user.

---

## 💻 Technologies Used
- **Next.js** — React Framework for server-side rendering.
- **React.js** — Dynamic UI management.
- **TailwindCSS** — Fast, utility-first styling.
- **Fetch API** — HTTP requests to backend prediction service.

---

## 🛠️ Getting Started

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/stuhamz/MNIST-Handwritten-Digit-Recognition.git
cd MNIST-Handwritten-Digit-Recognition
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Access the App**
Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 File Structure
```
/MNIST-Handwritten-Digit-Recognition
├── .gitignore
├── README.md
├── jsconfig.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── src/
    ├── api/
    │   └── predict-digit/route.js
    ├── app/
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.jsx
    ├── middleware.js
    └── utilities/runtime-helpers.js
```

---

## 📂 Modules and Components

### 1. API Routes
- **`src/api/predict-digit/route.js`**: Accepts canvas image, sends to ML model, returns prediction.

### 2. Pages
- **`src/app/page.jsx`**: Main interface — drawing canvas, predict button, clear button, prediction result.
- **`src/app/layout.js`**: Application layout and global styles.
- **`src/app/globals.css`**: Global TailwindCSS-based styling.

### 3. Utilities
- **`src/utilities/runtime-helpers.js`**: Helper functions for streaming responses and file uploads.

### 4. Middleware
- **`src/middleware.js`**: Adds secure headers for API interactions.

---

## 🔢 API Endpoints
- **POST `/api/predict-digit`**: Accepts canvas image and returns predicted digit with confidence score.

---

## 🖌️ Styling
- **TailwindCSS** ensures fast and responsive design.
- **globals.css** contains basic reset and core styles.
- Responsive behavior on all screen sizes.

---

## 🤝 Contributing
Contributions are warmly welcomed! 🌟

- Fork the repository.
- Create a feature branch (`git checkout -b feature/YourFeature`).
- Commit your changes (`git commit -m 'Add some feature'`).
- Push to your branch (`git push origin feature/YourFeature`).
- Open a pull request.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---
