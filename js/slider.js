class Slider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');

        prevBtn?.addEventListener('click', () => this.prevSlide());
        nextBtn?.addEventListener('click', () => this.nextSlide());

        this.startAutoPlay();
        this.addTouchSupport();
    }

    showSlide(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = 0;
        });

        this.slides[index].classList.add('active');
        this.slides[index].style.opacity = 1;

        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        const slider = document.querySelector('.slider-container');
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, false);

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        }, false);

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }
    }
}

// Inicializar el slider cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new Slider();
}); 