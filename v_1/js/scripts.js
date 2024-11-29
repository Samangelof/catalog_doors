document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const progressBar = document.getElementById('progressBar');
    const instruction = document.getElementById('instruction');
    
    let currentIndex = 0;
    const totalItems = 42;
    let touchStartY = 0;
    let initialDistance = 0;
    let currentScale = 1;

    function hideInstruction() {
        instruction.classList.add('hidden');
    }

    function addBounceToInstruction() {
        instruction.classList.add('bounce');
    }

    function populateGallery() {
        const template = gallery.querySelector('.gallery-item');
        if (!template) {
            console.error("Шаблон .gallery-item не найден!");
            return;
        }

        for (let i = 2; i <= totalItems; i++) {
            const clone = template.cloneNode(true);
            const paddedIndex = i.toString().padStart(2, '0');
            const fileName = `images/ПОДПИСНОЙ оптовый двор каталог 2024 от 3 апреля_page-00${paddedIndex}.jpg`;
            clone.querySelector('img').src = fileName;
            gallery.appendChild(clone);
        }
    }

    function updateProgressBar() {
        const maxScroll = gallery.scrollHeight - gallery.clientHeight;
        if (maxScroll <= 0) return;
        
        const scrollProgress = (gallery.scrollTop / maxScroll) * 100;
        progressBar.style.width = `${scrollProgress}%`;
    }

    function scrollToCurrentIndex() {
        const itemHeight = gallery.querySelector('.gallery-item').clientHeight;
        const targetScroll = currentIndex * itemHeight;
        
        gallery.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    }

    function handleScroll(delta) {
        if (delta > 0) {
            currentIndex = Math.min(currentIndex + 1, totalItems - 1);
        } else {
            currentIndex = Math.max(currentIndex - 1, 0);
        }
        
        scrollToCurrentIndex();
        hideInstruction();
    }

    // Обработчик касаний для мобильных
    gallery.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;

        if (e.touches.length === 2) { // Если два пальца, начинаем жест масштабирования
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            initialDistance = Math.sqrt(dx * dx + dy * dy);
        }
    }, { passive: true });

    gallery.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) { // Масштабируем с помощью двух пальцев
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const newDistance = Math.sqrt(dx * dx + dy * dy);
            
            const scaleChange = newDistance / initialDistance;
            currentScale *= scaleChange;
            currentScale = Math.min(Math.max(1, currentScale), 3); // Ограничиваем масштаб от 1 до 3
            gallery.style.transform = `scale(${currentScale})`; // Применяем масштаб
            initialDistance = newDistance;
        }
    }, { passive: false });

    gallery.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaY) > 50) {
                handleScroll(deltaY);
            }
        }
    }, { passive: true });

    // Обновление прогресс-бара при прокрутке
    gallery.addEventListener('scroll', updateProgressBar);

    // Инициализация наблюдателя для изображений
    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Инициализация
    populateGallery();
    addBounceToInstruction();

    // Наблюдение за изображениями
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach(img => observer.observe(img));

    // Убираем дефолтное поведение скролла
    gallery.style.overscrollBehavior = 'contain';
});
