const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const switchCameraBtn = document.getElementById('switch-camera');
const photoPreview = document.getElementById('photo-preview');
const previewContainer = document.getElementById('preview-container');
const saveBtn = document.getElementById('save-btn');
const retryBtn = document.getElementById('retry-btn');
const instructions = document.getElementById('instructions');

let usingFrontCamera = true;
let stream;

async function startCamera() {
    if (stream) stream.getTracks().forEach(track => track.stop());

    const constraints = {
        video: {
            facingMode: usingFrontCamera ? 'user' : 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        },
        audio: false
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    video.style.transform = usingFrontCamera ? 'scaleX(-1)' : 'scaleX(1)';
}

switchCameraBtn.onclick = () => {
    usingFrontCamera = !usingFrontCamera;
    startCamera();
};

// CAPTURAR FOTO
captureBtn.onclick = () => {
    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();

    const width = settings.width;
    const height = settings.height;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    // inverter se for frontal
    if (usingFrontCamera) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    // reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // desenha moldura
    ctx.drawImage(overlay, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/png');

    photoPreview.src = dataUrl;
    previewContainer.style.display = "flex";
};

// SALVAR FOTO
saveBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = "foto-moldura.png";
    link.href = photoPreview.src;
    link.click();

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        instructions.style.display = 'block';
    }
};

// TIRAR OUTRA
retryBtn.onclick = () => {
    previewContainer.style.display = "none";
    instructions.style.display = "none";
};

startCamera();
