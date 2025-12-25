// Вопросы викторины по Stalcraft
const quizQuestions = [
    {
        question: "Как называется главная локация в Stalcraft?",
        answers: ["Зона", "Чернобыль", "Припять", "Аномальная зона"],
        correct: 0
    },
    {
        question: "Какой артефакт даёт защиту от радиации?",
        answers: ["Каменный цветок", "Лунный свет", "Пузырь", "Мясорубка"],
        correct: 2
    },
    {
        question: "Какие фракции существуют в игре?",
        answers: ["Стрелковцы и Бандиты", "Свобода и Долг", "Наёмники и Военные", "Все вышеперечисленные"],
        correct: 3
    },
    {
        question: "Что такое аномалия 'Грави'?",
        answers: ["Электрическая аномалия", "Гравитационная аномалия", "Термическая аномалия", "Химическая аномалия"],
        correct: 1
    },
    {
        question: "Как называется оружие, которое стреляет артефактами?",
        answers: ["Артефакт-пушка", "Эмиттер", "Гаусс-пушка", "Плазменная пушка"],
        correct: 1
    },
    {
        question: "Где находится база Стрелковцев?",
        answers: ["Ростов", "Кордон", "Даркволл", "Ростов-на-Дону"],
        correct: 3
    },
    {
        question: "Что такое 'сталкер' в игре?",
        answers: ["Охотник за артефактами", "Военный", "Учёный", "Торговец"],
        correct: 0
    },
    {
        question: "Какая валюта используется в игре?",
        answers: ["Рубли", "Доллары", "Евро", "Рубли и Доллары"],
        correct: 3
    },
    {
        question: "Что происходит при попадании в аномалию?",
        answers: ["Мгновенная смерть", "Урон здоровью", "Ничего", "Зависит от типа аномалии"],
        correct: 3
    },
    {
        question: "Как называется система улучшения оружия?",
        answers: ["Модификация", "Апгрейд", "Тюнинг", "Улучшение"],
        correct: 1
    }
];

// Состояние приложения
let currentQuestion = 0;
let correctAnswers = 0;
let currentCrackPage = 0;
let totalCrackPages = 0;
let snowflakeSpeed = 2000; // миллисекунды для падения
let snowflakeCount = 5; // начальное количество снежинок
let audioContext = null;
let collectedSnowflakes = 0; // Счетчик собранных снежинок
let neededSnowflakes = 0; // Нужное количество снежинок для перехода
let crackInterval = null; // Интервал для постепенного появления трещин
let snowflakeInterval = null; // Интервал для создания новых снежинок
let activeSnowflakes = 0; // Количество активных снежинок на экране
let maxActiveSnowflakes = 8; // Максимальное количество снежинок одновременно
let scrimerHits = 0; // Счетчик ударов по скримеру
let backgroundMusic = null; // Элемент фоновой музыки (Last Christmas)
let horrorMusic = null; // Элемент музыки ужасов
let scrimerMusic = null; // Элемент музыки скримера
let totalScore = 0; // Общий счет очков
let previousMusicVolume = 0.3; // Предыдущая громкость музыки
let horrorVolume = 0; // Громкость horror музыки (начинается с 0)
let christmasVolume = 0.3; // Громкость Christmas музыки
let giftButtonEscapes = 0; // Счетчик побегов кнопки

// Инициализация аудио контекста
function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('AudioContext not supported');
        }
    }
    return audioContext;
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initMainPage();
    initButtons();
    initBackgroundMusic();
    // Инициализируем аудио при первом клике
    document.addEventListener('click', () => {
        initAudioContext();
        startBackgroundMusic();
    }, { once: true });
});

// Инициализация фоновой музыки
function initBackgroundMusic() {
    backgroundMusic = document.getElementById('background-music');
    horrorMusic = document.getElementById('horror-music');
    scrimerMusic = document.getElementById('scrimer-music');
    
    if (backgroundMusic) {
        backgroundMusic.volume = christmasVolume; // Громкость 30%
        backgroundMusic.load();
    }
    
    if (horrorMusic) {
        horrorMusic.volume = 0; // Начинаем с 0
        horrorMusic.load();
    }
    
    if (scrimerMusic) {
        scrimerMusic.volume = 0.5;
        scrimerMusic.load();
    }
}

// Запуск фоновой музыки
function startBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
            console.log('Не удалось воспроизвести фоновую музыку:', error);
        });
    }
    if (horrorMusic) {
        horrorMusic.play().catch(error => {
            console.log('Не удалось воспроизвести horror музыку:', error);
        });
    }
}

// Инициализация главной страницы
function initMainPage() {
    const snowflakesContainer = document.querySelector('.snowflakes');
    createSnowflakes(snowflakesContainer, 5); // Чуть больше снежинок
}

// Создание снежинок
function createSnowflakes(container, count) {
    const symbols = ['❄', '❅', '❆', '✻', '✼'];
    for (let i = 0; i < count; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = (Math.random() * 3 + 4) + 's'; // Ускорено (4-7 секунд вместо 8-13)
        snowflake.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(snowflake);
    }
}

// Инициализация кнопок
function initButtons() {
    const startBtn = document.getElementById('start-btn');
    const answerBtn = document.getElementById('answer-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startQuiz);
    }
    if (answerBtn) {
        answerBtn.addEventListener('click', handleSantaAnswer);
    }
}

// Начало викторины
function startQuiz() {
    currentQuestion = 0;
    correctAnswers = 0;
    totalScore = 0; // Сброс очков при начале новой игры
    showPage('quiz-page');
    displayQuestion();
}

// Отображение вопроса
function displayQuestion() {
    const question = quizQuestions[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('question-number').textContent = currentQuestion + 1;
    
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.addEventListener('click', () => handleAnswer(index));
        answersContainer.appendChild(button);
    });
}

// Обработка ответа
function handleAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');
    
    // Отключаем все кнопки
    buttons.forEach(btn => btn.disabled = true);
    
    // Подсвечиваем правильный и неправильный ответы
    if (selectedIndex === question.correct) {
        buttons[selectedIndex].classList.add('correct');
        correctAnswers++;
        playCorrectSound(); // Звук правильного ответа
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[question.correct].classList.add('correct');
        playIncorrectSound(); // Звук неправильного ответа
    }
    
    // Переход к следующему вопросу через 1.5 секунды
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
            displayQuestion();
        } else {
            showQuizResult();
        }
    }, 1500);
}

// Показать результаты викторины
function showQuizResult() {
    showPage('quiz-result-page');
    document.getElementById('quiz-result-number').textContent = correctAnswers;
    setTimeout(() => {
        startCracksPages();
    }, 2000); // Показываем 2 секунды
}

// Начало страниц с трещинами
function startCracksPages() {
    totalCrackPages = correctAnswers;
    currentCrackPage = 0;
    if (totalCrackPages > 0) {
        showCrackPage();
    } else {
        // Если нет правильных ответов, сразу к скримеру
        showScrimer();
    }
}

// Показать страницу с трещинами
function showCrackPage() {
    showPage('cracks-pages');
    
    // Сброс состояния
    const container = document.getElementById('interactive-snowflakes');
    const cracksOverlay = document.getElementById('cracks-overlay');
    container.innerHTML = '';
    cracksOverlay.innerHTML = '';
    cracksOverlay.classList.remove('active');
    collectedSnowflakes = 0;
    activeSnowflakes = 0;
    
    // Останавливаем предыдущие интервалы
    if (snowflakeInterval) {
        clearInterval(snowflakeInterval);
    }
    if (crackInterval) {
        clearInterval(crackInterval);
    }
    
    // Вычисляем нужное количество снежинок: 5 + 2*N (где N - номер страницы, начиная с 0)
    neededSnowflakes = 5 + 2 * currentCrackPage;
    
    // Увеличение сложности - меняется только скорость появления (ускорено)
    const baseSpeed = 4000; // Было 8000, ускорено в 2 раза
    snowflakeSpeed = Math.max(3000, baseSpeed + currentCrackPage * 250); // Быстрее (было 6000, стало 3000)
    
    // Скорость появления новых снежинок (чем выше страница, тем реже появляются)
    const spawnInterval = Math.max(1000, 2000 - currentCrackPage * 100); // От 2 сек до 1 сек
    
    // Создаем начальные снежинки
    const initialCount = 5;
    for (let i = 0; i < initialCount; i++) {
        createSingleSnowflake(container);
    }
    
    // Запускаем бесконечное создание снежинок
    snowflakeInterval = setInterval(() => {
        if (activeSnowflakes < maxActiveSnowflakes) {
            createSingleSnowflake(container);
        }
    }, spawnInterval);
    
    // Запуск постепенного появления трещин
    startGradualCracks(cracksOverlay);
    
    // Управление музыкой на страницах с трещинами
    updateMusicForCracksPage();
}

// Обновление музыки для страниц с трещинами
function updateMusicForCracksPage() {
    // Увеличиваем horror музыку на 15% с каждой страницей
    horrorVolume = Math.min(1, horrorVolume + 0.15);
    if (horrorMusic) {
        horrorMusic.volume = horrorVolume;
    }
    
    // Уменьшаем Christmas музыку на 8% с каждой страницей
    christmasVolume = Math.max(0, christmasVolume - 0.08);
    if (backgroundMusic) {
        backgroundMusic.volume = christmasVolume;
    }
}

// Постепенное появление трещин
function startGradualCracks(container) {
    // Очищаем предыдущий интервал
    if (crackInterval) {
        clearInterval(crackInterval);
    }
    
    // Количество трещин увеличивается с каждой страницей (в 10 раз больше)
    const baseCracks = 100; // В 10 раз больше
    const cracksPerPage = 200; // В 10 раз больше
    const totalCracks = baseCracks + currentCrackPage * cracksPerPage;
    
    let cracksCreated = 0;
    
    // Создаем трещины постепенно каждые 2 секунды
    crackInterval = setInterval(() => {
        if (cracksCreated < totalCracks) {
            createSingleCrack(container);
            cracksCreated++;
        } else {
            clearInterval(crackInterval);
        }
    }, 2000); // Каждые 2 секунды новая трещина
}

// Создание одной снежинки
function createSingleSnowflake(container) {
    const symbols = ['❄', '❅', '❆', '✻', '✼'];
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake-interactive';
    snowflake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = (snowflakeSpeed / 1000) + 's';
    snowflake.style.animationDelay = '0s';
    
    activeSnowflakes++;
    
    // Удаляем снежинку когда она уходит за экран
    const animationDuration = snowflakeSpeed / 1000;
    setTimeout(() => {
        if (snowflake.parentNode && !snowflake.classList.contains('broken')) {
            snowflake.remove();
            activeSnowflakes--;
        }
    }, animationDuration * 1000);
    
    snowflake.addEventListener('click', () => {
        if (!snowflake.classList.contains('broken')) {
            snowflake.classList.add('broken');
            playSnowflakeSound();
            collectedSnowflakes++;
            activeSnowflakes--;
            
            // Даем 10 очков за каждую снежинку
            totalScore += 10;
            
            // Удаляем снежинку через небольшую задержку после анимации
            setTimeout(() => {
                if (snowflake.parentNode) {
                    snowflake.remove();
                }
            }, 500);
            
            // Проверяем, собрали ли нужное количество
            if (collectedSnowflakes >= neededSnowflakes) {
                // Останавливаем создание трещин и снежинок
                if (crackInterval) {
                    clearInterval(crackInterval);
                }
                if (snowflakeInterval) {
                    clearInterval(snowflakeInterval);
                }
                // Переход к следующей странице
                setTimeout(() => {
                    currentCrackPage++;
                    if (currentCrackPage < totalCrackPages) {
                        showCrackPage();
                    } else {
                        showScrimer();
                    }
                }, 500);
            }
        }
    });
    
    container.appendChild(snowflake);
}

// Создание одной трещины
function createSingleCrack(container) {
    const crack = document.createElement('div');
    crack.className = 'crack';
    
    // Случайная позиция и размер
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const length = 150 + Math.random() * 300; // Длиннее трещины
    const angle = Math.random() * 360;
    
    crack.style.left = x + '%';
    crack.style.top = y + '%';
    crack.style.width = length + 'px';
    crack.style.height = '2px';
    crack.style.transform = `rotate(${angle}deg)`;
    crack.style.transformOrigin = '0 50%';
    
    container.appendChild(crack);
    
    // Активация overlay при первой трещине
    if (!container.classList.contains('active')) {
        container.classList.add('active');
    }
    
    // Звук трещины
    playCrackSound();
}

// Показать скример
function showScrimer() {
    showPage('scrimer-page');
    scrimerHits = 0; // Сброс счетчика
    const hitCountElement = document.getElementById('scrimer-hit-count');
    if (hitCountElement) {
        hitCountElement.textContent = scrimerHits;
    }
    
    // Останавливаем все музыки и включаем только скример
    if (backgroundMusic) {
        previousMusicVolume = backgroundMusic.volume;
        backgroundMusic.pause();
    }
    if (horrorMusic) {
        horrorMusic.pause();
    }
    if (scrimerMusic) {
        scrimerMusic.currentTime = 0;
        scrimerMusic.play().catch(error => {
            console.log('Не удалось воспроизвести музыку скримера:', error);
        });
    }
    
    // Звук скримера
    playScrimerSound();
    
    // Добавляем обработчик кликов по скримеру
    const scrimerImage = document.getElementById('scrimer-image');
    const scrimerPage = document.getElementById('scrimer-page');
    
    let timeoutId = null;
    
    const handleScrimerClick = (e) => {
        e.stopPropagation();
        scrimerHits++;
        if (hitCountElement) {
            hitCountElement.textContent = scrimerHits;
        }
        
        // Визуальный эффект при клике
        if (scrimerImage) {
            scrimerImage.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (scrimerImage) {
                    scrimerImage.style.transform = 'scale(1)';
                }
            }, 100);
        }
        
        // Звук удара
        playHitSound();
        
        // Если набрали 15 ударов, переходим дальше
        if (scrimerHits >= 15) {
            if (scrimerPage) {
                scrimerPage.removeEventListener('click', handleScrimerClick);
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            // Останавливаем музыку скримера
            if (scrimerMusic) {
                scrimerMusic.pause();
            }
            setTimeout(() => {
                showScorePage();
            }, 300);
        }
    };
    
    // Добавляем обработчик на всю страницу
    if (scrimerPage) {
        scrimerPage.addEventListener('click', handleScrimerClick);
    }
    
    // Если через 15 секунд не набрали 10 ударов, переходим автоматически
    timeoutId = setTimeout(() => {
        if (scrimerHits < 10 && scrimerPage) {
            scrimerPage.removeEventListener('click', handleScrimerClick);
            // Останавливаем музыку скримера
            if (scrimerMusic) {
                scrimerMusic.pause();
            }
            showScorePage();
        }
    }, 15000);
}

// Показать страницу с очками
function showScorePage() {
    showPage('score-page');
    document.getElementById('score-display').textContent = totalScore;
    
    // Показываем страницу 3 секунды, затем проверяем очки
    setTimeout(() => {
        if (totalScore >= 400) {
            showPage('santa-page');
        } else {
            // Возвращаем на главную страницу
            resetToStart();
        }
    }, 3000);
}

// Сброс на главную страницу
function resetToStart() {
    // Сброс всех переменных
    currentQuestion = 0;
    correctAnswers = 0;
    currentCrackPage = 0;
    totalCrackPages = 0;
    collectedSnowflakes = 0;
    activeSnowflakes = 0;
    scrimerHits = 0;
    totalScore = 0;
    horrorVolume = 0; // Сброс громкости horror
    christmasVolume = 0.3; // Сброс громкости Christmas
    giftButtonEscapes = 0; // Сброс счетчика побегов
    
    // Остановка всех интервалов
    if (crackInterval) {
        clearInterval(crackInterval);
        crackInterval = null;
    }
    if (snowflakeInterval) {
        clearInterval(snowflakeInterval);
        snowflakeInterval = null;
    }
    
    // Сброс музыки
    if (backgroundMusic) {
        backgroundMusic.volume = christmasVolume;
        backgroundMusic.pause();
    }
    if (horrorMusic) {
        horrorMusic.volume = 0;
        horrorMusic.pause();
    }
    if (scrimerMusic) {
        scrimerMusic.pause();
    }
    
    // Возврат на главную страницу
    showPage('main-page');
    
    // Пересоздаем снежинки на главной
    const snowflakesContainer = document.querySelector('.snowflakes');
    if (snowflakesContainer) {
        snowflakesContainer.innerHTML = '';
        createSnowflakes(snowflakesContainer, 5);
    }
}

// Обработка ответа Деду Морозу
function handleSantaAnswer() {
    const input = document.getElementById('behavior-input');
    if (input.value.trim()) {
        // Проверяем очки перед показом финальной страницы
        if (totalScore >= 400) {
            // Останавливаем horror музыку, включаем только Christmas
            if (horrorMusic) {
                horrorMusic.pause();
            }
            if (backgroundMusic) {
                backgroundMusic.volume = 0.3; // Возвращаем нормальную громкость
                if (backgroundMusic.paused) {
                    backgroundMusic.play();
                }
            }
            
            showPage('final-page');
            // Добавляем снежинки на финальную страницу
            const snowflakesContainer = document.querySelector('.snowflakes-final');
            if (snowflakesContainer) {
                createSnowflakes(snowflakesContainer, 8);
            }
            
            // Инициализируем кнопку подарка
            initGiftButton();
        } else {
            // Если очков недостаточно, возвращаем на главную
            resetToStart();
        }
    } else {
        alert('Пожалуйста, ответь на вопрос!');
    }
}

// Инициализация кнопки подарка
function initGiftButton() {
    const giftButton = document.getElementById('get-gift-btn');
    if (!giftButton) return;
    
    giftButtonEscapes = 0;
    giftButton.style.position = 'relative';
    giftButton.style.transition = 'none';
    
    // Удаляем старые обработчики если они есть
    const newButton = giftButton.cloneNode(true);
    giftButton.parentNode.replaceChild(newButton, giftButton);
    
    // Добавляем обработчики на новую кнопку
    newButton.addEventListener('click', handleGiftButtonClick);
    newButton.addEventListener('mouseenter', handleGiftButtonHover);
    newButton.addEventListener('touchstart', handleGiftButtonTouch, { passive: false });
}

// Обработка наведения на кнопку (для десктопа)
function handleGiftButtonHover(e) {
    if (giftButtonEscapes < 5) {
        e.preventDefault();
        escapeButton(e.target);
    }
}

// Обработка касания кнопки (для мобильных)
function handleGiftButtonTouch(e) {
    if (giftButtonEscapes < 5) {
        e.preventDefault();
        escapeButton(e.target);
    }
}

// Убегание кнопки
function escapeButton(button) {
    if (giftButtonEscapes >= 5) return;
    
    giftButtonEscapes++;
    
    // Получаем размеры контейнера
    const giftBox = button.closest('.gift-box');
    const container = giftBox || document.querySelector('.final-content') || document.querySelector('.final-container');
    const containerRect = container ? container.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    const buttonRect = button.getBoundingClientRect();
    
    // Случайная позиция в пределах контейнера
    const maxX = Math.max(0, containerRect.width - buttonRect.width - 20);
    const maxY = Math.max(0, containerRect.height - buttonRect.height - 20);
    
    const newX = Math.max(0, Math.random() * maxX);
    const newY = Math.max(0, Math.random() * maxY);
    
    // Плавное перемещение
    button.style.transition = 'all 0.3s ease';
    button.style.position = 'absolute';
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';
    button.style.zIndex = '1000';
    
    // После 5 побегов кнопка останавливается
    if (giftButtonEscapes >= 5) {
        setTimeout(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.position = 'relative';
            button.style.left = 'auto';
            button.style.top = 'auto';
            button.style.transform = 'scale(1.1)';
            button.style.zIndex = '10';
            button.textContent = 'Получить ✓';
        }, 300);
    }
}

// Обработка клика по кнопке
function handleGiftButtonClick(e) {
    if (giftButtonEscapes < 5) {
        e.preventDefault();
        e.stopPropagation();
        escapeButton(e.target);
        return false;
    } else {
        e.target.textContent = 'Получено! 🎁';
        e.target.disabled = true;
        e.target.style.opacity = '0.7';
        e.target.style.cursor = 'not-allowed';
        // Здесь можно добавить логику получения подарка
    }
}

// Звуковые эффекты
function playCrackSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        // Возобновляем контекст если он приостановлен
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playScrimerSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        // Возобновляем контекст если он приостановлен
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        
        // Страшный звук - комбинация низких и высоких частот
        const oscillator1 = ctx.createOscillator();
        const oscillator2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const gainNode2 = ctx.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode2);
        gainNode.connect(ctx.destination);
        gainNode2.connect(ctx.destination);
        
        // Низкий страшный звук
        oscillator1.type = 'sawtooth';
        oscillator1.frequency.setValueAtTime(80, ctx.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
        
        // Высокий резкий звук
        oscillator2.type = 'square';
        oscillator2.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        gainNode2.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator1.start(ctx.currentTime);
        oscillator2.start(ctx.currentTime);
        oscillator1.stop(ctx.currentTime + 0.5);
        oscillator2.stop(ctx.currentTime + 0.3);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playCorrectSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playIncorrectSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playHitSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playSnowflakeSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        // Возобновляем контекст если он приостановлен
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

// Переключение страниц
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}
