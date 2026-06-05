(function () {
  'use strict';

  const selected = {};
  const TOTAL_CATEGORIES = 8;

  const categories = [
    {
      key: 'cpu', label: 'CPU', icon: '🖥️',
      items: [
        { id: 'cpu1', name: 'AMD Ryzen 5 9600X', specs: '6 Cores, 12 Threads · 4.3 / 5.4 GHz · AM5', price: 115000, socket: 'AM5', stock: true },
        { id: 'cpu2', name: 'AMD Ryzen 7 9700X', specs: '8 Cores, 16 Threads · 3.8 / 5.5 GHz · AM5', price: 145000, socket: 'AM5', stock: true },
        { id: 'cpu3', name: 'AMD Ryzen 9 9900X', specs: '12 Cores, 24 Threads · 4.4 / 5.6 GHz · AM5', price: 210000, socket: 'AM5', stock: true },
        { id: 'cpu4', name: 'Intel Core i5-14600K', specs: '14 Cores, 20 Threads · 3.5 / 5.3 GHz · LGA 1700', price: 125000, socket: 'LGA1700', stock: true },
        { id: 'cpu5', name: 'Intel Core i7-14700K', specs: '20 Cores, 28 Threads · 3.4 / 5.6 GHz · LGA 1700', price: 185000, socket: 'LGA1700', stock: false },
      ]
    },
    {
      key: 'gpu', label: 'GPU', icon: '🎮',
      items: [
        { id: 'gpu1', name: 'NVIDIA RTX 4060 8GB', specs: '8GB GDDR6 · 3072 CUDA Cores · DLSS 3', price: 95000, tdp: 115, stock: true },
        { id: 'gpu2', name: 'NVIDIA RTX 4060 Ti 8GB', specs: '8GB GDDR6 · 4352 CUDA Cores · DLSS 3', price: 130000, tdp: 160, stock: true },
        { id: 'gpu3', name: 'NVIDIA RTX 4070 Super 12GB', specs: '12GB GDDR6X · 7168 CUDA Cores · DLSS 3', price: 185000, tdp: 220, stock: true },
        { id: 'gpu4', name: 'NVIDIA RTX 4080 Super 16GB', specs: '16GB GDDR6X · 10240 CUDA Cores · DLSS 3', price: 340000, tdp: 320, stock: false },
        { id: 'gpu5', name: 'AMD RX 7700 XT 12GB', specs: '12GB GDDR6 · 3456 Stream Processors · FSR 3', price: 160000, tdp: 245, stock: true },
      ]
    },
    {
      key: 'ram', label: 'RAM', icon: '💾',
      items: [
        { id: 'ram1', name: 'Corsair Vengeance 16GB DDR5', specs: '2×8GB · 5600MHz · CL36', price: 18000, ddr: 'DDR5', stock: true },
        { id: 'ram2', name: 'Corsair Vengeance 32GB DDR5', specs: '2×16GB · 6000MHz · CL36', price: 32000, ddr: 'DDR5', stock: true },
        { id: 'ram3', name: 'G.Skill Trident Z5 64GB DDR5', specs: '2×32GB · 6400MHz · CL32', price: 58000, ddr: 'DDR5', stock: true },
      ]
    },
    {
      key: 'storage', label: 'Storage', icon: '🗄️',
      items: [
        { id: 'ssd1', name: 'Samsung 970 EVO Plus 1TB', specs: '1TB NVMe M.2 · 3500 MB/s Read', price: 35000, stock: true },
        { id: 'ssd2', name: 'Samsung 990 Pro 2TB', specs: '2TB NVMe M.2 · 7450 MB/s Read', price: 65000, stock: true },
        { id: 'ssd3', name: 'WD Black SN850X 2TB', specs: '2TB NVMe M.2 · 7300 MB/s Read', price: 58000, stock: true },
      ]
    },
    {
      key: 'motherboard', label: 'Motherboard', icon: '🔌',
      items: [
        { id: 'mb1', name: 'MSI B650M Gaming Plus', specs: 'AM5 · DDR5 · M.2 · USB 3.2 · mATX', price: 45000, socket: 'AM5', form: 'mATX', stock: true },
        { id: 'mb2', name: 'ASUS ROG Strix B650E-F', specs: 'AM5 · DDR5 · PCIe 5.0 · M.2 · ATX', price: 85000, socket: 'AM5', form: 'ATX', stock: true },
        { id: 'mb3', name: 'MSI Z790 Tomahawk DDR5', specs: 'LGA 1700 · DDR5 · PCIe 5.0 · M.2 · ATX', price: 78000, socket: 'LGA1700', form: 'ATX', stock: false },
      ]
    },
    {
      key: 'psu', label: 'PSU', icon: '⚡',
      items: [
        { id: 'psu1', name: 'Corsair RM750x 750W', specs: '750W · 80+ Gold · Fully Modular · ATX', price: 28000, wattage: 750, stock: true },
        { id: 'psu2', name: 'Corsair RM850x 850W', specs: '850W · 80+ Gold · Fully Modular · ATX', price: 38000, wattage: 850, stock: true },
        { id: 'psu3', name: 'Seasonic Focus 1000W', specs: '1000W · 80+ Platinum · Fully Modular · ATX', price: 55000, wattage: 1000, stock: true },
      ]
    },
    {
      key: 'case', label: 'Case', icon: '📦',
      items: [
        { id: 'case1', name: 'Corsair 4000D Airflow', specs: 'Mid-Tower · ATX · Tempered Glass · 3×120mm Fans', price: 22000, form: 'ATX', stock: true },
        { id: 'case2', name: 'NZXT H7 Flow', specs: 'Mid-Tower · ATX · Tempered Glass · Excellent Airflow', price: 28000, form: 'ATX', stock: true },
        { id: 'case3', name: 'Lian Li O11 Dynamic', specs: 'Mid-Tower · ATX/E-ATX · Dual Chamber · Glass', price: 45000, form: 'EATX', stock: true },
      ]
    },
    {
      key: 'cooler', label: 'Cooler', icon: '❄️',
      items: [
        { id: 'cooler1', name: 'Cooler Master Hyper 212', specs: 'Tower Cooler · 120mm Fan · 4 Heat Pipes', price: 12000, stock: true },
        { id: 'cooler2', name: 'NZXT Kraken X63', specs: '280mm AIO Liquid · 2×140mm Fans · RGB', price: 35000, stock: true },
        { id: 'cooler3', name: 'Corsair H150i Elite', specs: '360mm AIO Liquid · 3×120mm Fans · LCD', price: 55000, stock: false },
      ]
    },
  ];

  const els = {};

  function $(id) { return document.getElementById(id); }

  function renderSections() {
    const container = $('builderMain');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
      <div class="component-section" data-category="${cat.key}">
        <h2>
          <span class="cat-icon">${cat.icon}</span>
          ${cat.label}
          <span class="cat-count">${cat.items.length} options</span>
        </h2>
        <div class="component-grid" data-category="${cat.key}">
          ${cat.items.map(item => renderCard(cat.key, item)).join('')}
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.component-grid').forEach(grid => {
      grid.addEventListener('click', e => {
        const card = e.target.closest('.component-card');
        if (!card || card.classList.contains('out-stock')) return;
        const cat = grid.dataset.category;
        const id = card.dataset.id;
        const item = getItem(cat, id);
        if (!item) return;
        toggleSelection(cat, item, grid);
      });
    });
  }

  function renderCard(catKey, item) {
    const out = !item.stock;
    return `
      <div class="component-card${out ? ' out-stock' : ''}" data-id="${item.id}" data-price="${item.price}">
        ${out ? '<div class="card-badge out">Out of Stock</div>' : '<div class="card-badge">In Stock</div>'}
        <div class="name">${item.name}</div>
        <div class="specs">${item.specs}</div>
        <div class="price-row">
          <span class="price">Rs. ${item.price.toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  function getItem(catKey, id) {
    const cat = categories.find(c => c.key === catKey);
    return cat ? cat.items.find(i => i.id === id) : null;
  }

  function toggleSelection(catKey, item, grid) {
    if (selected[catKey] && selected[catKey].id === item.id) {
      delete selected[catKey];
      grid.querySelectorAll('.component-card').forEach(c => c.classList.remove('selected'));
    } else {
      grid.querySelectorAll('.component-card').forEach(c => c.classList.remove('selected'));
      grid.querySelector(`.component-card[data-id="${item.id}"]`).classList.add('selected');
      selected[catKey] = { ...item, category: catKey };
    }
    updateUI();
  }

  function updateUI() {
    updateSummary();
    updateProgress();
    updateCompatibility();
    updateButtons();
  }

  function updateProgress() {
    const count = Object.keys(selected).length;
    const pct = (count / TOTAL_CATEGORIES) * 100;
    const fill = $('progressFill');
    const label = $('progressCount');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = `${count} / ${TOTAL_CATEGORIES}`;
  }

  function updateSummary() {
    const container = $('selectedItems');
    const totalEl = $('totalPrice');
    if (!container) return;

    const entries = Object.entries(selected);
    if (entries.length === 0) {
      container.innerHTML = '<div class="selected-item empty">No components selected — click any card above</div>';
      if (totalEl) totalEl.textContent = 'Rs. 0';
      return;
    }

    container.innerHTML = entries.map(([cat, item]) => {
      const catData = categories.find(c => c.key === cat);
      return `
        <div class="selected-item">
          <span class="si-cat">${catData ? catData.icon : ''} ${catData ? catData.label : cat}</span>
          <span class="si-name">${item.name}</span>
          <span class="si-price">Rs. ${item.price.toLocaleString()}</span>
          <button class="si-remove" data-category="${cat}" title="Remove">✕</button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.si-remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const cat = btn.dataset.category;
        delete selected[cat];
        const grid = document.querySelector(`.component-grid[data-category="${cat}"]`);
        if (grid) grid.querySelectorAll('.component-card').forEach(c => c.classList.remove('selected'));
        updateUI();
      });
    });

    const total = entries.reduce((sum, [, item]) => sum + item.price, 0);
    if (totalEl) totalEl.textContent = 'Rs. ' + total.toLocaleString();
  }

  function updateCompatibility() {
    const warnEl = $('compatibilityWarning');
    const warnText = $('warningText');
    const okEl = $('compatibilityOk');
    if (!warnEl || !warnText || !okEl) return;

    const warnings = [];

    if (selected.cpu && selected.motherboard) {
      const cpuSocket = selected.cpu.socket;
      const mbSocket = selected.motherboard.socket;
      if (cpuSocket !== mbSocket) {
        warnings.push(`CPU socket (${cpuSocket}) doesn't match motherboard socket (${mbSocket}). Choose a compatible motherboard.`);
      }
    }

    if (selected.cpu && selected.motherboard && selected.cpu.socket === selected.motherboard.socket) {
      if (selected.cpu.socket === 'AM5' && selected.motherboard.form === 'mATX') {
        if (selected.case && selected.case.form === 'EATX') {
          warnings.push('mATX motherboard in an E-ATX case may look small — consider an ATX board.');
        }
      }
    }

    if (selected.gpu && selected.psu) {
      const gpuTDP = selected.gpu.tdp || 0;
      const cpuTDP = selected.cpu ? (selected.cpu.id === 'cpu1' ? 65 : selected.cpu.id === 'cpu2' ? 120 : selected.cpu.id === 'cpu3' ? 170 : selected.cpu.id === 'cpu4' ? 125 : 150) : 0;
      const estimatedLoad = (gpuTDP + cpuTDP) * 1.5 + 100;
      const psuWattage = selected.psu.wattage;

      if (psuWattage < estimatedLoad) {
        warnings.push(`Estimated system load (~${Math.round(estimatedLoad)}W) exceeds PSU capacity (${psuWattage}W). Consider a higher wattage PSU.`);
      } else if (psuWattage >= estimatedLoad * 1.5) {
        warnings.push(`PSU (${psuWattage}W) is oversized for estimated load (~${Math.round(estimatedLoad)}W). You could save money with a lower wattage unit.`);
      }
    }

    if (warnings.length > 0) {
      warnText.textContent = warnings.join(' ');
      warnEl.classList.add('show');
      okEl.classList.remove('show');
    } else {
      warnEl.classList.remove('show');
      const hasComponents = Object.keys(selected).length >= 2;
      if (hasComponents) {
        okEl.classList.add('show');
      } else {
        okEl.classList.remove('show');
      }
    }
  }

  function updateButtons() {
    const btn = $('addToCartBtn');
    const count = Object.keys(selected).length;
    if (!btn) return;
    if (count === 0) {
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-shimmer"></span>Select Components to Continue';
    } else if (count < TOTAL_CATEGORIES) {
      btn.disabled = true;
      btn.innerHTML = `<span class="btn-shimmer"></span>Select ${TOTAL_CATEGORIES - count} More ${TOTAL_CATEGORIES - count === 1 ? 'Component' : 'Components'}`;
    } else {
      btn.disabled = false;
      btn.innerHTML = '<span class="btn-shimmer"></span>🛒 Add Build to Cart';
    }
  }

  function handleAddToCart() {
    const btn = $('addToCartBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const entries = Object.entries(selected);
      if (entries.length === 0) return;

      const total = entries.reduce((sum, [, item]) => sum + item.price, 0);
      const parts = entries.map(([cat, item]) => {
        const catData = categories.find(c => c.key === cat);
        return { category: catData ? catData.label : cat, name: item.name, price: item.price };
      });

      const customBuild = {
        id: 'custom-build-' + Date.now(),
        name: 'Custom PC Build — ' + entries.map(([, item]) => item.name.split(' ').slice(0, 2).join(' ')).join(' + '),
        price: total,
        image: '/pc-images/pc1.png',
        quantity: 1,
        components: parts,
      };

      if (typeof addToCart === 'function') {
        addToCart(customBuild);
      } else {
        showMsg('Cart system not loaded. Please refresh the page.', 'error');
      }
    });
  }

  function handleClear() {
    const btn = $('clearBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      Object.keys(selected).forEach(k => delete selected[k]);
      document.querySelectorAll('.component-card.selected').forEach(c => c.classList.remove('selected'));
      updateUI();
      showMsg('Build cleared', 'success');
    });
  }

  function handleSave() {
    const btn = $('saveBuildBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const entries = Object.entries(selected);
      if (entries.length === 0) {
        showMsg('Select at least one component to save', 'error');
        return;
      }
      try {
        const saves = JSON.parse(localStorage.getItem('pc-builds') || '[]');
        saves.push({ id: Date.now(), date: new Date().toISOString(), components: { ...selected } });
        localStorage.setItem('pc-builds', JSON.stringify(saves));
        showMsg('Build saved! View in Saved Builds', 'success');
      } catch (e) {
        showMsg('Failed to save build', 'error');
      }
    });
  }

  function handleShare() {
    const btn = $('shareBuildBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const entries = Object.entries(selected);
      if (entries.length === 0) {
        showMsg('Select components to share', 'error');
        return;
      }
      const lines = entries.map(([cat, item]) => {
        const catData = categories.find(c => c.key === cat);
        return `${catData ? catData.icon : ''} ${catData ? catData.label : cat}: ${item.name} (Rs. ${item.price.toLocaleString()})`;
      });
      const total = entries.reduce((sum, [, item]) => sum + item.price, 0);
      const text = '⚡ My Custom PC Build\n\n' + lines.join('\n') + `\n\nTotal: Rs. ${total.toLocaleString()}\n\nBuilt with Unet Solutions`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showMsg('Build copied to clipboard!', 'success');
        }).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showMsg('Build copied to clipboard!', 'success');
    } catch (e) {
      showMsg('Could not copy. Select the text manually.', 'error');
    }
    document.body.removeChild(ta);
  }

  function showMsg(msg, type) {
    if (typeof showNotification === 'function') {
      showNotification(msg, type);
      return;
    }
    const n = document.createElement('div');
    n.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:14px 28px;border-radius:14px;font-weight:700;z-index:100000;font-family:'Inter',sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.3);border:1px solid ${type === 'error' ? 'rgba(255,51,85,0.3)' : 'rgba(0,240,255,0.2)'};background:${type === 'error' ? 'rgba(255,51,85,0.15)' : 'rgba(0,255,136,0.15)'};color:${type === 'error' ? '#ff3355' : 'var(--neon-green)'};backdrop-filter:blur(20px);animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1)`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => { n.style.transition = 'all 0.4s ease'; n.style.opacity = '0'; n.style.transform = 'translateX(-50%) translateY(-20px)'; setTimeout(() => n.remove(), 400); }, 2500);
  }

  function init() {
    renderSections();
    handleAddToCart();
    handleClear();
    handleSave();
    handleShare();
    updateUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
