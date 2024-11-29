const feed = document.getElementById('feed');
const zoomControls = document.getElementById('zoomControls');
// Изображений 42
const totalItems = 42;

// Функция создания поста с расширенным зумом
function createPost(imageUrl) {
    const post = document.createElement('div');
    post.className = 'post';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Пост';

    // Переменные для мультитача
    let initialTouches = [];
    let initialDistance = 0;
    let currentScale = 1;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    let initialTranslate = { x: 0, y: 0 };

    // Сброс зума
    function resetZoom() {
        currentScale = 1;
        currentTranslateX = 0;
        currentTranslateY = 0;
        updateImageTransform();
    }

    // Обновление трансформации изображения
    function updateImageTransform() {
        img.style.transform = `scale(${currentScale}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
    }

    // Обработчик начала мультитача
    img.addEventListener('touchstart', (e) => {
        initialTouches = Array.from(e.touches);
        
        if (e.touches.length === 2) {
            // Вычисление начальной дистанции между пальцами
            initialDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );

            // Центр зума
            const centerX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
            const centerY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
            initialTranslate = { x: centerX, y: centerY };
        }
    });

    // Обработчик движения при мультитаче
    img.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            // Новая дистанция между пальцами
            const newDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );

            // Вычисление нового масштаба
            const newScale = currentScale * (newDistance / initialDistance);
            currentScale = Math.max(1, Math.min(newScale, 5)); // Ограничение зума

            // Вычисление смещения
            const centerX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
            const centerY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
            
            currentTranslateX += (centerX - initialTranslate.x) * (currentScale - 1);
            currentTranslateY += (centerY - initialTranslate.y) * (currentScale - 1);

            initialDistance = newDistance;
            initialTranslate = { x: centerX, y: centerY };

            updateImageTransform();
        } else if (e.touches.length === 1 && currentScale > 1) {
            // Перемещение изображения при зуме
            const touch = e.touches[0];
            const initialTouch = initialTouches[0];

            currentTranslateX += touch.pageX - initialTouch.pageX;
            currentTranslateY += touch.pageY - initialTouch.pageY;

            initialTouches = [touch];
            updateImageTransform();
        }
    });

    // Кнопки управления зумом
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetZoomBtn = document.getElementById('resetZoom');

    zoomInBtn.addEventListener('click', () => {
        currentScale = Math.min(currentScale + 0.5, 5);
        updateImageTransform();
    });

    zoomOutBtn.addEventListener('click', () => {
        currentScale = Math.max(currentScale - 0.5, 1);
        updateImageTransform();
    });

    resetZoomBtn.addEventListener('click', resetZoom);

    imageContainer.appendChild(img);
    post.appendChild(imageContainer);
    return post;
}

// Инициализация первой партии изображений
function loadInitialPosts() {
    for (let i = 1; i <= 5; i++) {
        const paddedIndex = i.toString().padStart(2, '0');
        const fileName = `images/ПОДПИСНОЙ оптовый двор каталог 2024 от 3 апреля_page-00${paddedIndex}.jpg`;
        const post = createPost(fileName);
        feed.appendChild(post);
    }
}

// Ленивая загрузка
function setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentCount = feed.childElementCount;
                for (let i = currentCount + 1; i <= Math.min(currentCount + 5, totalItems); i++) {
                    const paddedIndex = i.toString().padStart(2, '0');
                    const fileName = `images/ПОДПИСНОЙ оптовый двор каталог 2024 от 3 апреля_page-00${paddedIndex}.jpg`;
                    const post = createPost(fileName);
                    feed.appendChild(post);
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    const lastPost = document.querySelector('.post:last-child');
    if (lastPost) observer.observe(lastPost);
}

// Инициализация
loadInitialPosts();
setupInfiniteScroll();