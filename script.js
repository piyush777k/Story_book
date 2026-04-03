// ==========================================
// A Story I Didn't Plan — Interactive Book
// ==========================================

// Track current state
let currentPage = 0; // 0 = no pages turned (cover showing)
const totalPages = 7;
let isAnimating = false;
let bgmStarted = false;

// ------- Page Turning -------
function turnPage(pageNum, direction) {
    if (isAnimating) return;
    isAnimating = true;

    const page = document.getElementById(`page-${pageNum}`);
    if (!page) { isAnimating = false; return; }

    if (direction === 'next') {
        page.classList.add('turned', 'turning-next');
        currentPage = pageNum;
    } else if (direction === 'prev') {
        page.classList.remove('turned');
        page.classList.add('turning-prev');
        currentPage = pageNum - 1;
    }

    // Play subtle sound
    playPageSound();

    // Auto-start BGM on first interaction
    tryAutoStartBgm();

    // Remove animation class after transition
    setTimeout(() => {
        page.classList.remove('turning-next', 'turning-prev');
        isAnimating = false;
    }, 850);
}

// Helper functions for buttons
function goNext(fromPageNum) {
    turnPage(fromPageNum, 'next');
}

function goPrev() {
    if (currentPage > 0) {
        turnPage(currentPage, 'prev');
    } else {
        isAnimating = false;
    }
}

// ------- Page Turn Sound -------
const pageTurnAudio = new Audio('page-turn.mp3');
pageTurnAudio.volume = 0.6;

function playPageSound() {
    try {
        pageTurnAudio.currentTime = 0;
        pageTurnAudio.play().catch(() => {});
    } catch (e) {
        // Audio not supported, silent
    }
}

// ------- Background Music -------
const bgMusic = document.getElementById('bgMusic');

if (bgMusic) {
    bgMusic.volume = 0;
}

function fadeInBgm() {
    if (!bgMusic) return;
    let vol = 0;
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});
    const fadeInterval = setInterval(() => {
        vol += 0.02;
        if (vol >= 0.45) {
            vol = 0.45;
            clearInterval(fadeInterval);
        }
        bgMusic.volume = vol;
    }, 50);
}

// Auto-start music on first page turn
function tryAutoStartBgm() {
    if (!bgmStarted && bgMusic) {
        fadeInBgm();
        bgmStarted = true;
    }
}

// ------- Keyboard Navigation -------
document.addEventListener('keydown', (e) => {
    if (isAnimating) return;
    
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        const nextPage = currentPage + 1;
        if (nextPage <= totalPages) {
            turnPage(nextPage, 'next');
        }
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentPage > 0) {
            turnPage(currentPage, 'prev');
        }
    } else if (e.key === 'Escape') {
        closeEnding();
    }
});

// ------- Swipe Support for Mobile -------
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) < swipeThreshold) return;
    if (isAnimating) return;
    
    if (diff > 0) {
        // Swipe left = next page
        const nextPage = currentPage + 1;
        if (nextPage <= totalPages) {
            turnPage(nextPage, 'next');
        }
    } else {
        // Swipe right = prev page
        if (currentPage > 0) {
            turnPage(currentPage, 'prev');
        }
    }
}

// ------- Ending Overlays -------
function showEnding(type) {
    let overlay;
    switch (type) {
        case 'yes':
            overlay = document.getElementById('endingYes');
            startHeartsRain();
            startSparkles();
            break;
        case 'time':
            overlay = document.getElementById('endingTime');
            break;
        case 'no':
            overlay = document.getElementById('endingNo');
            break;
    }
    
    if (overlay) {
        overlay.classList.add('active');
    }
}

function closeEnding() {
    document.querySelectorAll('.ending-overlay').forEach(el => {
        el.classList.remove('active');
    });
    stopHeartsRain();
}

// ------- Hearts Rain Effect -------
let heartsInterval = null;

function startHeartsRain() {
    const container = document.getElementById('heartsRain');
    if (!container) return;
    
    const hearts = ['💕', '💖', '💗', '💓', '✨', '💝', '🌸'];
    
    heartsInterval = setInterval(() => {
        const heart = document.createElement('span');
        heart.className = 'falling-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (3 + Math.random() * 3) + 's';
        heart.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
        container.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => heart.remove(), 6000);
    }, 250);
}

function stopHeartsRain() {
    if (heartsInterval) {
        clearInterval(heartsInterval);
        heartsInterval = null;
    }
    const container = document.getElementById('heartsRain');
    if (container) container.innerHTML = '';
}

// ------- Sparkles Effect -------
function startSparkles() {
    const container = document.getElementById('yesParticles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        sparkle.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
        container.appendChild(sparkle);
    }
}

// ------- Ambient Background Particles -------
function createAmbientParticles() {
    const container = document.getElementById('ambientParticles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ------- Initialize -------
document.addEventListener('DOMContentLoaded', () => {
    createAmbientParticles();
    
    // Add a subtle entrance animation to the book
    const book = document.getElementById('book');
    if (book) {
        book.style.opacity = '0';
        book.style.transform = 'scale(0.9)';
        book.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            book.style.opacity = '1';
            book.style.transform = 'scale(1)';
        }, 300);
    }
});
