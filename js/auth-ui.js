// Централизованное управление UI авторизации

const CURRENT_USER_STORAGE_KEY = 'nft_current_user';
let userMenuScriptPromise = null;
let authUiBaseStylesInjected = false;

ensureAuthUiBaseStyles();

function updateAuthUI() {
    if (typeof getCurrentUser === 'undefined') {
        setTimeout(updateAuthUI, 100);
        return;
    }

    const user = getCurrentUser();

    const authButtons = document.getElementById('auth-buttons');
    const userMenuContainer = document.getElementById('user-menu-container');
    const looseUserMenu = !userMenuContainer
        ? document.querySelector('header user-menu')
        : null;

    if (!authButtons && !userMenuContainer && !looseUserMenu) {
        return;
    }

    if (user) {
        // Показываем меню пользователя, скрываем кнопки входа
        if (authButtons) {
            hideElement(authButtons);
        }

        if (userMenuContainer) {
            showElement(userMenuContainer, 'block');
            const userMenu = userMenuContainer.querySelector('user-menu');
            if (userMenu) {
                showElement(userMenu, 'block');
            }
        }

        if (looseUserMenu) {
            showElement(looseUserMenu, 'block');
        }
    } else {
        // Пользователь не авторизован – показываем кнопки входа, скрываем меню пользователя
        if (authButtons) {
            showElement(authButtons, 'flex');
        }

        if (userMenuContainer) {
            hideElement(userMenuContainer);
        }

        if (looseUserMenu) {
            hideElement(looseUserMenu);
        }
    }

    markAuthUIReady();
}

function showElement(el, defaultDisplay = 'block') {
    if (!el) return;
    if (!el.dataset.defaultDisplay) {
        el.dataset.defaultDisplay = defaultDisplay;
    }
    el.classList.remove('hidden');
    el.style.display = el.dataset.defaultDisplay || defaultDisplay;
}

function hideElement(el) {
    if (!el) return;
    if (!el.dataset.defaultDisplay) {
        el.dataset.defaultDisplay = window.getComputedStyle(el).display === 'none' ? 'block' : window.getComputedStyle(el).display;
    }
    el.classList.add('hidden');
    el.style.display = 'none';
}

function ensureAuthControls() {
    ensureAuthUiBaseStyles();

    const actionsContainer = getHeaderActionsContainer();
    if (!actionsContainer) {
        return { authButtons: null, userMenuContainer: null };
    }

    let authButtons = document.getElementById('auth-buttons');
    if (!authButtons) {
        authButtons = createAuthButtons();
        actionsContainer.appendChild(authButtons);
    } else if (!authButtons.dataset.defaultDisplay) {
        authButtons.dataset.defaultDisplay = authButtons.classList.contains('md:flex') ? 'flex' : 'block';
    }

    let userMenuContainer = document.getElementById('user-menu-container');
    if (!userMenuContainer) {
        const existingUserMenu = actionsContainer.querySelector('user-menu');
        userMenuContainer = document.createElement('div');
        userMenuContainer.id = 'user-menu-container';
        userMenuContainer.className = 'hidden';
        userMenuContainer.dataset.defaultDisplay = 'block';
        userMenuContainer.style.display = 'none';

        if (existingUserMenu) {
            existingUserMenu.replaceWith(userMenuContainer);
            userMenuContainer.appendChild(existingUserMenu);
        } else {
            const userMenu = document.createElement('user-menu');
            userMenuContainer.appendChild(userMenu);
            actionsContainer.appendChild(userMenuContainer);
        }
    } else {
        if (!userMenuContainer.dataset.defaultDisplay) {
            userMenuContainer.dataset.defaultDisplay = 'block';
        }
        if (userMenuContainer.parentElement == null) {
            actionsContainer.appendChild(userMenuContainer);
        }
    }

    if (!userMenuContainer.querySelector('user-menu')) {
        const userMenu = document.createElement('user-menu');
        userMenuContainer.appendChild(userMenu);
    }

    ensureUserMenuComponent();

    return { authButtons, userMenuContainer };
}

function createAuthButtons() {
    const authButtons = document.createElement('div');
    authButtons.id = 'auth-buttons';
    authButtons.className = 'hidden md:flex items-center space-x-2';
    authButtons.dataset.defaultDisplay = 'flex';
    authButtons.style.display = 'none';
    authButtons.innerHTML = `
        <a href="login.html" class="bg-[#7f5af0] text-white px-4 py-2 rounded-md hover:bg-[#6a4ac9] transition-all">
            Войти
        </a>
        <a href="register.html" class="bg-transparent border border-[#7f5af0] text-[#7f5af0] px-4 py-2 rounded-md hover:bg-[#7f5af0] hover:text-white transition-all">
            Регистрация
        </a>
    `;
    return authButtons;
}

function getHeaderActionsContainer() {
    const header = document.querySelector('header');
    if (!header) return null;

    const cartBadge = header.querySelector('.cart-badge');
    if (cartBadge) {
        const actions = cartBadge.closest('.flex');
        if (actions) {
            return actions;
        }
    }

    return header.querySelector('.flex.items-center') || header.querySelector('.flex');
}

function ensureUserMenuComponent() {
    if (typeof customElements !== 'undefined' && customElements.get && customElements.get('user-menu')) {
        return;
    }

    if (userMenuScriptPromise) {
        return;
    }

    const existingScript = document.querySelector('script[data-user-menu-component], script[src*="components/user-menu.js"]');
    if (existingScript) {
        userMenuScriptPromise = new Promise(resolve => {
            if (existingScript.dataset.loaded || customElements.get?.('user-menu')) {
                resolve();
            } else {
                existingScript.addEventListener('load', () => {
                    existingScript.dataset.loaded = 'true';
                    resolve();
                });
            }
        });
        return;
    }

    userMenuScriptPromise = new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'components/user-menu.js';
        script.dataset.userMenuComponent = 'true';
        script.addEventListener('load', () => {
            script.dataset.loaded = 'true';
            resolve();
        });
        script.addEventListener('error', resolve);
        document.head.appendChild(script);
    });
}

function ensureAuthUiBaseStyles() {
    if (authUiBaseStylesInjected) return;

    const head = document.head || document.getElementsByTagName('head')[0];
    if (!head) {
        document.addEventListener('DOMContentLoaded', ensureAuthUiBaseStyles, { once: true });
        return;
    }

    if (document.querySelector('style[data-auth-ui-base-styles]')) {
        authUiBaseStylesInjected = true;
        return;
    }

    const style = document.createElement('style');
    style.dataset.authUiBaseStyles = 'true';
    style.textContent = `
        body:not(.auth-ui-ready) user-menu {
            display: none !important;
        }
    `;
    head.appendChild(style);
    authUiBaseStylesInjected = true;
}

function markAuthUIReady() {
    if (document.body) {
        document.body.classList.add('auth-ui-ready');
    }
}

// ЕДИНАЯ функция для проверки, является ли страница публичной
// Используется везде для предотвращения ненужных проверок авторизации
function isPublicPage() {
    if (typeof window === 'undefined') return false;
    
    try {
        // Получаем все возможные источники информации о текущей странице
        const href = (window.location.href || '').toLowerCase();
        const pathname = (window.location.pathname || '').toLowerCase();
        const documentUrl = (document.URL || document.location.href || '').toLowerCase();
        
        // Извлекаем имя файла из пути
        const pathParts = pathname.split('/').filter(p => p);
        const fileName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';
        
        // Проверяем все возможные варианты для главной страницы (index)
        // Важно: проверяем точное совпадение, чтобы не сработало на других страницах
        const hrefWithoutQuery = href.split('?')[0].split('#')[0];
        const docUrlWithoutQuery = documentUrl.split('?')[0].split('#')[0];
        
        const isIndex = pathname === '/' ||
                       pathname === '/index' ||
                       pathname === '/index.html' ||
                       fileName === 'index' ||
                       fileName === 'index.html' ||
                       fileName === '' ||
                       hrefWithoutQuery.endsWith('/') ||
                       hrefWithoutQuery.endsWith('/index') ||
                       hrefWithoutQuery.endsWith('/index.html') ||
                       docUrlWithoutQuery.endsWith('/') ||
                       docUrlWithoutQuery.endsWith('/index') ||
                       docUrlWithoutQuery.endsWith('/index.html');
        
        // Проверяем страницу входа (login)
        const isLogin = fileName === 'login' ||
                       fileName === 'login.html' ||
                       pathname.includes('/login') ||
                       href.includes('/login.html') ||
                       (href.includes('/login') && !href.includes('/login?')) ||
                       documentUrl.includes('/login.html') ||
                       documentUrl.includes('/login');
        
        // Проверяем страницу регистрации (register)
        const isRegister = fileName === 'register' ||
                          fileName === 'register.html' ||
                          pathname.includes('/register') ||
                          href.includes('/register.html') ||
                          (href.includes('/register') && !href.includes('/register?')) ||
                          documentUrl.includes('/register.html') ||
                          documentUrl.includes('/register');
        
        return isIndex || isLogin || isRegister;
    } catch (e) {
        // В случае ошибки считаем страницу защищенной (безопаснее)
        return false;
    }
}

// Флаг для предотвращения множественных проверок
let isCheckingAuth = false;
let lastCheckedPath = '';

function enforceAuthGuard() {
    if (typeof window === 'undefined') return;
    
    // ПЕРВАЯ и ГЛАВНАЯ проверка - если это публичная страница, сразу выходим
    // Это критически важно - функция должна выйти ДО любых других проверок
    if (isPublicPage()) {
        return; // Публичная страница - НЕ блокируем доступ, НЕМЕДЛЕННО выходим
    }
    
    // Если уже проверяем авторизацию, не выполняем повторную проверку
    if (isCheckingAuth) return;
    
    // Проверяем, не проверяли ли мы уже эту страницу
    const currentPath = window.location.pathname + window.location.search;
    if (lastCheckedPath === currentPath && lastCheckedPath !== '') {
        return; // Уже проверяли эту страницу
    }
    
    // Устанавливаем флаг проверки
    isCheckingAuth = true;
    lastCheckedPath = currentPath;

    // Проверяем, авторизован ли пользователь
    let loggedIn = false;
    try {
        if (typeof isUserLoggedIn === 'function') {
            loggedIn = isUserLoggedIn();
        } else if (typeof getCurrentUser === 'function') {
            loggedIn = !!getCurrentUser();
        } else {
            const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
            loggedIn = !!raw && raw !== 'null' && raw !== 'undefined' && raw !== '';
        }
    } catch (e) {
        loggedIn = false;
    }

    // Если пользователь не авторизован - перенаправляем на страницу входа
    if (!loggedIn) {
        // Сохраняем текущий путь для возврата после входа
        const returnTarget = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `login.html?return=${returnTarget}`;
        return;
    }
    
    // Сбрасываем флаг после успешной проверки
    isCheckingAuth = false;
}

// Вызываем защиту авторизации только для защищенных страниц
setTimeout(function() {
    if (!isPublicPage()) {
        enforceAuthGuard();
    }
}, 50);

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthUI);
} else {
    initAuthUI();
}

function initAuthUI() {
    updateAuthUI();

    // Уменьшаем частоту проверок с 1с до 5с для снижения нагрузки
    setInterval(updateAuthUI, 5000);
    
    // Проверяем авторизацию только если НЕ на публичной странице
    if (!isPublicPage()) {
        enforceAuthGuard();
    }

    // Отслеживаем переходы между страницами и сбрасываем кэш проверок
    window.addEventListener('popstate', function() {
        lastCheckedPath = ''; // Сбрасываем кэш при переходе назад/вперед
        if (!isPublicPage()) {
            enforceAuthGuard();
        }
    });

    // Отслеживаем изменения в localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === CURRENT_USER_STORAGE_KEY || e.key === null) {
            updateAuthUI();
            // Проверяем авторизацию только если НЕ на публичной странице
            if (!isPublicPage()) {
                enforceAuthGuard();
            }
        }
    });

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === CURRENT_USER_STORAGE_KEY) {
            setTimeout(updateAuthUI, 100);
            // Проверяем авторизацию только если НЕ на публичной странице
            if (!isPublicPage()) {
                setTimeout(enforceAuthGuard, 150);
            }
        }
    };

    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
        originalRemoveItem.apply(this, arguments);
        if (key === CURRENT_USER_STORAGE_KEY) {
            setTimeout(updateAuthUI, 100);
            // Проверяем авторизацию только если НЕ на публичной странице
            if (!isPublicPage()) {
                setTimeout(enforceAuthGuard, 150);
            }
        }
    };
}

// Экспортируем функции для использования в других скриптах
window.updateAuthUI = updateAuthUI;
window.isPublicPage = isPublicPage; // Экспортируем для использования в других местах

