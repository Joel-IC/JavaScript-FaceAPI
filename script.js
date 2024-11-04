Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
	faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
	faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
	faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

const video = document.getElementById('video')
const canvas = document.getElementById('canvas')

function startVideo() {
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
			video.srcObject = stream;
			video.play();
		});
	}
}

video.addEventListener('play', () => {
	//Tamaño del canvas
	const displaySize = { width: video.width, height: video.height};
	//Igualar el canvas con el video
	faceapi.matchDimensions(canvas, displaySize);
	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
		console.log(detections);
		const resizedDetections = faceapi.resizeResults(detections, displaySize);
		canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
		faceapi.draw.drawDetections(canvas, resizedDetections);
		faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
	},500);
})