# PC Builder AI Image Generation Setup Guide

## Overview
This guide explains how to set up AI image generation for your PC Builder feature, allowing users to generate images of their PC builds automatically.

## Implementation Summary

### Files Created/Modified:
1. **`build pc/index.html`** - Interactive PC builder interface
2. **`build pc/pc-builder.js`** - JavaScript logic for part selection and image generation

## API Options for Image Generation

### Option 1: Together AI (Recommended for Free Tier)
**Free tier:** Up to 100 images/month
- Register: https://www.together.ai/
- Get API key from dashboard
- Best for: Production use with reasonable limits

### Option 2: Hugging Face API
**Free tier:** Limited requests
- Register: https://huggingface.co/
- Get token from settings
- Uses: Stable Diffusion models

### Option 3: Self-Hosted (LocalAI/Ollama)
**Cost:** Free (host yourself)
- Run locally on your server
- Best for: Full control, no API costs
- Models: FLUX.1, Stable Diffusion, etc.

### Option 4: OpenAI DALL-E
**Paid:** $0.04-$0.12 per image
- Most reliable quality
- Good for: Production sites with budget

## Setup Instructions

### Step 1: Configure API Key

Edit `build pc/pc-builder.js` line 7:
```javascript
this.apiKey = 'your_api_key_here'; // Replace with your actual key
```

### Step 2: Choose Your API Provider

Uncomment one of the generation methods in the `generateImage()` function:

**Together AI:**
```javascript
const imageUrl = await this.generateWithTogetherAI(prompt);
```

**Hugging Face:**
```javascript
const imageUrl = await this.generateWithHuggingFace(prompt);
```

**Local API:**
```javascript
const imageUrl = await this.generateWithLocalAPI(prompt);
```

### Step 3: Update CORS Settings

If using external APIs, add CORS headers to your server or use a CORS proxy:

```javascript
// In pc-builder.js, add this to fetch requests:
'Content-Type': 'application/json',
'Access-Control-Allow-Origin': '*'
```

## How It Works

### User Flow:
1. User selects PC components (CPU, GPU, RAM, etc.)
2. Build specifications are displayed in real-time
3. When 3+ components are selected, "Generate AI Image" button enables
4. User clicks button → AI generates image based on specs
5. Generated image displayed with download option

### Specifications Used in Prompt:
```
"CPU: [selected], GPU: [selected], RAM: [selected], Storage: [selected], 
PSU: [selected], Case: [selected], Cooler: [selected]"
```

## Features

✅ Interactive component selection
✅ Real-time price calculation
✅ Local storage (builds persist on refresh)
✅ AI image generation with specs
✅ Download generated images
✅ Responsive design
✅ Remove/modify selections
✅ Clear entire build

## Frontend Features

- **Part Selection**: Click any component to add to build
- **Real-Time Updates**: Specs and price update instantly
- **Save/Load**: Builds automatically saved to localStorage
- **Image Generation**: Click "Generate AI Image" to create visual
- **Download**: Save generated images to device

## Error Handling

The system handles:
- Missing API keys → Error message displayed
- Network failures → User-friendly error notification
- API rate limits → Graceful error handling
- Invalid responses → Retry capability

## Performance Tips

1. Cache generated images to reduce API calls
2. Throttle generation requests (not more than 1 per 10 seconds)
3. Use smaller image sizes (768x768) for faster generation
4. Implement queueing for multiple requests

## Next Steps

1. Choose an API provider
2. Get API credentials
3. Replace `this.apiKey = ''` with your actual key
4. Test by selecting components and clicking "Generate AI Image"
5. Monitor API usage/costs

## Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Image not generating | Check API key and internet connection |
| CORS errors | Enable CORS in API settings or use proxy |
| API timeout | Check API status page, retry in a moment |
| Slow generation | Normal (takes 10-30 seconds), show loading state |

## Cost Estimate

| Provider | Cost | Monthly Limit (Free) |
|----------|------|---------------------|
| Together AI | $0 | 100 images |
| Hugging Face | $0 | Variable |
| LocalAI | $0 | Unlimited |
| DALL-E | $0.04-0.12 | Pay per use |

---

**Need help?** Check the API provider's documentation or modify the code to use your preferred service.
