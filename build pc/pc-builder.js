// PC Builder AI Image Generation - Works with existing component selector
document.addEventListener('DOMContentLoaded', () => {
    // Find the summary card and add AI image generation button
    const summaryCard = document.querySelector('.summary-card');
    if (!summaryCard) return;

    // Create button container
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '10px';
    btnContainer.style.marginTop = '10px';

    // Create AI image button
    const generateBtn = document.createElement('button');
    generateBtn.id = 'generateAIImageBtn';
    generateBtn.className = 'add-to-cart-btn';
    generateBtn.innerHTML = '🤖 Generate AI Image';
    generateBtn.disabled = true;
    generateBtn.style.flex = '1';
    generateBtn.style.background = 'linear-gradient(135deg, #059669, #047857)';

    // Create image container
    let imageContainer = null;

    generateBtn.addEventListener('click', async () => {
        if (!imageContainer) {
            imageContainer = document.createElement('div');
            imageContainer.style.marginTop = '20px';
            summaryCard.appendChild(imageContainer);
        }

        const selectedCards = document.querySelectorAll('.component-card.selected');
        if (selectedCards.length < 3) {
            imageContainer.innerHTML = '<div style="color:#ef4444; background:#ffe0e0; padding:15px; border-radius:10px; text-align:center;">⚠️ Select at least 3 components</div>';
            return;
        }

        // Build spec text
        const specs = Array.from(selectedCards)
            .map(card => card.dataset.name)
            .join(', ');

        const prompt = `A high-performance gaming PC build featuring: ${specs}. Professional studio photography, detailed, realistic lighting, complete PC system, front three-quarter angle, clean background.`;

        imageContainer.innerHTML = '<div style="text-align:center; padding:20px; color:#1787ff; font-weight:600;">🔄 Generating AI image... (10-30 seconds)</div>';
        generateBtn.disabled = true;

        try {
            const apiKey = 'your_api_key_here'; // User must replace this
            
            if (apiKey === 'your_api_key_here') {
                throw new Error('❌ API key not set. Edit pc-builder.js and replace "your_api_key_here" with your Together AI key from https://together.ai');
            }

            const response = await fetch('https://api.together.xyz/inference', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'black-forest-labs/FLUX.1-pro',
                    prompt: prompt,
                    image_size: '768x768',
                    steps: 25,
                    seed: Math.floor(Math.random() * 1000000)
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API Error');
            }

            const data = await response.json();
            const imageUrl = data.output?.choices?.[0]?.image_url || data.data?.[0];

            if (imageUrl) {
                imageContainer.innerHTML = `
                    <div style="text-align:center;">
                        <img src="${imageUrl}" alt="Generated PC" style="width:100%; border-radius:12px; margin-bottom:15px; box-shadow:0 8px 20px rgba(0,0,0,0.15);">
                        <a href="${imageUrl}" download="pc-build.png" class="add-to-cart-btn" style="display:inline-block; background:#0b57d0; padding:12px 20px; text-decoration:none; width:auto; margin-top:0;">
                            ⬇️ Download Image
                        </a>
                    </div>
                `;
            }
        } catch (error) {
            imageContainer.innerHTML = `<div style="color:#ef4444; background:#ffe0e0; padding:15px; border-radius:10px; text-align:center; font-weight:600;">${error.message}</div>`;
        } finally {
            generateBtn.disabled = false;
        }
    });

    // Insert button after compatibility warning
    const compatWarning = document.getElementById('compatibilityWarning');
    if (compatWarning) {
        compatWarning.parentNode.insertBefore(generateBtn, compatWarning.nextSibling);
    } else {
        summaryCard.appendChild(generateBtn);
    }

    // Monitor component selection to enable/disable button
    const checkSelection = () => {
        const selectedCount = document.querySelectorAll('.component-card.selected').length;
        generateBtn.disabled = selectedCount < 3;
        generateBtn.textContent = selectedCount < 3 
            ? `🤖 Generate AI Image (${3 - selectedCount} more)`
            : '🤖 Generate AI Image';
    };

    // Check on page load
    checkSelection();

    // Monitor for changes
    document.querySelectorAll('.component-grid').forEach(grid => {
        grid.querySelectorAll('.component-card').forEach(card => {
            const originalClick = card.onclick;
            card.addEventListener('click', () => {
                setTimeout(checkSelection, 10);
            });
        });
    });

    // Also observe the add to cart button changes
    const observer = new MutationObserver(() => {
        checkSelection();
    });
    
    const selectedItems = document.getElementById('selectedItems');
    if (selectedItems) {
        observer.observe(selectedItems, { childList: true, subtree: true });
    }
});
