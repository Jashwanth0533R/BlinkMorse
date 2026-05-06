# 👁️ Eye Blink Morse Code Translator

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![OpenCV](https://img.shields.io/badge/OpenCV-Computer%20Vision-green?logo=opencv)
![Machine Learning](https://img.shields.io/badge/Machine-Learning-orange)
![Dlib](https://img.shields.io/badge/Dlib-Facial%20Landmarks-red)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-yellow?logo=scikitlearn)
![Status](https://img.shields.io/badge/Status-Completed-success)
![License](https://img.shields.io/badge/License-Academic-lightgrey)

---

## 📌 Project Overview

This project presents an AI-powered Eye Blink Morse Code Translator system that enables hands-free communication using eye blinks detected through a webcam.

The system uses:

- Computer Vision
- Facial Landmark Detection
- Machine Learning
- Real-Time Blink Detection
- Morse Code Translation

The application detects eye blinks in real time, classifies them using a trained Machine Learning model, and converts blink sequences into Morse code patterns and readable text.

This project is designed for accessibility-focused communication systems and Human-Computer Interaction applications.

---

## 🚀 Key Features

- 👁️ Real-Time Eye Blink Detection
- 🤖 Machine Learning-Based Blink Classification
- 📷 Webcam-Based Face Tracking
- 🧠 Morse Code Translation
- 🔍 Facial Landmark Detection using Dlib
- ⚡ Real-Time Prediction System
- 🖥️ OpenCV Visualization
- ♿ Accessibility-Oriented Communication System

---

## 🧠 Machine Learning Model

### Algorithm Used
- Support Vector Machine (SVM)

### Libraries Used
- Scikit-learn
- NumPy
- OpenCV
- Dlib

### Model Files
- `blink_classifier_model.pkl`
- `shape_predictor_68_face_landmarks.dat`

---

## 🔎 System Workflow

1. Webcam captures live video stream
2. Face detection is performed using Dlib
3. Eye landmarks are extracted
4. Eye regions are processed and resized
5. Machine Learning model predicts eye state
6. Blink sequences are detected
7. Morse code patterns are generated
8. Morse sequences are converted into readable text

---

## 🏗️ Technology Stack

### Programming Language
- Python 3.12

### Computer Vision
- OpenCV
- Dlib

### Machine Learning
- Scikit-learn
- NumPy
- Joblib

### Backend Logic
- Python

### Tools
- VS Code
- GitHub

---

## 📂 Project Structure

```bash
BlinkMorse/
│
├── main.py
├── train_model.py
├── requirements.txt
├── README.md
│
├── models/
│   ├── blink_classifier_model.pkl
│   └── shape_predictor_68_face_landmarks.dat
│
├── dataset/
│   ├── open_eyes/
│   └── closed_eyes/
│
├── static/
│
└── outputs/
```

---

## 📥 Dataset Information

The dataset used for training the blink detection model is **not included** in this repository due to repository size limitations.

Users need to create their own dataset for training.

### Required Dataset Structure

```bash
dataset/
│
├── open_eyes/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
│
└── closed_eyes/
    ├── image1.jpg
    ├── image2.jpg
    └── ...
```

### Dataset Requirements

- Webcam eye images
- Open eye samples
- Closed eye samples
- Grayscale preferred
- Consistent image size recommended

---

## 📥 Required Model Files

This project requires the following model files:

### 1️⃣ Dlib Facial Landmark Model

Download:

```text
http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2
```

Extract and place:

```bash
models/shape_predictor_68_face_landmarks.dat
```

---

### 2️⃣ Blink Classification Model

Train your own model using:

```bash
train_model.py
```

Generated model:

```bash
models/blink_classifier_model.pkl
```

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Jashwanth0533R/BlinkMorse.git

cd BlinkMorse
```

---

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

Activate Environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4️⃣ Run Application

```bash
python main.py
```

---

## ▶️ Expected Output

- Webcam window opens
- Face gets detected
- Eye landmarks are tracked
- Blink detection runs in real time
- Morse code patterns are generated

Press:

```text
q
```

to quit the application.

---

## 🔐 Model Training

To train the blink detection model:

```bash
python train_model.py
```

The trained model will be saved as:

```bash
models/blink_classifier_model.pkl
```

---

## 📊 Future Enhancements

- Deep Learning-Based Blink Detection
- LSTM-Based Morse Sequence Recognition
- Speech Output System
- Sentence Prediction
- Mobile Application Integration
- Voice Assistant Integration
- Eye Gesture Commands
- Real-Time Text-to-Speech

---

## 💡 Learning Outcomes

Through this project, I gained practical experience in:

- Computer Vision
- Facial Landmark Detection
- Machine Learning Model Training
- Real-Time Video Processing
- Human-Computer Interaction
- Accessibility-Based AI Systems
- OpenCV Applications

---

## 👨‍💻 Author

### Jashwanth Kumar Gutta

AI & ML Student | Machine Learning Enthusiast | Backend Developer

📧 Email:  
gjashwanthkumar711@gmail.com

🔗 GitHub:  
https://github.com/Jashwanth0533R

🔗 LinkedIn:  
https://www.linkedin.com/in/jashwanth-kumar-g-431477383/

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

## 📜 License

Developed for educational and academic purposes only.
