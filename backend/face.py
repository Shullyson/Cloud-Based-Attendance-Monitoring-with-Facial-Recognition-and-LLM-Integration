import face_recognition
import cv2
import os
import mysql.connector
from datetime import datetime, timedelta
import face_recognition
import cv2
import os
import mysql.connector
from datetime import datetime, timedelta

def connect_to_database():
    return mysql.connector.connect(
    
    )


def log_attendance(full_name, start_time, accepted_delay):
    connection = connect_to_database()
    cursor = connection.cursor()
    today = datetime.now().date()
    cursor.execute("SELECT * FROM attendance WHERE full_name = %s AND DATE(time) = %s", (full_name, today))
    result = cursor.fetchone()

    if not result:
        current_time = datetime.now()
        start_datetime = datetime.combine(today, start_time)
        delay_timedelta = timedelta(minutes=accepted_delay)  # Convert accepted delay to timedelta
        end_time_with_delay = start_datetime + delay_timedelta  # Add timedelta to start time
        delay_status = "present" if current_time <= end_time_with_delay else "late"  # Compare with current time
        cursor.execute("INSERT INTO attendance (full_name, time, delay_time) VALUES (%s, %s, %s)",
                       (full_name, current_time, delay_status))
        connection.commit()
        print(f"Attendance logged for {full_name} at {current_time} with status {delay_status}")
    else:
        print(f"Attendance already logged for {full_name} today.")

    cursor.close()
    connection.close()

def capture_and_log(start_time, accepted_delay):
    video_capture = cv2.VideoCapture(0)
    known_face_encodings = []
    known_face_names = []

    for file_name in os.listdir('Faces'):
        image_path = os.path.join('Faces', file_name)
        image = face_recognition.load_image_file(image_path)
        encoding = face_recognition.face_encodings(image)[0]
        known_face_encodings.append(encoding)
        known_face_names.append(os.path.splitext(file_name)[0])

    name = "Unknown"
    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("Failed to capture frame")
            break

        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            if True in matches:
                index = matches.index(True)
                name = known_face_names[index]
                log_attendance(name, start_time, accepted_delay)

                message = f"Attendance logged for {name}"
                cv2.putText(frame, message, (left + 6, bottom + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
                break

            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
            cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        cv2.imshow('Video', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()
if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:  
        print("Usage: python face.py <start_time> <accepted_delay>")
        sys.exit(1)

    start_time = datetime.strptime(sys.argv[1], "%H:%M").time()
    accepted_delay = int(sys.argv[2])
    capture_and_log(start_time, accepted_delay)