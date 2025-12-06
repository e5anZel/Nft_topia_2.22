// API клиент для получения данных NFT с сервера

// Кэш для хранения загруженных данных
let nftCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

// Функция для получения всех NFT с сервера
async function fetchAllNfts() {
    // Проверяем кэш
    if (nftCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
        return nftCache;
    }

    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Сохраняем в кэш
        nftCache = data;
        cacheTimestamp = Date.now();
        
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке NFT:', error);
        return [];
    }
}

// Функция для получения NFT по ID (синхронная - сначала пытается из кэша)
function getNftById(id) {
    // Если кэш есть, ищем в нём
    if (nftCache) {
        return nftCache.find(nft => nft.id === id) || null;
    }
    return null;
}

// Асинхронная функция для получения NFT по ID с сервера
async function fetchNftById(id) {
    try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                // Если не найден на сервере, проверяем пользовательские NFT
                if (typeof getNftByIdWithUserCreated !== 'undefined') {
                    return getNftByIdWithUserCreated(id);
                }
                return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка при загрузке NFT ${id}:`, error);
        // Если ошибка сети, проверяем пользовательские NFT
        if (typeof getNftByIdWithUserCreated !== 'undefined') {
            return getNftByIdWithUserCreated(id);
        }
        return null;
    }
}

// Функция для получения всех NFT (синхронная - возвращает кэш или пустой массив)
function getAllNfts() {
    return nftCache || [];
}

// Функция для получения NFT по категории
function getNftsByCategory(category) {
    if (!nftCache) {
        return [];
    }
    return nftCache.filter(nft => nft.category === category);
}

// Инициализация - загружаем данные при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        fetchAllNfts();
    });
} else {
    fetchAllNfts();
}
