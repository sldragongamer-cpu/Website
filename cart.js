let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartTab = null;
let listCartHTML = null;

async function loadCartHTML() {
    try {
        const response = await fetch('/Cart/index.html');
        const html = await response.text();
        document.body.insertAdjacentHTML('beforeend', html);
        
        cartTab = document.querySelector('.cartTab');
        listCartHTML = document.querySelector('.listCart');
        
        initCart();
    } catch (error) {
        console.error('Failed to load cart:', error);
    }
}

function initCart() {
    if (!cartTab) return;
    
    document.querySelectorAll('.icon-btn, .cart-btn, #cartToggle, [id="cartToggle"]').forEach(btn => {
        if (btn.textContent.includes('Cart')) {
            btn.style.cursor = 'pointer';
            btn.onclick = () => toggleCart();
        }
    });

    document.querySelector('.cartTab .close')?.addEventListener('click', closeCart);
    document.querySelector('.cartTab .checkOut')?.addEventListener('click', checkout);
    
    renderCart();
    attachAddToCartListeners();
    updateCartBadge();
}

function attachAddToCartListeners() {
    document.querySelectorAll('.cart-btn').forEach(btn => {
        if (!btn.dataset.cartAttached) {
            btn.dataset.cartAttached = 'true';
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                if (!card) return;
                
                const imageSrc = card.querySelector('.product-image')?.src || '';
                const productName = card.querySelector('.product-name')?.textContent || '';
                const priceElement = card.querySelector('.price');
                const priceText = priceElement?.textContent || '0';
                const price = parsePrice(priceText);
                
                console.log('Adding to cart:', { 
                    name: productName.substring(0, 50), 
                    priceText: priceText, 
                    parsedPrice: price,
                    imageSrc: imageSrc
                });
                
                const product = {
                    id: imageSrc || productName || Date.now().toString(),
                    name: productName || 'Unknown Product',
                    price: price,
                    image: imageSrc,
                    quantity: 1
                };
                
                addToCart(product);
            });
        }
    });
}

function parsePrice(priceStr) {
    const cleaned = priceStr.replace(/Rs\.?\s*/gi, '').replace(/,/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(product);
    }
    
    saveCart();
    renderCart();
    showNotification(`${product.name.substring(0, 30)}... added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function syncPrices() {
    document.querySelectorAll('.card').forEach(card => {
        const image = card.querySelector('.product-image')?.src || '';
        const priceText = card.querySelector('.price')?.textContent || '0';
        const price = parsePrice(priceText);
        
        const parent = card.closest('.products-row, .card-container');
        const isVisible = parent ? getComputedStyle(parent).display !== 'none' : true;
        
        if (image && price > 0 && isVisible) {
            const item = cart.find(i => i.image === image);
            if (item) {
                item.price = price;
            }
        }
    });
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.icon-btn').forEach(btn => {
        if (btn.textContent.includes('Cart') && !btn.closest('.cartTab')) {
            btn.innerHTML = `Cart ${totalItems > 0 ? `<span style="background:#ff4444;border-radius:50%;padding:2px 8px;font-size:12px;margin-left:4px;">${totalItems}</span>` : ''}`;
        }
    });
}

function renderCart() {
    if (!listCartHTML) return;
    
    if (cart.length === 0) {
        listCartHTML.innerHTML = `
            <div style="text-align:center;padding:60px 20px;color:var(--text-dim);">
                <p style="font-size:48px;margin:0;filter:grayscale(0.5);">🛒</p>
                <p style="margin:15px 0 5px;font-size:18px;font-weight:600;color:var(--text-secondary);">Your cart is empty</p>
                <p style="margin:0;font-size:14px;color:var(--text-dim);">Add some products to get started!</p>
            </div>
        `;
        updateTotal(0);
        return;
    }
    
    listCartHTML.innerHTML = cart.map(item => `
        <div class="cart-item" style="display:flex;gap:12px;padding:12px;border-bottom:1px solid rgba(0,240,255,0.1);align-items:center;">
            <img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;object-fit:contain;border-radius:8px;background:rgba(10,10,30,0.8);border:1px solid rgba(0,240,255,0.15);">
            <div style="flex:1;min-width:0;">
                <p style="margin:0;font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary);">${item.name}</p>
                <p style="margin:4px 0 0;color:var(--neon-cyan);font-weight:700;">Rs. ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
                <button onclick="updateQuantity('${item.id}', -1)" style="width:28px;height:28px;border:1px solid rgba(0,240,255,0.2);border-radius:6px;background:transparent;cursor:pointer;font-size:16px;font-weight:700;color:var(--text-secondary);transition:all 0.25s ease;">−</button>
                <span style="min-width:24px;text-align:center;font-weight:600;color:var(--text-primary);">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)" style="width:28px;height:28px;border:1px solid rgba(0,240,255,0.2);border-radius:6px;background:transparent;cursor:pointer;font-size:16px;font-weight:700;color:var(--text-secondary);transition:all 0.25s ease;">+</button>
            </div>
            <button onclick="removeFromCart('${item.id}')" style="width:28px;height:28px;border:1px solid rgba(255,51,85,0.3);border-radius:6px;background:transparent;color:#ff3355;cursor:pointer;font-size:16px;transition:all 0.25s ease;">×</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateTotal(total);
}

function updateTotal(total) {
    const totalEl = document.querySelector('.cart-total');
    if (totalEl) {
        totalEl.textContent = `Total: Rs. ${total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}

function toggleCart() {
    if (!cartTab) return;
    cartTab.classList.toggle('open');
    if (cartTab.classList.contains('open')) {
        cartTab.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';
        syncPrices();
    } else {
        cartTab.style.transform = 'translateX(100%)';
        document.body.style.overflow = '';
    }
}

function closeCart() {
    if (cartTab) {
        cartTab.classList.remove('open');
        cartTab.style.transform = 'translateX(100%)';
        document.body.style.overflow = '';
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    closeCart();
    window.location.href = '/checkout/index.html';
}

function viewOrders() {
    const orders = getOrders();
    const ordersWindow = window.open('', '_blank', 'width=600,height=700');
    
    if (orders.length === 0) {
        ordersWindow.document.write(`
            <html>
            <head><title>My Orders</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .no-orders { text-align: center; color: #666; margin-top: 50px; }
            </style>
            </head>
            <body>
                <h1>My Orders</h1>
                <div class="no-orders">
                    <p>No orders yet</p>
                    <p>Start shopping to see your orders here!</p>
                </div>
            </body>
            </html>
        `);
        return;
    }
    
    const ordersHTML = orders.map(order => `
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <strong>${order.id}</strong>
                <span style="background: ${order.status === 'Pending' ? '#ffc107' : order.status === 'Completed' ? '#28a745' : '#17a2b8'}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 12px;">${order.status}</span>
            </div>
            <div style="color: #666; font-size: 12px; margin-bottom: 10px;">${new Date(order.date).toLocaleString()}</div>
            <div style="font-size: 14px;">
                ${order.items.map(item => `<div style="margin: 5px 0;">${item.name.substring(0, 40)}... x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}</div>`).join('')}
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; font-weight: bold; color: #0b57d0;">
                Total: Rs. ${order.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
        </div>
    `).join('');
    
    ordersWindow.document.write(`
        <html>
        <head><title>My Orders</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
            h1 { color: #333; }
            .back-btn { background: #0b57d0; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
        </style>
        </head>
        <body>
            <button class="back-btn" onclick="window.close()">Close</button>
            <h1>My Orders</h1>
            ${ordersHTML}
        </body>
        </html>
    `);
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
    }, 2500);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
    .cartTab {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 420px;
        max-width: 100vw;
        background: rgba(10,10,26,0.98);
        box-shadow: -10px 0 40px rgba(0,0,0,0.5);
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        display: flex;
        flex-direction: column;
        z-index: 9999;
        border-left: 1px solid rgba(0,240,255,0.15);
    }
    .cartTab.open {
        transform: translateX(0);
    }
    .cartTab h1 {
        padding: 20px;
        margin: 0;
        font-weight: 800;
        text-align: center;
        background: linear-gradient(135deg, var(--neon-cyan), var(--neon-blue));
        color: #0a0a1a;
        font-family: var(--font-main);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        box-shadow: 0 0 20px rgba(0,240,255,0.2);
    }
    .cartTab .listCart {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
    }
    .cartTab .listCart::-webkit-scrollbar { width: 4px; }
    .cartTab .listCart::-webkit-scrollbar-thumb {
        background: var(--neon-cyan);
        border-radius: 2px;
    }
    .cartTab .btn {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 15px 20px;
        background: rgba(10,10,26,0.95);
        border-top: 1px solid rgba(0,240,255,0.1);
    }
    .cartTab .btn button {
        padding: 14px;
        border: none;
        border-radius: 12px;
        font-family: var(--font-main);
        font-weight: 700;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    .cartTab .btn button:hover {
        transform: translateY(-2px);
    }
    .cartTab .btn .close {
        background: rgba(0,240,255,0.05);
        color: var(--text-secondary);
        border: 1px solid rgba(0,240,255,0.15);
    }
    .cartTab .btn .close:hover {
        background: rgba(0,240,255,0.1);
        color: var(--neon-cyan);
    }
    .cartTab .btn .checkOut {
        background: linear-gradient(135deg, var(--neon-cyan), var(--neon-blue));
        color: #0a0a1a;
        box-shadow: 0 0 20px rgba(0,240,255,0.3);
    }
    .cartTab .btn .checkOut:hover {
        box-shadow: 0 0 30px rgba(0,240,255,0.5);
    }
    .cartTab .cart-total {
        padding: 15px 20px;
        font-size: 18px;
        font-weight: 800;
        text-align: right;
        background: rgba(0,240,255,0.05);
        border-top: 1px solid rgba(0,240,255,0.1);
        color: var(--neon-cyan);
        font-family: var(--font-main);
        text-shadow: 0 0 10px rgba(0,240,255,0.3);
    }
`;
document.head.appendChild(style);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCartHTML);
} else {
    loadCartHTML();
}

document.addEventListener('click', () => {
    setTimeout(attachAddToCartListeners, 100);
});
