/**
 * ГЛАВНЫЙ JavaScript ФАЙЛ ДЛЯ ЛЕНДИНГА
 * ====================================
 * 
 * Этот файл содержит всю логику для:
 * 1. Инициализации иконок Lucide
 * 2. Обработки формы заявок
 * 3. Отправки данных в Telegram бот
 */

// Ждем полной загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Сайт загружен, инициализируем функции...');
  
  // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК
  initializeIcons();
  
  // 2. НАСТРОЙКА ФОРМЫ ЗАЯВОК
  setupContactForm();
  
  // 3. ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА ПРОЕКТОВ
  setupProjectsSlider();
  
  // 4. НАСТРОЙКА ПЕРЕКЛЮЧЕНИЯ ИКОНОК HERO (убираем анимацию букв)
  setupHeroTilesSwitching();
  
  // 5. ПРОВЕРКА TELEGRAM КНОПКИ
  setupTelegramButton();
  
  // 6. ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ ПЕРЕВОДОВ
  if (window.TranslationSystem) {
    TranslationSystem.init();
  }
  
  // 7. НАСТРОЙКА ПАСХАЛКИ С РАКЕТОЙ
  setupRocketEasterEgg();
  
  // 8. АНИМАЦИИ ДЛЯ ОТЗЫВОВ
  setupReviewsAnimations();
});

/**
 * Инициализация иконок Lucide
 * Создает SVG иконки из data-lucide атрибутов
 */
function initializeIcons() {
  try {
    lucide.createIcons();
    console.log('✅ Иконки Lucide загружены');
  } catch (error) {
    console.error('❌ Ошибка загрузки иконок:', error);
  }
}

/**
 * Настройка обработки формы заявок
 * Находит форму и добавляет обработчик отправки
 */
function setupContactForm() {
  const form = document.querySelector('#contact-form');
  
  if (!form) {
    console.error('❌ Форма заявки не найдена');
    return;
  }
  
  console.log('✅ Форма заявки найдена, добавляем Formspree обработчик');
  
  // Добавляем обработчик события отправки формы
  form.addEventListener('submit', handleFormspreeSubmit);
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ ОБРАБОТКИ ОТПРАВКИ ФОРМЫ
 * ======================================== 
 * 
 * Выполняет следующие действия:
 * 1. Предотвращает стандартную отправку формы
 * 2. Собирает данные из полей
 * 3. Валидирует их
 * 4. Отправляет в Telegram бот
 * 5. Показывает результат пользователю
 */
async function handleFormSubmit(event) {
  event.preventDefault(); // Останавливаем стандартную отправку формы
  
  console.log('📝 Начинаем обработку формы...');
  
  // СОБИРАЕМ ДАННЫЕ ИЗ ФОРМЫ
  const formData = collectFormData(event.target);
  
  // ПРОВЕРЯЕМ ДАННЫЕ
  if (!validateFormData(formData)) {
    return; // Если данные некорректны, прекращаем
  }
  
  // МЕНЯЕМ СОСТОЯНИЕ КНОПКИ НА "ЗАГРУЗКА"
  const submitButton = event.target.querySelector('button[type="submit"]');
  setButtonLoading(submitButton, true);
  
  try {
    // ОТПРАВЛЯЕМ ЗАЯВКУ
    await sendFormData(formData);
    
    // УСПЕХ: Очищаем форму и показываем сообщение
    event.target.reset();
    showSuccessMessage(formData);
    
  } catch (error) {
    console.error('❌ Ошибка отправки заявки:', error);
    showErrorMessage();
    
  } finally {
    // ВОЗВРАЩАЕМ КНОПКУ В ИСХОДНОЕ СОСТОЯНИЕ
    setButtonLoading(submitButton, false);
  }
}

/**
 * Сбор данных из формы
 * @param {HTMLFormElement} form - HTML форма
 * @returns {Object} Объект с данными формы
 */
function collectFormData(form) {
  const data = {
    name: form.querySelector('input[name="name"]').value.trim(),
    email: form.querySelector('input[name="email"]').value.trim(),
    contact: form.querySelector('input[name="contact"]').value.trim(),
    task: form.querySelector('textarea[name="task"]').value.trim(),
    timestamp: new Date().toLocaleString('ru-RU')
  };
  
  console.log('📊 Собранные данные:', data);
  return data;
}

/**
 * Валидация данных формы
 * @param {Object} data - Данные формы
 * @returns {boolean} true если данные корректны
 */
function validateFormData(data) {
  // Проверяем заполненность всех полей
  if (!data.name || !data.email || !data.contact || !data.task) {
    alert('❌ Пожалуйста, заполните все поля');
    return false;
  }
  
  // Проверяем email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert('❌ Введите корректный email адрес');
    return false;
  }
  
  console.log('✅ Данные прошли валидацию');
  return true;
}

/**
 * Изменение состояния кнопки (загрузка/обычное)
 * @param {HTMLButtonElement} button - Кнопка отправки
 * @param {boolean} isLoading - Состояние загрузки
 */
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.dataset.originalContent = button.innerHTML;
    button.innerHTML = '<i data-lucide="loader-2" class="h-4 w-4 animate-spin"></i> Отправка...';
    button.disabled = true;
  } else {
    button.innerHTML = button.dataset.originalContent;
    button.disabled = false;
    // Перерисовываем иконки после изменения HTML
    lucide.createIcons();
  }
}

/**
 * ОТПРАВКА ДАННЫХ В TELEGRAM БОТ
 * ==============================
 * 
 * ВАЖНО: Здесь нужно будет заменить YOUR_BOT_TOKEN и YOUR_CHAT_ID
 * на реальные значения после создания бота через @BotFather
 */
async function sendFormData(data) {
  // ⚠️  НАСТРОЙКИ БОТА - ЗАМЕНИТЕ НА СВОИ! ⚠️
  const BOT_CONFIG = {
    token: 'YOUR_BOT_TOKEN', // Получите от @BotFather
    chatId: 'YOUR_CHAT_ID'   // Ваш chat ID в Telegram
  };
  
  // Формируем красивое сообщение для Telegram
  const message = formatTelegramMessage(data);
  
  // URL для отправки сообщения через Telegram Bot API
  const telegramApiUrl = `https://api.telegram.org/bot${BOT_CONFIG.token}/sendMessage`;
  
  // ВРЕМЕННО: показываем alert вместо реальной отправки
  // После настройки бота уберите эту строку и раскомментируйте код ниже
  console.log('📱 Сообщение для Telegram:', message);
  
  /* 
  // РАСКОММЕНТИРУЙТЕ ЭТОТ КОД ПОСЛЕ НАСТРОЙКИ БОТА:
  
  const response = await fetch(telegramApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: BOT_CONFIG.chatId,
      text: message,
      parse_mode: 'HTML'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Ошибка Telegram API: ${response.status}`);
  }
  
  const result = await response.json();
  console.log('✅ Сообщение отправлено в Telegram:', result);
  */
}

/**
 * Форматирование сообщения для Telegram
 * @param {Object} data - Данные формы
 * @returns {string} Отформатированное сообщение
 */
function formatTelegramMessage(data) {
  return `🆕 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
📱 <b>Контакт:</b> ${data.contact}
📝 <b>Задача:</b> ${data.task}

🕐 <b>Время:</b> ${data.timestamp}

---
💻 Отправлено с лендинга chevdev1`;
}

/**
 * Показать сообщение об успешной отправке
 * @param {Object} data - Данные формы
 */
function showSuccessMessage(data) {
  const message = `✅ Заявка принята!

Спасибо, ${data.name}! 
Ваша заявка получена и будет обработана в ближайшее время.

📧 Ответ придет на: ${data.email}
📱 Или свяжемся через: ${data.contact}

Обычно отвечаю в течение 2-4 часов.`;

  alert(message);
  console.log('✅ Заявка успешно отправлена');
}

/**
 * Показать сообщение об ошибке
 */
function showErrorMessage() {
  alert(`❌ Произошла ошибка при отправке заявки.

Попробуйте:
1. Обновить страницу и отправить снова
2. Связаться напрямую в Telegram: @chevdev1

Приносим извинения за неудобства!`);
}

/**
 * ИНСТРУКЦИЯ ПО НАСТРОЙКЕ TELEGRAM БОТА
 * ====================================
 * 
 * 1. Создание бота:
 *    - Напишите @BotFather в Telegram
 *    - Отправьте команду /newbot
 *    - Придумайте имя и username для бота
 *    - Получите токен (например: 123456789:ABCdef1234567890...)
 * 
 * 2. Получение Chat ID:
 *    - Напишите своему боту любое сообщение
 *    - Откройте в браузере: https://api.telegram.org/bot{ВАШ_ТОКЕН}/getUpdates
 *    - Найдите "chat":{"id":12345678} - это ваш Chat ID
 * 
 * 3. Настройка кода:
 *    - Замените YOUR_BOT_TOKEN на токен от BotFather
 *    - Замените YOUR_CHAT_ID на ваш Chat ID
 *    - Раскомментируйте блок кода отправки в функции sendFormData()
 * 
 * 4. Тестирование:
 *    - Заполните форму на сайте
 *    - Проверьте, что сообщение пришло в Telegram
 * 
 * ГОТОВО! Теперь все заявки будут приходить вам в Telegram! 🎉
 */

/**
 * СЛАЙДЕР ПРОЕКТОВ
 * ================
 * Управление галереей наших работ
 */

let currentSlide = 0;
let totalSlides = 2; // Обновите это число при добавлении новых проектов

/**
 * Настройка слайдера проектов
 */
function setupProjectsSlider() {
  const slider = document.getElementById('projectsSlider');
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');
  const indicators = document.querySelectorAll('.project-indicator');
  
  if (!slider || !prevBtn || !nextBtn) {
    console.log('⚠️ Элементы слайдера не найдены');
    return;
  }
  
  console.log('✅ Слайдер проектов инициализирован');
  
  // Обработчики кнопок
  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  
  // Обработчики индикаторов
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });
  
  // Автопрокрутка каждые 8 секунд
  setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 8000);
  
  // Обновляем состояние кнопок
  updateSliderControls();
}

/**
 * Переход к определенному слайду
 * @param {number} slideIndex - Индекс слайда
 */
function goToSlide(slideIndex) {
  const slider = document.getElementById('projectsSlider');
  
  // Зацикливание слайдов
  if (slideIndex >= totalSlides) {
    currentSlide = 0;
  } else if (slideIndex < 0) {
    currentSlide = totalSlides - 1;
  } else {
    currentSlide = slideIndex;
  }
  
  // Применяем трансформацию
  const translateX = -currentSlide * 100;
  slider.style.transform = `translateX(${translateX}%)`;
  
  // Обновляем индикаторы и кнопки
  updateSliderControls();
  
  console.log(`📸 Переход к слайду ${currentSlide + 1}`);
}

/**
 * Обновление состояния кнопок и индикаторов
 */
function updateSliderControls() {
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');
  const indicators = document.querySelectorAll('.project-indicator');
  
  // Обновляем индикаторы
  indicators.forEach((indicator, index) => {
    if (index === currentSlide) {
      indicator.classList.remove('h-2', 'w-2', 'bg-white/20');
      indicator.classList.add('h-2', 'w-8', 'bg-amber-500');
    } else {
      indicator.classList.remove('h-2', 'w-8', 'bg-amber-500');
      indicator.classList.add('h-2', 'w-2', 'bg-white/20');
    }
  });
  
  // Всегда активные кнопки (зацикленный слайдер)
  prevBtn.disabled = false;
  nextBtn.disabled = false;
}

/**
 * ПЕРЕКЛЮЧЕНИЕ ИКОНОК В HERO СЕКЦИИ
 * ==================================
 * Создает эффект смены иконок и технологий
 */

let heroTileInterval = null;
const tileConfigs = [
  // Конфигурации для первой плитки (Web)
  [
    { icon: 'code-2', text: 'Web', tech: 'Frontend' },
    { icon: 'globe', text: 'Sites', tech: 'Websites' },
    { icon: 'monitor', text: 'Apps', tech: 'WebApps' },
    { icon: 'layout', text: 'UI/UX', tech: 'Design' }
  ],
  // Конфигурации для второй плитки (App) 
  [
    { icon: 'smartphone', text: 'App', tech: 'Mobile' },
    { icon: 'tablet', text: 'Tablet', tech: 'iOS' },
    { icon: 'watch', text: 'Watch', tech: 'watchOS' },
    { icon: 'tv', text: 'Smart TV', tech: 'tvOS' }
  ],
  // Конфигурации для третьей плитки (Automation)
  [
    { icon: 'workflow', text: 'Automation', tech: 'Process' },
    { icon: 'bot', text: 'AI Bots', tech: 'ChatBots' },
    { icon: 'database', text: 'Data', tech: 'Analytics' },
    { icon: 'cloud', text: 'Cloud', tech: 'DevOps' }
  ]
];

let currentTileStates = [0, 0, 0]; // Текущие состояния каждой плитки

function setupHeroTilesSwitching() {
  // Запускаем переключение каждые 4 секунды
  heroTileInterval = setInterval(() => {
    switchRandomTile();
  }, 4000);
  
  console.log('🔄 Переключение иконок Hero запущено');
}

/**
 * Переключает случайную плитку на следующую конфигурацию
 */
function switchRandomTile() {
  // Выбираем случайную плитку (0, 1 или 2)
  const randomTileIndex = Math.floor(Math.random() * 3);
  const tile = document.querySelector(`[data-tile="${randomTileIndex}"]`);
  
  if (!tile) return;
  
  // Получаем текущую и следующую конфигурацию
  const currentState = currentTileStates[randomTileIndex];
  const nextState = (currentState + 1) % tileConfigs[randomTileIndex].length;
  const nextConfig = tileConfigs[randomTileIndex][nextState];
  
  // Находим элементы для замены
  const icon = tile.querySelector('.tile-icon');
  const text = tile.querySelector('span');
  
  if (!icon || !text) return;
  
  // Анимация исчезновения
  tile.classList.add('tile-fade-out');
  
  setTimeout(() => {
    // Меняем иконку и текст
    icon.setAttribute('data-lucide', nextConfig.icon);
    text.textContent = nextConfig.text;
    
    // Перерисовываем иконку
    lucide.createIcons();
    
    // Убираем класс исчезновения и добавляем появление
    tile.classList.remove('tile-fade-out');
    tile.classList.add('tile-fade-in');
    
    // Убираем класс появления через полсекунды
    setTimeout(() => {
      tile.classList.remove('tile-fade-in');
    }, 500);
    
    // Обновляем состояние
    currentTileStates[randomTileIndex] = nextState;
    
    console.log(`🔄 Плитка ${randomTileIndex + 1} изменена на: ${nextConfig.text}`);
    
  }, 250); // Половина времени анимации исчезновения
}

/**
 * НАСТРОЙКА TELEGRAM КНОПКИ
 * ========================
 * Проверяем работу кнопки "Связаться с кодером"
 */
function setupTelegramButton() {
  const telegramBtn = document.querySelector('a[href="https://t.me/chevdev1"]');
  
  if (!telegramBtn) {
    console.error('❌ Telegram кнопка не найдена!');
    return;
  }
  
  console.log('✅ Telegram кнопка найдена');
  
  // Добавляем обработчик клика для отладки
  telegramBtn.addEventListener('click', function(e) {
    console.log('🔗 Клик по Telegram кнопке!');
    console.log('🎯 Ссылка:', this.href);
    
    // Проверяем, не заблокирован ли клик
    if (e.defaultPrevented) {
      console.warn('⚠️ Событие клика заблокировано!');
    }
    
    // Дополнительная проверка - если не работает, открываем принудительно
    setTimeout(() => {
      if (confirm('Открыть Telegram?')) {
        window.open('https://t.me/chevdev1', '_blank', 'noopener,noreferrer');
      }
    }, 100);
  });
  
  // Добавляем визуальный фидбек при наведении
  telegramBtn.addEventListener('mouseenter', function() {
    console.log('🎨 Наведение на Telegram кнопку');
    this.style.transform = 'scale(1.05)';
  });
  
  telegramBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
}

/**
 * ПАСХАЛКА С РАКЕТОЙ
 * ==================
 * Скрытое предложение со скидкой при клике на ракету
 */

let rocketClicked = false;
let easterEggTimeout = null;

function setupRocketEasterEgg() {
  const rocketBtn = document.getElementById('rocket-btn');
  const rocketIcon = rocketBtn?.querySelector('.rocket-icon');
  const easterEgg = document.getElementById('easter-egg');
  const closeBtn = document.getElementById('easter-close');
  
  if (!rocketBtn || !easterEgg) {
    console.log('⚠️ Элементы пасхалки не найдены');
    return;
  }
  
  console.log('🚀 Пасхалка с ракетой настроена');
  
  // Клик по ракете
  rocketBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (rocketClicked) return;
    
    rocketClicked = true;
    
    // Анимация полета ракеты
    if (rocketIcon) {
      rocketIcon.classList.add('rocket-launch');
    }
    
    // Показываем пасхалку через 0.5 секунды
    setTimeout(() => {
      showEasterEgg();
    }, 500);
    
    // Возвращаем ракету через 1.2 секунды
    setTimeout(() => {
      returnRocket();
    }, 1200);
    
    console.log('🎊 Пасхалка активирована!');
  });
  
  // Закрытие пасхалки
  closeBtn?.addEventListener('click', hideEasterEgg);
  
  // Автозакрытие через 10 секунд
  function setupAutoClose() {
    if (easterEggTimeout) clearTimeout(easterEggTimeout);
    easterEggTimeout = setTimeout(() => {
      hideEasterEgg();
    }, 10000);
  }
  
  // Показать пасхалку
  function showEasterEgg() {
    easterEgg.classList.remove('hidden');
    
    // Добавляем эффекты
    const sparkles = easterEgg.querySelectorAll('[data-lucide="sparkles"]');
    sparkles.forEach(sparkle => {
      sparkle.classList.add('sparkle-animation');
    });
    
    // Свечение для скидки
    const discountText = easterEgg.querySelector('[data-translate="easter-discount"]');
    if (discountText) {
      discountText.classList.add('discount-glow');
    }
    
    setupAutoClose();
  }
  
  // Скрыть пасхалку
  function hideEasterEgg() {
    if (easterEggTimeout) clearTimeout(easterEggTimeout);
    
    easterEgg.classList.add('easter-fade-out');
    
    setTimeout(() => {
      easterEgg.classList.add('hidden');
      easterEgg.classList.remove('easter-fade-out');
      rocketClicked = false; // Позволяем снова кликать
    }, 300);
  }
  
  // Вернуть ракету
  function returnRocket() {
    if (rocketIcon) {
      rocketIcon.classList.remove('rocket-launch');
      rocketIcon.classList.add('rocket-return');
      
      setTimeout(() => {
        rocketIcon.classList.remove('rocket-return');
      }, 800);
    }
  }
  
  // Закрытие при клике вне пасхалки
  document.addEventListener('click', function(e) {
    if (easterEgg.classList.contains('hidden')) return;
    
    if (!easterEgg.contains(e.target) && e.target !== rocketBtn && !rocketBtn.contains(e.target)) {
      hideEasterEgg();
    }
  });
}

// ================================
// АНИМАЦИИ ДЛЯ ОТЗЫВОВ
// ================================

function setupReviewsAnimations() {
  const reviewCards = document.querySelectorAll('.review-card');
  
  if (reviewCards.length === 0) return;
  
  // Intersection Observer для анимации появления
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Применяем начальные стили и наблюдение для каждой карточки
  reviewCards.forEach((card, index) => {
    // Начальное состояние
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    
    // Добавляем в наблюдение
    observer.observe(card);
    
    // Добавляем эффект подсветки звезд при наведении
    const stars = card.querySelectorAll('[data-lucide="star"]');
    card.addEventListener('mouseenter', () => {
      stars.forEach((star, starIndex) => {
        setTimeout(() => {
          star.style.transform = 'scale(1.1)';
          star.style.filter = 'brightness(1.2)';
        }, starIndex * 50);
      });
    });
    
    card.addEventListener('mouseleave', () => {
      stars.forEach(star => {
        star.style.transform = 'scale(1)';
        star.style.filter = 'brightness(1)';
      });
    });
  });
  
  console.log(`✨ Инициализированы анимации для ${reviewCards.length} отзывов`);
}

// ================================
// FORMSPREE ОТПРАВКА ФОРМ
// ================================

async function handleFormspreeSubmit(event) {
  event.preventDefault(); // Останавливаем обычную отправку
  
  console.log('📧 Отправляем форму через Formspree...');
  
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnText = submitBtn ? submitBtn.querySelector('span') : null;
  
  // Проверяем что основные элементы найдены
  if (!form || !submitBtn) {
    console.error('❌ Не найдена форма или кнопка отправки');
    return;
  }
  
  // Сохраняем оригинальный текст
  const originalText = btnText ? btnText.textContent : 'Отправить';
  
  // Показываем загрузку БЕЗ работы с иконками (временно)
  if (btnText) btnText.textContent = 'Отправляется...';
  submitBtn.disabled = true;
  
  console.log('⚡ Иконки отключены для отладки');
  
  try {
    console.log('🚀 Отправляем запрос на:', form.action);
    
    // Отправляем данные в Formspree с таймаутом
    const response = await Promise.race([
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: Превышен лимит ожидания (10 сек)')), 10000)
      )
    ]);
    
    console.log('📡 Получен ответ:', response.status, response.statusText);
    
    if (response.ok) {
      // Проверяем содержимое ответа
      const result = await response.json();
      console.log('✅ Форма успешно отправлена!', result);
      showFormSuccess(form, btnText, null, originalText);
    } else {
      // Читаем ошибку от сервера
      const errorText = await response.text();
      console.error('❌ Ошибка сервера:', response.status, errorText);
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    
  } catch (error) {
    // Ошибка 😞
    console.error('❌ Ошибка отправки формы:', error.message);
    showFormError(btnText, null, originalText, error.message);
  }
  
  // Принудительно возвращаем кнопку в норму через 3 секунды
  setTimeout(() => {
    if (submitBtn) submitBtn.disabled = false;
    if (btnText && btnText.textContent === 'Отправляется...') {
      // Если кнопка всё ещё в состоянии загрузки - сбрасываем БЕЗ иконок
      btnText.textContent = originalText;
      console.log('⚠️ Принудительно сброшено состояние формы');
    }
    btnText.textContent = originalText;
    btnIcon.setAttribute('data-lucide', 'send');
    btnIcon.classList.remove('animate-spin');
    lucide.createIcons(); // Обновляем иконки
  }, 3000);
}

function showFormSuccess(form, btnText, btnIcon, originalText) {
  // Показываем успех БЕЗ иконок (временно)
  if (btnText) btnText.textContent = 'Отправлено! ✅';
  
  // Показываем красивое уведомление
  const notification = document.getElementById('success-notification');
  if (notification) {
    notification.classList.remove('hidden');
    notification.classList.add('animate-fadeIn');
    
    // Прокручиваем к уведомлению
    notification.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }
  
  // Очищаем форму через небольшую задержку
  setTimeout(() => {
    if (form) form.reset();
  }, 1000);
  
  // Скрываем уведомление через 10 секунд
  setTimeout(() => {
    if (notification) {
      notification.classList.add('animate-fadeOut');
      setTimeout(() => {
        notification.classList.add('hidden');
        notification.classList.remove('animate-fadeIn', 'animate-fadeOut');
      }, 500);
    }
  }, 10000);
  
  console.log('🎉 Заявка успешно отправлена! Скоро с вами свяжутся.');
}

function showFormError(btnText, btnIcon, originalText, errorMessage = '') {
  // Показываем ошибку БЕЗ иконок (временно)
  if (btnText) btnText.textContent = 'Ошибка ❌';
  
  // Логируем подробную ошибку
  console.log('😞 Ошибка отправки:', errorMessage || 'Неизвестная ошибка');
  console.log('💡 Попробуйте еще раз через несколько секунд');
}