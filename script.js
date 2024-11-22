const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const revealedPixelsCounter = document.getElementById('revealedPixels');

let revealedPixels = 0;
let pixelsPerClick = 1; // Start with revealing 1 pixel per click
let clickCount = 0; // Count total clicks
const revealedSet = new Set(); // Keep track of revealed pixel indices
const image = new Image();
image.src = 'down-the-rabbit-hole.jpg'; // Ensure the path to the image is correct

image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;

    // Center the canvas
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    // Draw the image to the canvas first
    ctx.drawImage(image, 0, 0);

    // Overlay with a black mask
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// Attach event listener to the entire <body> element
document.body.addEventListener('click', () => {
    const totalPixels = canvas.width * canvas.height;

    if (revealedPixels >= totalPixels) return;

    // Increment click count
    clickCount++;

    // Every 20 clicks, double the number of pixels revealed per click
    if (clickCount % 20 === 0) {
        pixelsPerClick = Math.min(pixelsPerClick * 2, totalPixels - revealedPixels);
    }

    // Reveal the specified number of pixels per click
    for (let i = 0; i < pixelsPerClick; i++) {
        if (revealedPixels >= totalPixels) break;

        // Generate a unique random pixel position
        let pixelIndex;
        do {
            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);
            pixelIndex = y * canvas.width + x;
            if (!revealedSet.has(pixelIndex)) {
                revealedSet.add(pixelIndex); // Mark pixel as revealed
                ctx.drawImage(image, x, y, 1, 1, x, y, 1, 1);
                revealedPixels++;
                break;
            }
        } while (true);
    }

    // Update the revealed pixel count
    revealedPixelsCounter.textContent = revealedPixels;

    // Show the artist reference when the image is fully revealed
    if (revealedPixels === totalPixels) {
        showArtistReference();
    }
});

// Developer hack: Reveal the entire image when the ` key is pressed
document.addEventListener('keydown', (event) => {
    if (event.key === '`') {
        revealAll();
    }
});

function revealAll() {
    const totalPixels = canvas.width * canvas.height;

    // Reveal all pixels
    ctx.drawImage(image, 0, 0);
    revealedPixels = totalPixels;
    revealedPixelsCounter.textContent = revealedPixels;

    // Show the artist reference
    showArtistReference();
}

function showArtistReference() {
    const reference = document.createElement('div');
    reference.id = 'artistReference';
    reference.innerHTML = `
        <p><strong>Down the Rabbit Hole</strong></p>
        <p>By La-Chapeliere-Folle</p>
        <p>Published: Apr 11, 2015</p>
        <a href="https://www.deviantart.com/la-chapeliere-folle/art/Down-the-Rabbit-Hole-526312155" target="_blank">View on DeviantArt</a>
    `;
    document.body.appendChild(reference);

    // Add fade-in animation
    setTimeout(() => {
        reference.style.opacity = 1;
    }, 100);
}
