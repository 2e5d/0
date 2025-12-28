const dataUrl = "https://raw.githubusercontent.com/2e5d/0/refs/heads/main/Scripts";

async function fetchData() {
    try {
        const response = await fetch(dataUrl);
        const data = await response.json();
        renderCodeBlocks(data);
    } catch (error) {
        showError('Failed to load scripts.');
    }
}

function renderCodeBlocks(data) {
    const container = document.querySelector('.scripts-grid');
    if (!container) return;
    
    container.innerHTML = '';
    Object.entries(data).forEach(([title, code]) => {
        const block = document.createElement('div');
        block.className = 'code-block';
        block.setAttribute('data-title', title.toLowerCase());
        
        block.innerHTML = `
            <h2>${title}</h2>
            <pre><code>${escapeHtml(code)}</code></pre>
            <button class="copy-button" onclick="copyCode(this)">Copy Code</button>
        `;
        container.appendChild(block);
    });
    
    const comingSoon = document.createElement('div');
    comingSoon.className = 'coming-soon';
    comingSoon.textContent = 'More scripts coming soon...';
    container.appendChild(comingSoon);
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;");
}

function searchCode() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const blocks = document.querySelectorAll('.code-block');
    const comingSoon = document.querySelector('.coming-soon');
    
    blocks.forEach(block => {
        const title = block.getAttribute('data-title');
        const code = block.querySelector('code').textContent.toLowerCase();
        const isVisible = title.includes(query) || code.includes(query);
        block.classList.toggle('hidden', !isVisible);
    });
    
    if (comingSoon) {
        comingSoon.classList.toggle('hidden', query.length > 0);
    }
}

function copyCode(button) {
    const code = button.previousElementSibling.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const original = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = original, 1500);
    });
}

function showError(message) {
    const container = document.getElementById('codeContainer');
    container.innerHTML = `<div style="text-align: center; padding: 3rem; color: #ef4444;">${message}</div>`;
}

document.addEventListener('DOMContentLoaded', fetchData);
