document.addEventListener('DOMContentLoaded', async () => {
    // Select the video element where the webcam feed will be displayed
    const video = document.getElementById('webcam');
    // Select the canvas element where hand landmarks will be drawn
    const canvas = document.getElementById('overlay');
    // Get the 2D drawing context for the canvas
    const context = canvas.getContext('2d');

    // Try to access the user's webcam
    try {
        // Request access to the webcam video stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Set the source of the video element to the webcam stream
        video.srcObject = stream;
    } catch (error) {
        // Log an error message if access to the webcam is denied
        console.error('Error accessing webcam:', error);
        return;
    }

    // Load the Handpose model for hand tracking
    let model;
    try {
        model = await handpose.load();
        // Log a message when the Handpose model is successfully loaded
        console.log('Handpose model loaded');
    } catch (error) {
        console.error('Error loading Handpose model:', error);
        return;
    }

    // Define colors for each finger
    const fingerColors = {
        thumb: 'red',
        indexFinger: 'green',
        middleFinger: 'blue',
        ringFinger: 'purple',
        pinky: 'orange'
    };

    // Function to draw landmarks and connections with improved styling
    const drawLandmarks = (landmarks) => {
        context.beginPath();
        context.lineWidth = 4;

        // Define connections for each finger
        const fingers = {
            thumb: [0, 1, 2, 3, 4],
            indexFinger: [0, 5, 6, 7, 8],
            middleFinger: [0, 9, 10, 11, 12],
            ringFinger: [0, 13, 14, 15, 16],
            pinky: [0, 17, 18, 19, 20]
        };

        // Draw connections and landmarks for each finger with different colors
        for (let finger in fingers) {
            context.strokeStyle = fingerColors[finger];
            const points = fingers[finger];
            for (let i = 0; i < points.length - 1; i++) {
                const start = landmarks[points[i]];
                const end = landmarks[points[i + 1]];
                context.moveTo(start[0], start[1]);
                context.lineTo(end[0], end[1]);
                context.stroke();
            }
        }

        // Draw each landmark point with a circle
        landmarks.forEach((landmark, index) => {
            context.beginPath();
            context.arc(landmark[0], landmark[1], 6, 0, 2 * Math.PI);
            context.fillStyle = 'white';
            context.fill();
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.stroke();
        });
    };

    // Function to detect hands and draw landmarks on the canvas
    const detectHands = async () => {
        // Use the Handpose model to estimate hands in the video feed
        const predictions = await model.estimateHands(video);
        // Clear the canvas before drawing new landmarks
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Check if any hands are detected
        if (predictions.length > 0) {
            // Iterate over each detected hand
            predictions.forEach(prediction => {
                // Get the landmarks (keypoints) of the detected hand
                const landmarks = prediction.landmarks;
                // Draw the landmarks and connections with improved styling
                drawLandmarks(landmarks);
            });
        }

        // Request the next animation frame to continue detecting hands
        requestAnimationFrame(detectHands);
    };

    // Start hand detection when the video data is loaded
    video.addEventListener('loadeddata', detectHands);
});