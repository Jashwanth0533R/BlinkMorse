import cv2
import dlib
import joblib
import numpy as np
from imutils import face_utils

# Load the trained model
model = joblib.load(r'C:\Users\Lenovo\OneDrive\Desktop\BlinkMorse\final\models\blink_classifier_model.pkl')


# Constants
IMG_SIZE = 64
BLINK_COUNTER = 0
BLINKS = []

# Initialize dlib
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(r'C:\Users\Lenovo\OneDrive\Desktop\BlinkMorse\final\models\shape_predictor_68_face_landmarks.dat')  # Download this file if not present

# Eye landmark points
LEFT_EYE_POINTS = list(range(36, 42))
RIGHT_EYE_POINTS = list(range(42, 48))

# Helper function to extract eye region and predict
def get_eye_prediction(gray, eye_points):
    (x, y, w, h) = cv2.boundingRect(np.array(eye_points))
    eye = gray[y:y+h, x:x+w]
    eye = cv2.resize(eye, (IMG_SIZE, IMG_SIZE)).flatten().reshape(1, -1)
    prediction = model.predict(eye)[0]
    return prediction

# Start webcam
cap = cv2.VideoCapture(0)

print("Starting real-time blink detection...")
while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)

    for face in faces:
        shape = predictor(gray, face)
        shape_np = face_utils.shape_to_np(shape)

        left_eye = shape_np[LEFT_EYE_POINTS]
        right_eye = shape_np[RIGHT_EYE_POINTS]

        left_pred = get_eye_prediction(gray, left_eye)
        right_pred = get_eye_prediction(gray, right_eye)

        # If both eyes are closed (predicted as 0)
        if left_pred == 0 and right_pred == 0:
            BLINK_COUNTER += 1
        else:
            if BLINK_COUNTER > 2:  # To avoid false blink
                BLINKS.append('blink')
                print("Blink detected")
            BLINK_COUNTER = 0

        # Draw eyes
        cv2.polylines(frame, [left_eye], True, (0,255,0), 1)
        cv2.polylines(frame, [right_eye], True, (0,255,0), 1)

    cv2.imshow("Blink Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
