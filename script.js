const form = document.getElementById('imageForm');
const resultDiv = document.getElementById('result');
const gallery = document.getElementById('gallery');
const promptInput = document.getElementById('prompt');
const chipsContainer = document.getElementById('prompt-chips');

// Insert your Hugging Face API key below
const HUGGINGFACE_API_KEY = 'YOUR_HUGGINGFACE_API_KEY_HERE';
const API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

// Coming soon functionality
document.getElementById('signInBtn').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Sign In feature coming soon!');
});

document.querySelector('a[href="#about"]').addEventListener('click', (e) => {
    e.preventDefault();
    alert('About page coming soon!');
});

function timeAgo(date) {
    return 'just now'; // For now, always show 'just now' for new images
}

const promptSuggestions = [
    'A penguin astronaut on the moon',
    'A squirrel pirate searching for acorns',
    'A fox playing chess with a rabbit',
    'A snail racing a cheetah',
];

function renderPromptChips() {
    if (!chipsContainer) return;
    chipsContainer.innerHTML = '';
    promptSuggestions.slice(0, 7).forEach(suggestion => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'prompt-chip';
        chip.textContent = suggestion;
        chip.addEventListener('click', () => {
            promptInput.value = suggestion;
            promptInput.focus();
        });
        chipsContainer.appendChild(chip);
    });
}
renderPromptChips();

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = document.getElementById('prompt').value;
    const style = document.getElementById('style').value;
    const aspect = document.getElementById('aspect').value;

    // Compose prompt with style
    let fullPrompt = prompt;
    if (style && style !== 'Digital Art') {
        fullPrompt += `, ${style}`;
    }

    // Aspect ratio guidance (Stable Diffusion XL supports size)
    let width = 512, height = 912; // Default: Portrait (9:16)
    if (aspect === 'square') {
        width = 768; height = 768;
    } else if (aspect === 'landscape') {
        width = 912; height = 512;
    }

    // Progress bar setup (now in the form)
    let progressBarDiv = form.querySelector('.progress-container');
    if (progressBarDiv) progressBarDiv.remove();
    const progressBarHTML = `
        <div class="progress-container">
            <div class="progress-bar" id="progressBar"></div>
            <span class="progress-text" id="progressText">0%</span>
        </div>
    `;
    form.insertAdjacentHTML('beforeend', progressBarHTML);
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    let fakeProgress = 0;
    let interval = setInterval(() => {
        if (fakeProgress < 90) {
            fakeProgress += Math.random() * 2 + 1; // Increase by 1-3%
            if (fakeProgress > 90) fakeProgress = 90;
            progressBar.style.width = fakeProgress + '%';
            progressText.textContent = Math.floor(fakeProgress) + '%';
        }
    }, 120);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: fullPrompt,
                options: { wait_for_model: true },
                parameters: { width, height }
            })
        });

        clearInterval(interval);
        progressBar.style.width = '100%';
        progressText.textContent = '100%';

        const removeProgressBar = () => {
            if (progressBarDiv) progressBarDiv.remove();
            else {
                const pb = form.querySelector('.progress-container');
                if (pb) pb.remove();
            }
        };

        const showGeneratedMessage = () => {
            const progressContainer = form.querySelector('.progress-container');
            if (progressContainer) {
                progressContainer.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #a18aff; font-weight: 600; font-size: 1rem;">
                        Generated!
                    </div>
                `;
            }
        };

        if (!response.ok) {
            setTimeout(() => {
                removeProgressBar();
                resultDiv.innerHTML = `<div class="loading">Failed to generate image.</div>`;
            }, 400);
            return;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setTimeout(() => {
                showGeneratedMessage();
                setTimeout(() => {
                    removeProgressBar();
                    // Create card
                    const card = document.createElement('div');
                    card.className = 'image-card';
                    card.innerHTML = `
                        <button class="download-btn" title="Download image">
                            <svg viewBox="0 0 20 20"><path d="M10 2a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4A1 1 0 0 1 6.293 9.293L8.5 11.586V3a1 1 0 0 1 1-1zm-7 13a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z"/></svg>
                            Download
                        </button>
                        <img src="${url}" alt="Generated AI Art" />
                        <div class="card-info">
                            <div class="card-prompt">"${prompt}"</div>
                            <div class="card-meta">
                                <span class="card-time">${timeAgo(new Date())}</span>
                                <span class="card-style">${style}</span>
                            </div>
                        </div>
                    `;
                    // Download functionality
                    const downloadBtn = card.querySelector('.download-btn');
                    downloadBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'dreampixel-image.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    });
                    gallery.prepend(card);
                    // Scroll to the gallery section
                    const gallerySection = document.getElementById('gallery-section');
                    if (gallerySection) {
                        gallerySection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 800); // Show "Generated!" for 800ms
            }, 400); // Short delay for 100% effect
        } else {
            const data = await response.json();
            setTimeout(() => {
                removeProgressBar();
                resultDiv.innerHTML = `<div class="loading">${data.error || 'Failed to generate image.'}</div>`;
            }, 400);
        }
    } catch (err) {
        clearInterval(interval);
        setTimeout(() => {
            const pb = form.querySelector('.progress-container');
            if (pb) pb.remove();
            resultDiv.innerHTML = `<div class="loading">${err.message}</div>`;
        }, 400);
    }
}); 