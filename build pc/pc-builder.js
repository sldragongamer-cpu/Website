class PCBuilder {
    constructor() {
        this.apiKey = 'your_api_key_here'; // Replace with your actual API key
        this.selectedComponents = {};
        this.apiProvider = 'together'; // Options: 'together', 'huggingface', 'localai', 'openai'
        this.init();
    }

    init() {
        this.renderBuilder();
        this.attachEventListeners();
        this.loadFromStorage();
    }

    renderBuilder() {
        const container = document.getElementById('pc-builder-container');
        
        container.innerHTML = `
            <div class="builder-wrapper">
                <div class="parts-selector">
                    ${this.renderCategories()}
                </div>
                <div class="build-display">
                    <h2>Your Build</h2>
                    <div class="build-specs" id="buildSpecs">
                        <div style="text-align: center; color: #999;">Select components to build</div>
                    </div>
                    <div class="total-price" id="totalPrice">$0</div>
                    <div class="action-buttons">
                        <button class="action-btn generate" id="generateBtn" disabled>
                            🤖 Generate AI Image
                        </button>
                        <button class="action-btn clear" id="clearBtn">Clear Build</button>
                    </div>
                    <div class="image-container" id="imageContainer"></div>
                </div>
            </div>
        `;
    }

    renderCategories() {
        const categories = {
            cpu: {
                icon: '🖥️',
                label: 'CPU',
                parts: [
                    { id: 'cpu1', name: 'AMD Ryzen 5 7600X', price: 115000, specs: '6-core, 5.7GHz' },
                    { id: 'cpu2', name: 'AMD Ryzen 7 7700X', price: 145000, specs: '8-core, 5.6GHz' },
                    { id: 'cpu3', name: 'AMD Ryzen 9 7900X', price: 210000, specs: '12-core, 5.6GHz' },
                    { id: 'cpu4', name: 'Intel Core i5-13600K', price: 125000, specs: '14-core, 5.1GHz' },
                    { id: 'cpu5', name: 'Intel Core i7-13700K', price: 185000, specs: '16-core, 5.4GHz' }
                ]
            },
            gpu: {
                icon: '🎮',
                label: 'GPU',
                parts: [
                    { id: 'gpu1', name: 'RTX 4060 8GB', price: 95000, specs: '3072 CUDA cores' },
                    { id: 'gpu2', name: 'RTX 4060 Ti 8GB', price: 130000, specs: '4352 CUDA cores' },
                    { id: 'gpu3', name: 'RTX 4070 Super 12GB', price: 185000, specs: '7168 CUDA cores' },
                    { id: 'gpu4', name: 'RTX 4080 Super 16GB', price: 340000, specs: '10240 CUDA cores' },
                    { id: 'gpu5', name: 'RTX 4090 24GB', price: 450000, specs: '16384 CUDA cores' }
                ]
            },
            ram: {
                icon: '💾',
                label: 'RAM',
                parts: [
                    { id: 'ram1', name: 'Corsair Vengeance 16GB DDR5', price: 18000, specs: '5600MHz' },
                    { id: 'ram2', name: 'Corsair Vengeance 32GB DDR5', price: 32000, specs: '6000MHz' },
                    { id: 'ram3', name: 'G.Skill Trident Z5 64GB', price: 58000, specs: '6400MHz' },
                    { id: 'ram4', name: 'Kingston Fury 128GB DDR5', price: 95000, specs: '7200MHz' }
                ]
            },
            storage: {
                icon: '🗄️',
                label: 'Storage',
                parts: [
                    { id: 'ssd1', name: 'Samsung 970 EVO Plus 1TB', price: 35000, specs: '3500MB/s' },
                    { id: 'ssd2', name: 'Samsung 990 Pro 2TB', price: 65000, specs: '7450MB/s' },
                    { id: 'ssd3', name: 'WD Black SN850X 2TB', price: 58000, specs: '7300MB/s' },
                    { id: 'ssd4', name: 'Sabrent Rocket 4TB', price: 95000, specs: '7100MB/s' }
                ]
            },
            motherboard: {
                icon: '🔌',
                label: 'Motherboard',
                parts: [
                    { id: 'mb1', name: 'MSI B650M Gaming Plus', price: 45000, specs: 'AM5' },
                    { id: 'mb2', name: 'ASUS ROG Strix B650E-F', price: 85000, specs: 'AM5' },
                    { id: 'mb3', name: 'MSI Z790 Tomahawk', price: 78000, specs: 'LGA 1700' },
                    { id: 'mb4', name: 'ASUS ROG Maximus Z790', price: 125000, specs: 'LGA 1700' }
                ]
            },
            psu: {
                icon: '⚡',
                label: 'Power Supply',
                parts: [
                    { id: 'psu1', name: 'Corsair RM750x 750W', price: 28000, specs: '80+ Gold' },
                    { id: 'psu2', name: 'Corsair RM850x 850W', price: 38000, specs: '80+ Gold' },
                    { id: 'psu3', name: 'Seasonic Focus 1000W', price: 55000, specs: '80+ Platinum' },
                    { id: 'psu4', name: 'Corsair HX1200 1200W', price: 78000, specs: '80+ Platinum' }
                ]
            },
            case: {
                icon: '📦',
                label: 'Case',
                parts: [
                    { id: 'case1', name: 'Corsair 4000D Airflow', price: 22000, specs: 'Mid-Tower' },
                    { id: 'case2', name: 'NZXT H7 Flow', price: 28000, specs: 'Mid-Tower' },
                    { id: 'case3', name: 'Lian Li O11 Dynamic', price: 45000, specs: 'Dual Chamber' },
                    { id: 'case4', name: 'Corsair 5000T RGB', price: 65000, specs: 'Full Tower' }
                ]
            },
            cooler: {
                icon: '❄️',
                label: 'CPU Cooler',
                parts: [
                    { id: 'cooler1', name: 'Cooler Master Hyper 212', price: 12000, specs: 'Tower' },
                    { id: 'cooler2', name: 'NZXT Kraken X63', price: 35000, specs: '280mm AIO' },
                    { id: 'cooler3', name: 'Corsair H150i Elite', price: 55000, specs: '360mm AIO' },
                    { id: 'cooler4', name: 'Arctic Liquid Freezer II 420', price: 48000, specs: '420mm AIO' }
                ]
            }
        };

        let html = '';
        for (const [key, category] of Object.entries(categories)) {
            html += `
                <div class="category">
                    <h3>${category.icon} ${category.label}</h3>
                    <div class="parts-grid">
                        ${category.parts.map(part => `
                            <button class="part-btn" data-category="${key}" data-id="${part.id}" data-name="${part.name}" data-price="${part.price}">
                                <strong>${part.name}</strong>
                                <span class="price">Rs. ${part.price.toLocaleString()}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        return html;
    }

    attachEventListeners() {
        const container = document.getElementById('pc-builder-container');
        
        container.querySelectorAll('.part-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = btn.dataset.category;
                const isSelected = btn.classList.contains('selected');
                
                // Remove previous selection in this category
                container.querySelectorAll(`[data-category="${category}"].selected`).forEach(b => {
                    b.classList.remove('selected');
                });
                
                if (!isSelected) {
                    btn.classList.add('selected');
                    this.selectedComponents[category] = {
                        id: btn.dataset.id,
                        name: btn.dataset.name,
                        price: parseInt(btn.dataset.price)
                    };
                } else {
                    delete this.selectedComponents[category];
                }
                
                this.updateDisplay();
                this.saveToStorage();
            });
        });

        document.getElementById('generateBtn').addEventListener('click', () => this.generateImage());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearBuild());
    }

    updateDisplay() {
        const specsContainer = document.getElementById('buildSpecs');
        const totalEl = document.getElementById('totalPrice');
        const generateBtn = document.getElementById('generateBtn');

        const components = Object.entries(this.selectedComponents);
        
        if (components.length === 0) {
            specsContainer.innerHTML = '<div style="text-align: center; color: #999;">Select components to build</div>';
            totalEl.textContent = 'Rs. 0';
            generateBtn.disabled = true;
            return;
        }

        let total = 0;
        let html = '';

        components.forEach(([category, component]) => {
            total += component.price;
            html += `
                <div class="spec-item">
                    <span class="spec-label">${this.getCategoryLabel(category)}</span>
                    <span class="spec-value">${component.name}</span>
                    <span class="spec-price">Rs. ${component.price.toLocaleString()}</span>
                    <button class="remove-btn" onclick="pcBuilder.removeComponent('${category}')">×</button>
                </div>
            `;
        });

        specsContainer.innerHTML = html;
        totalEl.textContent = `Rs. ${total.toLocaleString()}`;
        generateBtn.disabled = components.length < 3;
    }

    getCategoryLabel(category) {
        const labels = {
            cpu: 'CPU', gpu: 'GPU', ram: 'RAM', storage: 'Storage',
            motherboard: 'MB', psu: 'PSU', case: 'Case', cooler: 'Cooler'
        };
        return labels[category] || category;
    }

    removeComponent(category) {
        delete this.selectedComponents[category];
        document.querySelectorAll(`[data-category="${category}"].selected`).forEach(btn => {
            btn.classList.remove('selected');
        });
        this.updateDisplay();
        this.saveToStorage();
    }

    async generateImage() {
        const imageContainer = document.getElementById('imageContainer');
        const generateBtn = document.getElementById('generateBtn');

        if (Object.keys(this.selectedComponents).length < 3) {
            alert('Please select at least 3 components');
            return;
        }

        // Build prompt from components
        const specs = Object.entries(this.selectedComponents)
            .map(([cat, comp]) => `${this.getCategoryLabel(cat)}: ${comp.name}`)
            .join(', ');

        const prompt = `A high-performance gaming PC build with: ${specs}. Professional product photo, detailed, realistic, well-lit, studio lighting.`;

        imageContainer.innerHTML = '<div class="loading">🔄 Generating AI image... This may take 10-30 seconds</div>';
        generateBtn.disabled = true;

        try {
            let imageUrl;

            switch (this.apiProvider) {
                case 'together':
                    imageUrl = await this.generateWithTogetherAI(prompt);
                    break;
                case 'huggingface':
                    imageUrl = await this.generateWithHuggingFace(prompt);
                    break;
                case 'localai':
                    imageUrl = await this.generateWithLocalAPI(prompt);
                    break;
                default:
                    throw new Error('Invalid API provider');
            }

            if (imageUrl) {
                imageContainer.innerHTML = `
                    <div class="generated-image">
                        <img src="${imageUrl}" alt="Generated PC Build">
                        <div class="image-actions">
                            <a href="${imageUrl}" download="pc-build.png" class="download-btn">
                                ⬇️ Download Image
                            </a>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            imageContainer.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
            console.error('Image generation error:', error);
        } finally {
            generateBtn.disabled = false;
        }
    }

    async generateWithTogetherAI(prompt) {
        if (!this.apiKey || this.apiKey === 'your_api_key_here') {
            throw new Error('API key not configured. Set your Together AI key in pc-builder.js');
        }

        const response = await fetch('https://api.together.xyz/inference', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
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
            throw new Error(error.error?.message || 'Failed to generate image');
        }

        const data = await response.json();
        return data.output?.choices[0]?.image_url || data.data?.[0];
    }

    async generateWithHuggingFace(prompt) {
        if (!this.apiKey || this.apiKey === 'your_api_key_here') {
            throw new Error('API key not configured. Set your Hugging Face token in pc-builder.js');
        }

        const response = await fetch(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
            {
                headers: { Authorization: `Bearer ${this.apiKey}` },
                method: 'POST',
                body: JSON.stringify({ inputs: prompt })
            }
        );

        if (!response.ok) {
            throw new Error('Hugging Face API error');
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    async generateWithLocalAPI(prompt) {
        const response = await fetch('http://localhost:8000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                steps: 25,
                width: 768,
                height: 768
            })
        });

        if (!response.ok) {
            throw new Error('Local API error. Make sure LocalAI is running on http://localhost:8000');
        }

        const data = await response.json();
        return data.image || data.data?.[0];
    }

    clearBuild() {
        this.selectedComponents = {};
        document.querySelectorAll('.part-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById('imageContainer').innerHTML = '';
        this.updateDisplay();
        this.saveToStorage();
    }

    saveToStorage() {
        localStorage.setItem('pcBuild', JSON.stringify(this.selectedComponents));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('pcBuild');
        if (saved) {
            this.selectedComponents = JSON.parse(saved);
            // Highlight previously selected components
            Object.entries(this.selectedComponents).forEach(([category, component]) => {
                const btn = document.querySelector(`[data-category="${category}"][data-id="${component.id}"]`);
                if (btn) btn.classList.add('selected');
            });
            this.updateDisplay();
        }
    }
}

// Initialize the builder
const pcBuilder = new PCBuilder();
