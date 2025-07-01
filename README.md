# DreamPixel

DreamPixel is a modern web app that lets you generate stunning AI images from text prompts using the Stable Diffusion XL model via the Hugging Face API. Enter your creative prompt, select a style and aspect ratio, and watch your ideas come to life!

## Features
- Generate AI images from text prompts (Stable Diffusion XL)
- Choose style and aspect ratio
- Animated progress bar with completion feedback
- Gallery of generated images (latest first)
- Download images directly from the gallery
- Fun prompt suggestions as clickable chips
- Responsive, modern UI

## Setup & Usage

1. **Clone or Download this Repository**
2. **Get a Hugging Face API Key**
   - Sign up at [huggingface.co](https://huggingface.co/)
   - Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens) and create a new token (select "Read" permissions) and copy it
3. **Configure the API Key**
   - Open `script.js`
   - Replace `'YOUR_HUGGINGFACE_API_KEY_HERE'` with your actual Hugging Face API key
4. **Run the App**
   - Open `index.html` in your browser
   - Enter a prompt, select style/aspect, and click "Generate Image"
   - Download or view your generated images in the gallery

## How It Works

1. **User Flow:**
   - Enter a creative prompt in the text box (or click a suggestion chip).
   - Select your desired style and aspect ratio.
   - Click "Generate Image".
   - An animated progress bar shows generation status.
   - When complete, the image appears in the gallery below the form, with your prompt and style.
   - Hover over an image to download it.

2. **Technical Flow:**
   - The app sends your prompt and settings to the Hugging Face Inference API (Stable Diffusion XL).
   - The API generates an image and returns it as a file.
   - The frontend displays the image and adds it to the gallery.

## Troubleshooting

- **No Image Generated / Error Message:**
  - Make sure your Hugging Face API key is correct and has access to the Stable Diffusion XL model.
  - Check your internet connection.
  - The Hugging Face API may be busy or rate-limited; try again after a few minutes.

- **Progress Bar Stuck or No Response:**
  - Refresh the page and try again.
  - Ensure your API key is valid and not expired.

- **Images Not Downloading:**
  - Some browsers may block downloads from local files. Try using Chrome or Edge, or deploy the app to a web server.


## File Structure
- `index.html` — Main HTML structure
- `styles.css` — App styling
- `script.js` — App logic and API integration
- `README.md` — This file

## Credits
- **AI Model:** [Stable Diffusion XL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) via Hugging Face Inference API
- **Frontend:** HTML, CSS, JavaScript


---

**DreamPixel** — Unleash your imagination with AI art! 