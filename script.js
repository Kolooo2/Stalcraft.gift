// Улучшенные вопросы викторины по Stalcraft с более интересными и разнообразными вопросами
const quizQuestions = [
    {
        question: "Какую фракцию называют 'борцами за свободу Зоны', выступающую против военного контроля?",
        answers: ["Долг", "Свобода", "Бандиты", "Монолит"],
        correct: 1
    },
    {
        question: "Какой артефакт в Stalcraft известен своей способностью восстанавливать здоровье, но при этом накапливает радиацию?",
        answers: ["Каменный цветок", "Душа", "Медуза", "Кровь камня"],
        correct: 2
    },
    {
        question: "Как называется опасная гравитационная аномалия, которая притягивает и разрывает всё, что попадает в её радиус?",
        answers: ["Трамплин", "Воронка", "Электра", "Жарка"],
        correct: 1
    },
    {
        question: "Какое событие в игре происходит каждые несколько часов и заставляет всех сталкеров искать укрытие?",
        answers: ["Рейд", "Выброс", "Гон мутантов", "Ночной шторм"],
        correct: 1
    },
    {
        question: "Какой мутант в Зоне известен своей способностью становиться невидимым и внезапно атаковать?",
        answers: ["Кровосос", "Псевдогигант", "Контролёр", "Бюрер"],
        correct: 0
    },
    {
        question: "Как называется редкий артефакт, который значительно увеличивает выносливость сталкера?",
        answers: ["Пружина", "Батарейка", "Ломоть мяса", "Вывих"],
        correct: 0
    },
    {
        question: "Какая группировка считает Зону священным местом и защищает подходы к центру ЧАЭС?",
        answers: ["Военные", "Учёные", "Монолит", "Наёмники"],
        correct: 2
    },
    {
        question: "Что такое 'детектор аномалий' и для чего он используется в Зоне?",
        answers: [
            "Для поиска артефактов и обнаружения аномалий",
            "Для связи с другими сталкерами",
            "Для измерения уровня радиации",
            "Для ночного видения"
        ],
        correct: 0
    },
    {
        question: "Какой тип оружия в Stalcraft считается наиболее эффективным против мутантов в ближнем бою?",
        answers: ["Снайперская винтовка", "Пистолет", "Дробовик", "Автомат"],
        correct: 2
    },
    {
        question: "Как называется система улучшения снаряжения, позволяющая усилить характеристики оружия и брони?",
        answers: ["Крафтинг", "Модификация", "Апгрейд", "Тюнинг"],
        correct: 2
    }
];

// Состояние приложения
let currentQuestion = 0;
let correctAnswers = 0;
let currentCrackPage = 0;
let totalCrackPages = 0;
let snowflakeSpeed = 2000;
let snowflakeCount = 5;
let audioContext = null;
let collectedSnowflakes = 0;
let neededSnowflakes = 0;
let crackInterval = null;
let snowflakeInterval = null;
let activeSnowflakes = 0;
let maxActiveSnowflakes = 10;
let scrimerHits = 0;
let backgroundMusic = null;
let horrorMusic = null;
let scrimerMusic = null;
let totalScore = 0;
let previousMusicVolume = 0.27;
let horrorVolume = 0;
let christmasVolume = 0.27;
let giftButtonEscapes = 0;

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
    document.addEventListener('click', () => {
        initAudioContext();
        startBackgroundMusic();
    }, { once: true });
});

// Консольные команды для тестирования
window.skipToScrimer = function () {
    console.log('[DEBUG] Переход к скримеру...');
    if (crackInterval) clearInterval(crackInterval);
    if (snowflakeInterval) clearInterval(snowflakeInterval);
    totalScore = 500;
    showScrimer();
};

window.skipToFinal = function () {
    console.log('[DEBUG] Переход к финалу...');
    totalScore = 500;
    showPage('final-page');
    const snowflakesContainer = document.querySelector('.snowflakes-final');
    if (snowflakesContainer) {
        snowflakesContainer.innerHTML = '';
        createSnowflakes(snowflakesContainer, 20);
    }
    initGiftButton();
};

console.log('[DEBUG] Доступные команды: skipToScrimer(), skipToFinal()');

// Инициализация фоновой музыки
function initBackgroundMusic() {
    backgroundMusic = document.getElementById('background-music');
    horrorMusic = document.getElementById('horror-music');
    scrimerMusic = document.getElementById('scrimer-music');

    if (backgroundMusic) {
        backgroundMusic.volume = christmasVolume;
        backgroundMusic.load();
    }

    if (horrorMusic) {
        horrorMusic.volume = 0;
        horrorMusic.load();
    }

    if (scrimerMusic) {
        scrimerMusic.volume = 0.45;
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
    if (snowflakesContainer) {
        createSnowflakes(snowflakesContainer, 15);
    }
}

// Создание снежинок с улучшенными эффектами
function createSnowflakes(container, count) {
    const symbols = ['*', '+', '·', '×', '°', '•'];
    for (let i = 0; i < count; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = (Math.random() * 5 + 6) + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        snowflake.style.fontSize = (Math.random() * 1.5 + 1) + 'em';
        snowflake.style.opacity = Math.random() * 0.5 + 0.5;
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
    totalScore = 0;
    showPage('quiz-page');
    displayQuestion();
    updateProgressBar();
}

// Обновление прогресс-бара
function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
        progressFill.style.width = progress + '%';
    }
}

// Отображение вопроса
function displayQuestion() {
    const question = quizQuestions[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('question-number').textContent = currentQuestion + 1;

    updateProgressBar();

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

    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === question.correct) {
        buttons[selectedIndex].classList.add('correct');
        correctAnswers++;
        totalScore += 50; // Бонус за правильный ответ
        playCorrectSound();
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[question.correct].classList.add('correct');
        playIncorrectSound();
    }

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
    const resultTitle = document.querySelector('.quiz-result-title');
    const resultNumber = document.getElementById('quiz-result-number');

    if (resultNumber) {
        resultNumber.textContent = correctAnswers;
    }

    if (resultTitle) {
        if (correctAnswers >= 8) {
            resultTitle.textContent = "Отличный результат!";
        } else if (correctAnswers >= 5) {
            resultTitle.textContent = "Неплохо, сталкер!";
        } else {
            resultTitle.textContent = "Нужно больше практики...";
        }
    }

    setTimeout(() => {
        startCracksPages();
    }, 2500);
}

// Начало страниц с трещинами
function startCracksPages() {
    totalCrackPages = Math.max(1, correctAnswers);
    currentCrackPage = 0;
    showCrackPage();
}

// Обновление счетчика снежинок (скрыто)
function updateSnowflakeCounter() {
    // Счетчик теперь скрыт, но логика остается
}

// Переменные для хоррор эффектов
let flashlightOverlay = null;
let flashlightCursor = null;
let horrorFlashInterval = null;
let creepySoundInterval = null;

// Показать страницу с трещинами - ХОРРОР РЕЖИМ
function showCrackPage() {
    showPage('cracks-pages');

    const container = document.getElementById('interactive-snowflakes');
    const cracksOverlay = document.getElementById('cracks-overlay');
    const cracksPage = document.getElementById('cracks-pages');
    container.innerHTML = '';
    cracksOverlay.innerHTML = '';
    cracksOverlay.classList.remove('active');
    collectedSnowflakes = 0;
    activeSnowflakes = 0;

    if (snowflakeInterval) clearInterval(snowflakeInterval);
    if (crackInterval) clearInterval(crackInterval);
    if (horrorFlashInterval) clearInterval(horrorFlashInterval);
    if (creepySoundInterval) clearInterval(creepySoundInterval);

    // Создаём элементы фонарика
    createFlashlightEffect(cracksPage);

    // Добавляем статический шум
    const staticNoise = document.createElement('div');
    staticNoise.className = 'static-noise';
    cracksPage.appendChild(staticNoise);

    // Не показываем сколько нужно собрать - тайна!
    neededSnowflakes = 5 + 2 * currentCrackPage;

    // Замедленные, загадочные снежинки
    const baseSpeed = 5000;
    snowflakeSpeed = Math.max(4000, baseSpeed + currentCrackPage * 300);

    const spawnInterval = Math.max(1200, 2500 - currentCrackPage * 150);

    // Начальные снежинки с задержкой
    for (let i = 0; i < 4; i++) {
        setTimeout(() => createSingleSnowflake(container), 1500 + i * 400);
    }

    snowflakeInterval = setInterval(() => {
        if (activeSnowflakes < maxActiveSnowflakes) {
            createSingleSnowflake(container);
        }
    }, spawnInterval);

    // Трещины появляются реже и загадочнее
    startGradualCracks(cracksOverlay);

    // Случайные вспышки
    startHorrorFlashes(cracksPage);

    // Жуткие звуки
    startCreepySounds();

    updateMusicForCracksPage();
}

// Создание эффекта фонарика
function createFlashlightEffect(page) {
    // Удаляем старые элементы
    if (flashlightOverlay) flashlightOverlay.remove();
    if (flashlightCursor) flashlightCursor.remove();

    // Создаём наложение темноты
    flashlightOverlay = document.createElement('div');
    flashlightOverlay.className = 'flashlight-overlay';
    page.appendChild(flashlightOverlay);

    // Создаём курсор
    flashlightCursor = document.createElement('div');
    flashlightCursor.className = 'flashlight-cursor';
    page.appendChild(flashlightCursor);

    // Следим за мышью
    page.addEventListener('mousemove', handleFlashlightMove);
    page.addEventListener('touchmove', handleFlashlightTouch, { passive: false });
}

// Обработка движения мыши
function handleFlashlightMove(e) {
    const x = e.clientX;
    const y = e.clientY;

    if (flashlightOverlay) {
        flashlightOverlay.style.setProperty('--mouse-x', x + 'px');
        flashlightOverlay.style.setProperty('--mouse-y', y + 'px');
    }

    if (flashlightCursor) {
        flashlightCursor.style.left = x + 'px';
        flashlightCursor.style.top = y + 'px';
    }
}

// Обработка тача
function handleFlashlightTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    handleFlashlightMove({ clientX: touch.clientX, clientY: touch.clientY });
}

// Случайные вспышки ужаса
function startHorrorFlashes(page) {
    if (horrorFlashInterval) clearInterval(horrorFlashInterval);

    const createFlash = () => {
        const flash = document.createElement('div');
        flash.className = 'horror-flash';
        page.appendChild(flash);

        setTimeout(() => flash.remove(), 150);
    };

    // Случайные вспышки
    horrorFlashInterval = setInterval(() => {
        if (Math.random() < 0.3) { // 30% шанс
            createFlash();
            playCreepySound();
        }
    }, 3000 + Math.random() * 4000);
}

// Жуткие звуки
function startCreepySounds() {
    if (creepySoundInterval) clearInterval(creepySoundInterval);

    creepySoundInterval = setInterval(() => {
        if (Math.random() < 0.25) {
            playCreepySound();
        }
    }, 5000 + Math.random() * 8000);
}

// Жуткий звук
function playCreepySound() {
    const ctx = initAudioContext();
    if (!ctx) return;

    try {
        if (ctx.state === 'suspended') ctx.resume();

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Случайный тип звука
        const soundType = Math.floor(Math.random() * 3);

        if (soundType === 0) {
            // Низкий гул
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(40 + Math.random() * 30, ctx.currentTime);
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 1.5);
        } else if (soundType === 1) {
            // Шёпот
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(80, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5);
            filter.type = 'bandpass';
            filter.frequency.value = 500;
            gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.5);
        } else {
            // Скрип
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(2000 + Math.random() * 1000, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
            filter.type = 'highpass';
            filter.frequency.value = 1000;
            gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.15);
        }
    } catch (e) { }
}

// Обновление музыки для страниц с трещинами
function updateMusicForCracksPage() {
    horrorVolume = Math.min(1, horrorVolume + 0.15);
    if (horrorMusic) {
        horrorMusic.volume = horrorVolume;
    }

    christmasVolume = Math.max(0, christmasVolume - 0.05);
    if (backgroundMusic) {
        backgroundMusic.volume = christmasVolume;
    }
}

// Очистка хоррор эффектов
function cleanupHorrorEffects() {
    const cracksPage = document.getElementById('cracks-pages');

    if (flashlightOverlay) {
        flashlightOverlay.remove();
        flashlightOverlay = null;
    }
    if (flashlightCursor) {
        flashlightCursor.remove();
        flashlightCursor = null;
    }
    if (horrorFlashInterval) {
        clearInterval(horrorFlashInterval);
        horrorFlashInterval = null;
    }
    if (creepySoundInterval) {
        clearInterval(creepySoundInterval);
        creepySoundInterval = null;
    }
    if (suddenCrackTimeout) {
        clearTimeout(suddenCrackTimeout);
        suddenCrackTimeout = null;
    }

    // Удаляем статический шум
    if (cracksPage) {
        const staticNoise = cracksPage.querySelector('.static-noise');
        if (staticNoise) staticNoise.remove();

        cracksPage.removeEventListener('mousemove', handleFlashlightMove);
        cracksPage.removeEventListener('touchmove', handleFlashlightTouch);
    }
}

// Внезапный взрыв трещин (без вспышки, замедленный)
let suddenCrackTimeout = null;

function triggerSuddenCrackBurst(container) {
    const burstCount = 10 + Math.floor(Math.random() * 8); // 10-18 трещин (меньше)

    // Создаём трещины постепенно (замедленно)
    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => createSingleCrack(container), i * 80); // 80ms вместо 20ms
    }

    // Тихий звук
    playSuddenCrackSound();
}

function scheduleSuddenCracks(container) {
    // Увеличенный интервал 5-12 секунд
    const delay = 5000 + Math.random() * 7000;

    suddenCrackTimeout = setTimeout(() => {
        triggerSuddenCrackBurst(container);
        // Планируем следующий взрыв
        scheduleSuddenCracks(container);
    }, delay);
}

function playSuddenCrackSound() {
    const ctx = initAudioContext();
    if (!ctx) return;

    try {
        if (ctx.state === 'suspended') ctx.resume();

        // Резкий громкий треск
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);

        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) { }
}

// Постепенное появление трещин
function startGradualCracks(container) {
    if (crackInterval) {
        clearInterval(crackInterval);
    }
    if (suddenCrackTimeout) {
        clearTimeout(suddenCrackTimeout);
    }

    const baseCracks = 50;
    const cracksPerPage = 100;
    const totalCracks = baseCracks + currentCrackPage * cracksPerPage;

    let cracksCreated = 0;

    // Запускаем внезапные взрывы трещин
    scheduleSuddenCracks(container);

    crackInterval = setInterval(() => {
        if (cracksCreated < totalCracks) {
            createSingleCrack(container);
            cracksCreated++;
        } else {
            clearInterval(crackInterval);
        }
    }, 1500);
}

// Создание одной снежинки
function createSingleSnowflake(container) {
    const symbols = ['❄', '❅', '❆', '✻', '✼', '❉'];
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake-interactive';
    snowflake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    snowflake.style.left = (Math.random() * 90 + 5) + '%';
    snowflake.style.animationDuration = (snowflakeSpeed / 1000) + 's';
    snowflake.style.animationDelay = '0s';
    snowflake.style.fontSize = (2 + Math.random() * 1) + 'em';

    activeSnowflakes++;

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

            totalScore += 10;
            updateSnowflakeCounter();

            setTimeout(() => {
                if (snowflake.parentNode) {
                    snowflake.remove();
                }
            }, 400);

            if (collectedSnowflakes >= neededSnowflakes) {
                if (crackInterval) {
                    clearInterval(crackInterval);
                }
                if (snowflakeInterval) {
                    clearInterval(snowflakeInterval);
                }
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

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const length = 100 + Math.random() * 250;
    const angle = Math.random() * 360;

    crack.style.left = x + '%';
    crack.style.top = y + '%';
    crack.style.width = length + 'px';
    crack.style.height = '2px';
    crack.style.transform = `rotate(${angle}deg)`;
    crack.style.transformOrigin = '0 50%';

    container.appendChild(crack);

    if (!container.classList.contains('active')) {
        container.classList.add('active');
    }

    playCrackSound();
}

// Создание реалистичной трещины стекла на скримере
function createScrimerCrack(container, x, y) {
    const crack = document.createElement('div');
    crack.className = 'scrimer-crack';

    // Случайная позиция если не указана
    const posX = x !== undefined ? x : Math.random() * 100;
    const posY = y !== undefined ? y : Math.random() * 100;

    // Случайные параметры трещины
    const length = 80 + Math.random() * 180;
    const angle = Math.random() * 360;
    const branchAngle = 20 + Math.random() * 40;

    crack.style.left = posX + '%';
    crack.style.top = posY + '%';
    crack.style.setProperty('--crack-length', length + 'px');
    crack.style.setProperty('--crack-angle', angle + 'deg');
    crack.style.setProperty('--branch-angle', branchAngle + 'deg');

    container.appendChild(crack);
}

// Создание точки удара с расходящимися трещинами
function createImpactPoint(container, x, y) {
    // Точка удара
    const impact = document.createElement('div');
    impact.className = 'crack-impact';
    impact.style.left = x + '%';
    impact.style.top = y + '%';
    container.appendChild(impact);

    // Расходящиеся трещины от точки удара (5-8 штук)
    const crackCount = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < crackCount; i++) {
        setTimeout(() => {
            const crack = document.createElement('div');
            crack.className = 'scrimer-crack';

            const length = 60 + Math.random() * 150;
            const angle = (360 / crackCount) * i + (Math.random() - 0.5) * 30;
            const branchAngle = 25 + Math.random() * 35;

            crack.style.left = x + '%';
            crack.style.top = y + '%';
            crack.style.setProperty('--crack-length', length + 'px');
            crack.style.setProperty('--crack-angle', angle + 'deg');
            crack.style.setProperty('--branch-angle', branchAngle + 'deg');

            container.appendChild(crack);
        }, i * 30);
    }
}

let scrimerCrackInterval = null;

// Показать скример
function showScrimer() {
    // Очищаем хоррор эффекты
    cleanupHorrorEffects();

    showPage('scrimer-page');
    scrimerHits = 0;
    const hitCountElement = document.getElementById('scrimer-hit-count');
    const scrimerCracksContainer = document.getElementById('scrimer-cracks');

    if (hitCountElement) {
        hitCountElement.textContent = scrimerHits;
    }

    // Очищаем предыдущие трещины
    if (scrimerCracksContainer) {
        scrimerCracksContainer.innerHTML = '';
    }

    // Останавливаем предыдущий интервал
    if (scrimerCrackInterval) {
        clearInterval(scrimerCrackInterval);
    }

    // Начальные трещины при появлении скримера
    if (scrimerCracksContainer) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createScrimerCrack(scrimerCracksContainer), i * 50);
        }

        // Периодические трещины для атмосферы
        scrimerCrackInterval = setInterval(() => {
            createScrimerCrack(scrimerCracksContainer);
        }, 800);
    }

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

    playScrimerSound();

    const scrimerImage = document.getElementById('scrimer-image');
    const scrimerPage = document.getElementById('scrimer-page');

    let timeoutId = null;

    const handleScrimerClick = (e) => {
        e.stopPropagation();
        scrimerHits++;
        if (hitCountElement) {
            hitCountElement.textContent = scrimerHits;
        }

        // Создаём точку удара с трещинами в месте клика
        if (scrimerCracksContainer) {
            const rect = scrimerPage.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * 100;
            const clickY = ((e.clientY - rect.top) / rect.height) * 100;
            createImpactPoint(scrimerCracksContainer, clickX, clickY);
        }

        if (scrimerImage) {
            scrimerImage.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (scrimerImage) {
                    scrimerImage.style.transform = 'scale(1)';
                }
            }, 100);
        }

        playHitSound();

        if (scrimerHits >= 15) {
            if (scrimerPage) {
                scrimerPage.removeEventListener('click', handleScrimerClick);
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (scrimerCrackInterval) {
                clearInterval(scrimerCrackInterval);
            }
            if (scrimerMusic) {
                scrimerMusic.pause();
            }
            setTimeout(() => {
                showScorePage();
            }, 300);
        }
    };

    if (scrimerPage) {
        scrimerPage.addEventListener('click', handleScrimerClick);
    }

    timeoutId = setTimeout(() => {
        if (scrimerHits < 10 && scrimerPage) {
            scrimerPage.removeEventListener('click', handleScrimerClick);
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

    setTimeout(() => {
        if (totalScore >= 400) {
            showPage('santa-page');
        } else {
            resetToStart();
        }
    }, 3000);
}

// Сброс на главную страницу
function resetToStart() {
    currentQuestion = 0;
    correctAnswers = 0;
    currentCrackPage = 0;
    totalCrackPages = 0;
    collectedSnowflakes = 0;
    activeSnowflakes = 0;
    scrimerHits = 0;
    totalScore = 0;
    horrorVolume = 0;
    christmasVolume = 0.27;
    giftButtonEscapes = 0;

    if (crackInterval) {
        clearInterval(crackInterval);
        crackInterval = null;
    }
    if (snowflakeInterval) {
        clearInterval(snowflakeInterval);
        snowflakeInterval = null;
    }

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

    showPage('main-page');

    const snowflakesContainer = document.querySelector('.snowflakes');
    if (snowflakesContainer) {
        snowflakesContainer.innerHTML = '';
        createSnowflakes(snowflakesContainer, 15);
    }
}

// Обработка ответа Деду Морозу
function handleSantaAnswer() {
    const input = document.getElementById('behavior-input');
    if (input.value.trim()) {
        if (totalScore >= 400) {
            if (horrorMusic) {
                horrorMusic.pause();
            }
            if (backgroundMusic) {
                backgroundMusic.volume = 0.27;
                if (backgroundMusic.paused) {
                    backgroundMusic.play();
                }
            }

            showPage('final-page');
            const snowflakesContainer = document.querySelector('.snowflakes-final');
            if (snowflakesContainer) {
                snowflakesContainer.innerHTML = '';
                createSnowflakes(snowflakesContainer, 20);
            }

            initGiftButton();
        } else {
            resetToStart();
        }
    } else {
        alert('Пожалуйста, ответь на вопрос, сталкер!');
    }
}

// Инициализация кнопки подарка
function initGiftButton() {
    const giftButton = document.getElementById('get-gift-btn');
    if (!giftButton) return;

    giftButtonEscapes = 0;
    giftButton.style.position = 'relative';
    giftButton.style.transition = 'none';

    const newButton = giftButton.cloneNode(true);
    giftButton.parentNode.replaceChild(newButton, giftButton);

    newButton.addEventListener('click', handleGiftButtonClick);
    newButton.addEventListener('mouseenter', handleGiftButtonHover);
    newButton.addEventListener('touchstart', handleGiftButtonTouch, { passive: false });
}

// Обработка наведения на кнопку
function handleGiftButtonHover(e) {
    if (giftButtonEscapes < 5) {
        e.preventDefault();
        escapeButton(e.target);
    }
}

// Обработка касания кнопки
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

    const giftBox = button.closest('.gift-box');
    const container = giftBox || document.querySelector('.final-content') || document.querySelector('.final-container');
    const containerRect = container ? container.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    const buttonRect = button.getBoundingClientRect();

    const maxX = Math.max(0, containerRect.width - buttonRect.width - 20);
    const maxY = Math.max(0, containerRect.height - buttonRect.height - 20);

    const newX = Math.max(0, Math.random() * maxX);
    const newY = Math.max(0, Math.random() * maxY);

    button.style.transition = 'all 0.3s ease';
    button.style.position = 'absolute';
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';
    button.style.zIndex = '1000';

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
        playCorrectSound();
    }
}

// ========== ЗВУКОВЫЕ ЭФФЕКТЫ ==========

function playCrackSound() {
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
        oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
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
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const oscillator1 = ctx.createOscillator();
        const oscillator2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const gainNode2 = ctx.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode2);
        gainNode.connect(ctx.destination);
        gainNode2.connect(ctx.destination);

        oscillator1.type = 'sawtooth';
        oscillator1.frequency.setValueAtTime(80, ctx.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);

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
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);

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
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);

        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
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
