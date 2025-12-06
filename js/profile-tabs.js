// Управление табами на странице профиля

// Типы табов
const TABS = {
    MY_NFTS: 'my-nfts',
    COLLECTIONS: 'collections',
    LIKES: 'likes',
    ACTIVITY: 'activity'
};

// Текущий активный таб
let currentTab = TABS.MY_NFTS;

/**
 * Инициализация системы табов
 */
function initProfileTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Добавляем обработчики на каждую кнопку
    tabButtons.forEach((button, index) => {
        let tabType;
        const buttonText = button.textContent.trim();
        
        // Определяем тип таба по тексту кнопки
        if (buttonText === 'Мои NFT') {
            tabType = TABS.MY_NFTS;
        } else if (buttonText === 'Коллекции') {
            tabType = TABS.COLLECTIONS;
        } else if (buttonText === 'Лайки') {
            tabType = TABS.LIKES;
        } else if (buttonText === 'Активность') {
            tabType = TABS.ACTIVITY;
        }
        
        // Сохраняем тип таба в data-атрибуте
        button.dataset.tab = tabType;
        
        button.addEventListener('click', function() {
            // Удаляем активный класс со всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс на текущую кнопку
            this.classList.add('active');
            
            // Переключаем контент
            switchTab(tabType);
        });
    });
    
    // Загружаем контент для первого таба (Мои NFT)
    switchTab(TABS.MY_NFTS);
}

/**
 * Переключение между табами
 */
function switchTab(tabType) {
    currentTab = tabType;
    const container = document.getElementById('profile-nfts');
    
    if (!container) {
        console.error('Profile NFTs container not found');
        return;
    }
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Загружаем контент в зависимости от таба
    switch(tabType) {
        case TABS.MY_NFTS:
            loadMyNfts(container);
            break;
        case TABS.COLLECTIONS:
            loadCollections(container);
            break;
        case TABS.LIKES:
            loadLikes(container);
            break;
        case TABS.ACTIVITY:
            loadActivity(container);
            break;
        default:
            loadMyNfts(container);
    }
}

/**
 * Загрузка NFT пользователя
 */
function loadMyNfts(container) {
    const user = getCurrentUser();
    
    if (!user) {
        showEmptyState(container, 'Необходимо войти в систему', 'fa-user-lock');
        return;
    }
    
    // Получаем NFT созданные пользователем
    const userNfts = getUserCreatedNfts(user.username);
    
    if (userNfts.length === 0) {
        showEmptyState(
            container, 
            'У вас пока нет созданных NFT',
            'fa-images',
            'Создайте свой первый NFT',
            'create-nft.html'
        );
        return;
    }
    
    // Меняем класс контейнера для grid отображения
    container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    
    // Добавляем кнопку создания NFT в начало
    const createButton = document.createElement('a');
    createButton.href = 'create-nft.html';
    createButton.className = 'create-nft-card bg-[#16161a] rounded-xl p-6 flex flex-col items-center justify-center hover:bg-[#1f1f23] transition-all border-2 border-dashed border-gray-700 hover:border-[#7f5af0] cursor-pointer min-h-[300px]';
    createButton.innerHTML = `
        <div class="text-[#7f5af0] mb-4">
            <i class="fas fa-plus-circle text-6xl"></i>
        </div>
        <h3 class="text-xl font-bold mb-2">Создать NFT</h3>
        <p class="text-gray-400 text-center text-sm">Загрузите свою работу и выставите её на продажу</p>
    `;
    container.appendChild(createButton);
    
    // Отображаем NFT карточки
    userNfts.forEach(nft => {
        const card = createNftCard(nft, 'profile');
        container.appendChild(card);
    });
}

/**
 * Загрузка коллекций пользователя
 */
function loadCollections(container) {
    const user = getCurrentUser();
    
    if (!user) {
        showEmptyState(container, 'Необходимо войти в систему', 'fa-user-lock');
        return;
    }
    
    // Пока показываем пустое состояние (функционал коллекций будет добавлен позже)
    showEmptyState(
        container,
        'У вас пока нет коллекций',
        'fa-folder-open',
        'Функционал коллекций скоро будет доступен'
    );
}

/**
 * Загрузка избранных NFT
 */
function loadLikes(container) {
    const user = getCurrentUser();
    
    if (!user) {
        showEmptyState(container, 'Необходимо войти в систему', 'fa-user-lock');
        return;
    }
    
    // Получаем избранные NFT из localStorage
    const favorites = user.favorites || [];
    
    if (favorites.length === 0) {
        showEmptyState(
            container,
            'У вас пока нет избранных NFT',
            'fa-heart',
            'Добавьте NFT в избранное на странице маркетплейса'
        );
        return;
    }
    
    // Получаем данные NFT по ID из избранного
    const allNfts = getAllNfts();
    const likedNfts = allNfts.filter(nft => favorites.includes(nft.id));
    
    if (likedNfts.length === 0) {
        showEmptyState(container, 'Избранные NFT не найдены', 'fa-heart-broken');
        return;
    }
    
    // Отображаем избранные NFT
    loadNftCards('profile-nfts', likedNfts, 'profile');
}

/**
 * Загрузка истории активности
 */
function loadActivity(container) {
    const user = getCurrentUser();
    
    if (!user) {
        showEmptyState(container, 'Необходимо войти в систему', 'fa-user-lock');
        return;
    }
    
    // Получаем историю покупок
    const purchases = user.purchases || [];
    
    if (purchases.length === 0) {
        showEmptyState(
            container,
            'История активности пуста',
            'fa-history',
            'Ваши покупки и действия будут отображаться здесь'
        );
        return;
    }
    
    // Создаем список активности
    container.className = 'space-y-4';
    
    purchases.forEach(purchase => {
        const activityItem = document.createElement('div');
        activityItem.className = 'bg-[#16161a] rounded-xl p-4 flex items-center gap-4';
        
        activityItem.innerHTML = `
            <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img src="${purchase.image}" alt="${purchase.title}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
                <h3 class="font-bold mb-1">${purchase.title}</h3>
                <p class="text-sm text-gray-400">Куплено за ${purchase.price} ETH</p>
            </div>
            <div class="text-right">
                <div class="text-sm text-gray-400">${new Date(purchase.date).toLocaleDateString('ru-RU')}</div>
                <div class="text-xs text-gray-500">${new Date(purchase.date).toLocaleTimeString('ru-RU')}</div>
            </div>
        `;
        
        container.appendChild(activityItem);
    });
}

/**
 * Показать пустое состояние
 */
function showEmptyState(container, message, icon, actionText = null, actionLink = null) {
    container.className = 'flex flex-col items-center justify-center py-16 text-center';
    
    let actionButton = '';
    if (actionText && actionLink) {
        actionButton = `
            <a href="${actionLink}" class="mt-6 bg-[#7f5af0] text-white px-8 py-4 rounded-lg hover:bg-[#6a4ac9] transition-all inline-flex items-center gap-2 font-medium text-lg">
                <i class="fas fa-plus-circle text-xl"></i>
                <span>${actionText}</span>
            </a>
        `;
    } else if (actionText) {
        actionButton = `<p class="mt-4 text-gray-500">${actionText}</p>`;
    }
    
    container.innerHTML = `
        <div class="text-gray-400 mb-6">
            <i class="fas ${icon} text-7xl opacity-50"></i>
        </div>
        <p class="text-2xl font-bold text-gray-300 mb-2">${message}</p>
        ${actionButton}
    `;
}

/**
 * Получить NFT созданные пользователем
 */
function getUserCreatedNfts(username) {
    try {
        const userNftsKey = `user_nfts_${username}`;
        const userNftsJson = localStorage.getItem(userNftsKey);
        
        if (!userNftsJson) {
            return [];
        }
        
        return JSON.parse(userNftsJson);
    } catch (error) {
        console.error('Error loading user NFTs:', error);
        return [];
    }
}

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileTabs);
} else {
    initProfileTabs();
}
