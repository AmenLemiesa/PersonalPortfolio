document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('overlay');
    const context = canvas.getContext('2d');

    // Access the webcam
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing webcam:', error);
        return;
    }

    // Load the Handpose model
    const model = await handpose.load();
    console.log('Handpose model loaded');

    // Function to detect hand poses
    const detectHands = async () => {
        const predictions = await model.estimateHands(video);
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        if (predictions.length > 0) {
            predictions.forEach(prediction => {
                const landmarks = prediction.landmarks;
                context.beginPath();
                context.lineWidth = 2;
                context.strokeStyle = 'red';

                // Draw each point
                landmarks.forEach(landmark => {
                    context.arc(landmark[0], landmark[1], 5, 0, 2 * Math.PI);
                    context.fillStyle = 'red';
                    context.fill();
                });

                // Draw lines between the points
                const connections = [
                    [0, 1], [1, 2], [2, 3], [3, 4],  // Thumb
                    [0, 5], [5, 6], [6, 7], [7, 8],  // Index finger
                    [0, 9], [9, 10], [10, 11], [11, 12],  // Middle finger
                    [0, 13], [13, 14], [14, 15], [15, 16],  // Ring finger
                    [0, 17], [17, 18], [18, 19], [19, 20]  // Pinky finger
                ];
                connections.forEach(([start, end]) => {
                    context.moveTo(landmarks[start][0], landmarks[start][1]);
                    context.lineTo(landmarks[end][0], landmarks[end][1]);
                    context.stroke();
                });
            });
        }

        requestAnimationFrame(detectHands);
    };

    video.addEventListener('loadeddata', detectHands);
});
