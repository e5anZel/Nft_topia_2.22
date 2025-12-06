// Система корзины с использованием localStorage



class Cart {

    constructor() {

        this.baseStorageKey = 'nft_cart';

        this.currentUserKey = 'nft_current_user';

        this.init();

        this.setupSessionListeners();

    }



    init() {

        this.migrateLegacyCart();

        const storageKey = this.getStorageKey();

        if (!localStorage.getItem(storageKey)) {

            localStorage.setItem(storageKey, JSON.stringify([]));

        }

    }



    migrateLegacyCart() {

        try {

            const legacy = localStorage.getItem(this.baseStorageKey);

            if (!legacy) return;



            const targetKey = this.getStorageKey();

            if (!localStorage.getItem(targetKey)) {

                localStorage.setItem(targetKey, legacy);

            }

            localStorage.removeItem(this.baseStorageKey);

        } catch (e) {

            console.error('Ошибка миграции корзины:', e);

        }

    }



    getCurrentUser() {

        try {

            const user = localStorage.getItem(this.currentUserKey);

            return user ? JSON.parse(user) : null;

        } catch (e) {

            return null;

        }

    }



    getStorageKey() {

        const user = this.getCurrentUser();

        return user ? `${this.baseStorageKey}_${user.id}` : `${this.baseStorageKey}_guest`;

    }



    setupSessionListeners() {

        window.addEventListener('storage', (event) => {

            if (event.key === this.currentUserKey) {

                this.handleUserChange();

            }



            if (event.key && event.key.startsWith && event.key.startsWith(this.baseStorageKey)) {

                this.updateCartBadge();

            }

        });

    }



    handleUserChange() {

        this.init();

        this.updateCartBadge();



        if (typeof loadCartItems === 'function') {

            loadCartItems();

        }

    }



    // Получить корзину

    getCart() {

        try {

            const cart = localStorage.getItem(this.getStorageKey());

            return cart ? JSON.parse(cart) : [];

        } catch (e) {

            console.error('Ошибка при чтении корзины:', e);

            return [];

        }

    }



    // Сохранить корзину

    saveCart(cart) {

        try {

            localStorage.setItem(this.getStorageKey(), JSON.stringify(cart));

            this.updateCartBadge();

            return true;

        } catch (e) {

            console.error('Ошибка при сохранении корзины:', e);

            return false;

        }

    }



    // Добавить NFT в корзину

    addToCart(nftId) {

        const cart = this.getCart();

        const nft = getNftById(nftId);

        

        if (!nft) {

            return { success: false, message: 'NFT не найден' };

        }



        // Проверяем, не добавлен ли уже этот NFT

        if (cart.find(item => item.id === nftId)) {

            return { success: false, message: 'NFT уже в корзине' };

        }



        // Добавляем NFT в корзину

        const cartItem = {

            id: nft.id,

            name: nft.fullName,

            image: nft.image,

            price: nft.price,

            category: nft.category,

            creator: nft.creator.name,

            addedAt: new Date().toISOString()

        };



        cart.push(cartItem);

        this.saveCart(cart);

        

        return { success: true, message: 'NFT добавлен в корзину', cart: cart };

    }



    // Удалить NFT из корзины

    removeFromCart(nftId) {

        const cart = this.getCart();

        const filteredCart = cart.filter(item => item.id !== nftId);

        this.saveCart(filteredCart);

        return { success: true, message: 'NFT удален из корзины', cart: filteredCart };

    }



    // Очистить корзину

    clearCart() {

        this.saveCart([]);

        return { success: true, message: 'Корзина очищена' };

    }



    // Получить количество товаров в корзине

    getCartCount() {

        return this.getCart().length;

    }



    // Получить общую стоимость корзины

    getTotalPrice() {

        const cart = this.getCart();

        return cart.reduce((total, item) => total + item.price, 0);

    }



    // Проверить, есть ли NFT в корзине

    isInCart(nftId) {

        const cart = this.getCart();

        return cart.some(item => item.id === nftId);

    }



    // Обновить бейдж корзины в навигации

    updateCartBadge() {

        const count = this.getCartCount();

        const badges = document.querySelectorAll('.cart-badge');

        badges.forEach(badge => {

            if (count > 0) {

                badge.textContent = count;

                badge.classList.remove('hidden');

            } else {

                badge.classList.add('hidden');

            }

        });

    }



    // Получить все товары в корзине

    getCartItems() {

        return this.getCart();

    }

}



// Создаем глобальный экземпляр корзины

const cart = new Cart();



// Функции для использования в HTML

function addToCart(nftId) {

    const result = cart.addToCart(nftId);

    

    if (result.success) {

        showNotification('NFT добавлен в корзину', 'success');

        cart.updateCartBadge();

    } else {

        showNotification(result.message, 'error');

    }

    

    return result;

}



function removeFromCart(nftId) {

    const result = cart.removeFromCart(nftId);

    

    if (result.success) {

        showNotification('NFT удален из корзины', 'success');

        cart.updateCartBadge();

        

        // Если мы на странице корзины, обновляем список

        if (window.location.pathname.includes('cart.html')) {

            loadCartItems();

        }

    }

    

    return result;

}



function getCartCount() {

    return cart.getCartCount();

}



function getCartTotal() {

    return cart.getTotalPrice();

}



// Инициализация корзины при загрузке страницы

document.addEventListener('DOMContentLoaded', function() {

    cart.updateCartBadge();

});



