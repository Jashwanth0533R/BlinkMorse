# 👁️ BlinkMorse – Eye Blink Morse Code Translator

<p align="center">

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![OpenCV](https://img.shields.io/badge/OpenCV-Computer%20Vision-green?logo=opencv)
![MediaPipe](https://img.shields.io/badge/MediaPipe-FaceMesh-orange)
![Dlib](https://img.shields.io/badge/Dlib-Facial%20Landmarks-red)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-SVM-yellow?logo=scikitlearn)
![Status](https://img.shields.io/badge/Status-Completed-success)

</p>

---

# 🌐 Live Demo

### Product Showcase Website

### https://blink-morse-sage.vercel.app/

Experience BlinkMorse through an interactive product showcase featuring:

* MediaPipe FaceMesh powered blink visualization
* Live Blink Testing
* Morse Code Simulator
* Speech Synthesis
* Animated Workflow Timeline
* Interactive Model Metrics Dashboard
* Apple-inspired cinematic transitions

---

# 📌 Project Overview

BlinkMorse is an accessibility-focused Human Computer Interaction system that enables hands-free communication using eye blinks.

The project combines Computer Vision, Machine Learning and Morse Code translation to transform voluntary eye movements into meaningful text.

BlinkMorse aims to provide an alternative communication mechanism for individuals affected by:

* ALS
* Locked-in Syndrome
* Speech Disorders
* Post-Surgery Recovery
* Temporary Speech Loss
* Motor Disabilities

---

# 🚀 Key Features

### 👁️ Eye Blink Detection

Real-time blink detection using facial landmarks and eye state classification.

### 🤖 Machine Learning Classification

Support Vector Machine based binary eye-state classifier.

### 🔤 Morse Translation

Converts blink sequences into Morse symbols and readable text.

### 🧠 Interactive Browser Demonstration

MediaPipe powered browser-based blink testing system.

### 🔊 Speech Synthesis

Web Speech API support for reading translated messages aloud.

### 📊 Intelligence Dashboard

Animated gauges displaying evaluated machine learning metrics.

---

# 🧠 Model Performance

| Metric    | Value      |
| --------- | ---------- |
| Accuracy  | **97.67%** |
| Precision | **97.27%** |
| Recall    | **98.89%** |
| F1 Score  | **98.07%** |
| ROC–AUC   | **0.9991** |

### Evaluation Dataset

Test Samples

600

Closed Eye Samples

240

Open Eye Samples

360

Confusion Matrix

```text
[[230 10]

 [ 4 356]]
```

---

# 🔎 System Workflow

1. Webcam captures video stream

2. Face detection performed using Dlib

3. Eye landmarks extracted

4. Eye regions resized to 64×64 grayscale images

5. Linear SVM predicts eye state

6. Blink duration analysed

7. Morse symbols generated

8. Morse sequence translated into text

9. Speech synthesis outputs decoded message

---

# 🏗️ Technology Stack

## Research Stack

* Python 3.12

* OpenCV

* Dlib

* NumPy

* Linear SVM

* Joblib

* Pickle

* VS Code

## Interactive Demo Stack

* MediaPipe FaceMesh

* JavaScript

* GSAP

* Lenis

* Web Speech API

---

# 📂 Project Structure

```bash
BlinkMorse/

├── dataset/

├── demo_website/

│ ├── index.html

│ ├── styles.css

│ ├── app.js

│ └── assets/


├── models/

│ ├── blink_classifier_model.pkl

│ ├── shape_predictor_68_face_landmarks.dat

│ ├── X_train.npy

│ ├── X_test.npy

│ ├── y_train.npy

│ └── y_test.npy


├── scripts/

│ ├── blink_detection.py

│ ├── dataset_preperation.py

│ ├── morse_translator.py

│ └── train_model.py


└── README.md

```

---

# 🌱 Future Scope

* Deep Learning based Blink Classification

* User-specific calibration

* Predictive text generation

* Sentence completion

* Bluetooth communication

* Multimodal interaction

* Mobile companion application

---

# 👨‍💻 Author

### Jashwanth Kumar G

Artificial Intelligence & Machine Learning Engineer

📧 [gjashwanthkumar711@gmail.com](mailto:gjashwanthkumar711@gmail.com)

🔗 GitHub

https://github.com/Jashwanth0533R

🔗 LinkedIn

https://www.linkedin.com/in/jashwanth-kumar-g-431477383/

---

# ⭐ Support

If you found BlinkMorse useful,

please consider giving the repository a ⭐ on GitHub.

---

# 📜 License

Developed for academic and educational purposes.

© 2026 Jashwanth Kumar G
