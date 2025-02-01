class SignaturePad {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.points = [];
        this.lastPoint = null;
        this.isDrawing = false;
        
        // Configure options
        this.options = {
            penColor: options.penColor || '#000000',
            penWidth: options.penWidth || 2,
            backgroundColor: options.backgroundColor || 'rgba(0,0,0,0)'
        };

        // Set up canvas
        this.resizeCanvas();
        this.clearCanvas();

        // Bind events
        this.bindEvents();
    }

    bindEvents() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Handle resize
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        this.canvas.width = this.canvas.offsetWidth * ratio;
        this.canvas.height = this.canvas.offsetHeight * ratio;
        this.ctx.scale(ratio, ratio);
        this.clearCanvas();
    }

    clearCanvas() {
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.points = [];
        this.lastPoint = null;
        this.isDrawing = false;
    }

    handleMouseDown(event) {
        event.preventDefault();
        this.isDrawing = true;
        this.lastPoint = this.getPoint(event);
    }

    handleMouseMove(event) {
        if (!this.isDrawing) return;
        event.preventDefault();
        const currentPoint = this.getPoint(event);
        this.drawLine(this.lastPoint, currentPoint);
        this.lastPoint = currentPoint;
    }

    handleMouseUp() {
        this.isDrawing = false;
    }

    handleTouchStart(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            this.isDrawing = true;
            this.lastPoint = this.getPoint(event.touches[0]);
        }
    }

    handleTouchMove(event) {
        if (!this.isDrawing) return;
        event.preventDefault();
        const currentPoint = this.getPoint(event.touches[0]);
        this.drawLine(this.lastPoint, currentPoint);
        this.lastPoint = currentPoint;
    }

    handleTouchEnd(event) {
        event.preventDefault();
        this.isDrawing = false;
    }

    getPoint(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    drawLine(start, end) {
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.strokeStyle = this.options.penColor;
        this.ctx.lineWidth = this.options.penWidth;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        this.ctx.closePath();
    }

    isEmpty() {
        const imageData = this.ctx.getImageData(
            0, 0, this.canvas.width, this.canvas.height
        ).data;
        return !imageData.some(channel => channel !== 0);
    }

    toDataURL() {
        return this.canvas.toDataURL('image/png');
    }
}

// Initialize the signature pad
const canvas = document.getElementById('signaturePad');
const signaturePad = new SignaturePad(canvas, {
    penColor: '#000000',
    penWidth: 2,
    backgroundColor: '#ffffff'
});

// User information
const username = 'Mohd Rihan';
const currentDateTime = '2025-02-01 16:23:36';

// Display user info
document.getElementById('userInfo').textContent = `By: ${username}`;
document.getElementById('dateInfo').textContent = `Date: ${currentDateTime}`;

// Status message handler
function showStatus(message, isError = false) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${isError ? 'error' : 'success'}`;
    status.style.display = 'block';
    setTimeout(() => status.style.display = 'none', 3000);
}

// Save button handler
document.getElementById('saveButton').addEventListener('click', () => {
    if (signaturePad.isEmpty()) {
        showStatus('Please provide a signature', true);
        return;
    }

    try {
        const dataUrl = signaturePad.toDataURL();
        const formattedDateTime = currentDateTime.replace(/[: ]/g, '-');
        const filename = `signature_${username}_${formattedDateTime}.png`;

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showStatus('Signature saved successfully!');
    } catch (error) {
        console.error('Error saving signature:', error);
        showStatus('Failed to save signature', true);
    }
});

// Clear button handler
document.getElementById('clearButton').addEventListener('click', () => {
    signaturePad.clearCanvas();
    showStatus('Signature cleared');
});