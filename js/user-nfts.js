// Система управления пользовательскими NFT

/**
 * Создать новый NFT
 * @param {Object} nftData - Данные NFT
 * @returns {Object} Созданный NFT объект
 */
function createUserNft(nftData) {
    const user = getCurrentUser();
    
    if (!user) {
        throw new Error('User must be logged in to create NFT');
    }
    
    // Генерируем уникальный ID для NFT
    const nftId = generateNftId();
    
    // Генерируем полную структуру NFT совместимую с системными NFT
    const createdDate = new Date().toISOString().split('T')[0];
    const userAvatar = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=7f5af0&color=fff`;
    
    const nft = {
        id: nftId,
        name: nftData.title,
        number: '',
        fullName: nftData.title,
        title: nftData.title,
        description: nftData.description || 'Создано пользователем',
        price: parseFloat(nftData.price),
        lastPrice: 0,
        currentBid: 0,
        image: nftData.image,
        category: nftData.category,
        creator: {
            name: '@' + user.username,
            avatar: userAvatar,
            fullName: user.fullName || user.username
        },
        owner: {
            name: '@' + user.username,
            avatar: userAvatar,
            fullName: user.fullName || user.username
        },
        collection: 'Пользовательские NFT',
        edition: '1 из 1',
        properties: [
            { trait: 'Категория', value: nftData.category },
            { trait: 'Автор', value: user.fullName || user.username },
            { trait: 'Редкость', value: 'Уникальное' }
        ],
        history: [
            { event: 'Создано', date: createdDate, price: null },
            { event: 'Выставлено', date: createdDate, price: parseFloat(nftData.price) }
        ],
        likes: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        isUserCreated: true
    };
    
    // Сохраняем NFT в localStorage пользователя
    saveUserNft(user.username, nft);
    
    // Добавляем в общий список NFT для отображения в маркетплейсе
    addNftToMarketplace(nft);
    
    // Обновляем статистику пользователя
    updateUserStats(user.username, 'nftCreated');
    
    return nft;
}

/**
 * Генерировать уникальный ID для NFT
 */
function generateNftId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `user-nft-${timestamp}-${random}`;
}

/**
 * Сохранить NFT пользователя в localStorage
 */
function saveUserNft(username, nft) {
    try {
        const userNftsKey = `user_nfts_${username}`;
        const existingNfts = getUserCreatedNfts(username);
        
        // Добавляем новый NFT в начало массива
        existingNfts.unshift(nft);
        
        // Сохраняем в localStorage
        localStorage.setItem(userNftsKey, JSON.stringify(existingNfts));
        
        return true;
    } catch (error) {
        console.error('Error saving user NFT:', error);
        return false;
    }
}

/**
 * Получить все NFT созданные пользователем
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

/**
 * Добавить NFT в общий маркетплейс
 */
function addNftToMarketplace(nft) {
    try {
        // Получаем список пользовательских NFT в маркетплейсе
        const marketplaceNftsKey = 'marketplace_user_nfts';
        let marketplaceNfts = [];
        
        const existingJson = localStorage.getItem(marketplaceNftsKey);
        if (existingJson) {
            marketplaceNfts = JSON.parse(existingJson);
        }
        
        // Добавляем новый NFT
        marketplaceNfts.unshift(nft);
        
        // Сохраняем
        localStorage.setItem(marketplaceNftsKey, JSON.stringify(marketplaceNfts));
        
        return true;
    } catch (error) {
        console.error('Error adding NFT to marketplace:', error);
        return false;
    }
}

/**
 * Получить все пользовательские NFT из маркетплейса
 */
function getMarketplaceUserNfts() {
    try {
        const marketplaceNftsKey = 'marketplace_user_nfts';
        const nftsJson = localStorage.getItem(marketplaceNftsKey);
        
        if (!nftsJson) {
            return [];
        }
        
        return JSON.parse(nftsJson);
    } catch (error) {
        console.error('Error loading marketplace user NFTs:', error);
        return [];
    }
}

/**
 * Получить все NFT (системные + пользовательские)
 * Переопределяем функцию getAllNfts для включения пользовательских NFT
 */
function getAllNftsWithUserCreated() {
    // Получаем системные NFT
    const systemNfts = typeof getAllNfts !== 'undefined' ? getAllNfts() : [];
    
    // Получаем пользовательские NFT
    const userNfts = getMarketplaceUserNfts();
    
    // Объединяем (пользовательские в начале)
    return [...userNfts, ...systemNfts];
}

/**
 * Обновить статистику пользователя
 */
function updateUserStats(username, action) {
    try {
        const user = getCurrentUser();
        
        if (!user || user.username !== username) {
            return;
        }
        
        // Обновляем счетчики в зависимости от действия
        switch(action) {
            case 'nftCreated':
                // Количество NFT уже подсчитывается динамически
                break;
            case 'nftSold':
                // Можно добавить логику для отслеживания продаж
                break;
        }
        
        // Сохраняем обновленного пользователя
        updateCurrentUser(user);
        
    } catch (error) {
        console.error('Error updating user stats:', error);
    }
}

/**
 * Обновить текущего пользователя в localStorage
 */
function updateCurrentUser(updatedUser) {
    try {
        // Обновляем в текущей сессии
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Обновляем в списке всех пользователей
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === updatedUser.username);
        
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        return true;
    } catch (error) {
        console.error('Error updating current user:', error);
        return false;
    }
}

/**
 * Удалить NFT пользователя
 */
function deleteUserNft(nftId, username) {
    try {
        // Удаляем из пользовательских NFT
        const userNftsKey = `user_nfts_${username}`;
        let userNfts = getUserCreatedNfts(username);
        userNfts = userNfts.filter(nft => nft.id !== nftId);
        localStorage.setItem(userNftsKey, JSON.stringify(userNfts));
        
        // Удаляем из маркетплейса
        const marketplaceNftsKey = 'marketplace_user_nfts';
        let marketplaceNfts = getMarketplaceUserNfts();
        marketplaceNfts = marketplaceNfts.filter(nft => nft.id !== nftId);
        localStorage.setItem(marketplaceNftsKey, JSON.stringify(marketplaceNfts));
        
        return true;
    } catch (error) {
        console.error('Error deleting user NFT:', error);
        return false;
    }
}

/**
 * Получить NFT по ID (включая пользовательские)
 */
function getNftByIdWithUserCreated(nftId) {
    // Сначала ищем в пользовательских NFT
    const userNfts = getMarketplaceUserNfts();
    const userNft = userNfts.find(nft => nft.id === nftId);
    
    if (userNft) {
        return userNft;
    }
    
    // Если не найден, ищем в системных NFT
    return typeof getNftById !== 'undefined' ? getNftById(nftId) : null;
}

/**
 * Валидация данных NFT
 */
function validateNftData(nftData) {
    const errors = [];
    
    if (!nftData.title || nftData.title.trim().length === 0) {
        errors.push('Название NFT обязательно');
    }
    
    if (nftData.title && nftData.title.length > 100) {
        errors.push('Название NFT не должно превышать 100 символов');
    }
    
    if (!nftData.image || nftData.image.trim().length === 0) {
        errors.push('Изображение NFT обязательно');
    }
    
    if (!nftData.price || parseFloat(nftData.price) <= 0) {
        errors.push('Цена должна быть больше 0');
    }
    
    if (parseFloat(nftData.price) > 1000000) {
        errors.push('Цена не должна превышать 1,000,000 ETH');
    }
    
    if (!nftData.category || nftData.category.trim().length === 0) {
        errors.push('Категория обязательна');
    }
    
    if (nftData.description && nftData.description.length > 1000) {
        errors.push('Описание не должно превышать 1000 символов');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * API-совместимые функции для работы с NFT
 */
const UserNftAPI = {
    // Создать NFT
    create: async function(nftData) {
        return new Promise((resolve, reject) => {
            try {
                // Валидация
                const validation = validateNftData(nftData);
                if (!validation.isValid) {
                    reject(new Error(validation.errors.join(', ')));
                    return;
                }
                
                // Создание NFT
                const nft = createUserNft(nftData);
                resolve(nft);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Получить NFT пользователя
    getUserNfts: async function(username) {
        return new Promise((resolve) => {
            const nfts = getUserCreatedNfts(username);
            resolve(nfts);
        });
    },
    
    // Получить все NFT (включая пользовательские)
    getAllNfts: async function() {
        return new Promise((resolve) => {
            const nfts = getAllNftsWithUserCreated();
            resolve(nfts);
        });
    },
    
    // Получить NFT по ID
    getNftById: async function(nftId) {
        return new Promise((resolve) => {
            const nft = getNftByIdWithUserCreated(nftId);
            resolve(nft);
        });
    },
    
    // Удалить NFT
    delete: async function(nftId, username) {
        return new Promise((resolve, reject) => {
            try {
                const success = deleteUserNft(nftId, username);
                if (success) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Failed to delete NFT'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
};
