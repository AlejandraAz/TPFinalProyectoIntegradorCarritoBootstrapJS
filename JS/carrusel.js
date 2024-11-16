let posicionInicial = 0;
mostrarSlide(posicionInicial);

function cambiarSlide(n) {
    mostrarSlide(posicionInicial += n);
}

function mostrarSlide(n) {
    const slides = document.querySelectorAll('.slide');
    if (n >= slides.length) { posicionInicial = 0; }
    if (n < 0) { posicionInicial = slides.length - 1; }
    
    slides.forEach((slide, index) => {
        slide.style.display = (index === posicionInicial) ? 'block' : 'none';
    });
}

// Cambiar automáticamente cada 5 segundos
setInterval(() => {
    cambiarSlide(1);
}, 5000);