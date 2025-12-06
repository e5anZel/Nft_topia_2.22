// Логика страницы корзины



document.addEventListener('DOMContentLoaded', function() {

    loadCartItems();

    setupEventListeners();

});



function loadCartItems() {

    const cartItems = cart.getCartItems();

    const container = document.getElementById('cart-items-list');

    const emptyCart = document.getElementById('empty-cart');

    const cartContainer = document.getElementById('cart-items-container');



    if (cartItems.length === 0) {

        emptyCart.classList.remove('hidden');

        cartContainer.classList.add('hidden');

        return;

    }



    emptyCart.classList.add('hidden');

    cartContainer.classList.remove('hidden');

    container.innerHTML = '';



    cartItems.forEach(item => {

        const cartItem = createCartItem(item);

        container.appendChild(cartItem);

    });



    updateCartSummary();

}



function createCartItem(item) {

    const div = document.createElement('div');

    div.className = 'cart-item';

    

    div.innerHTML = `

        <div class="flex gap-4">

            <a href="nft-detail.html?id=${item.id}">

                <img src="${item.image}" alt="${item.name}" class="cart-item-image">

            </a>

            <div class="flex-1">

                <div class="flex justify-between items-start mb-2">

                    <div>

                        <a href="nft-detail.html?id=${item.id}" class="text-xl font-bold hover:text-[#7f5af0]">

                            ${item.name}

                        </a>

                        <p class="text-gray-400 text-sm mt-1">${item.category} • ${item.creator}</p>

                    </div>

                    <button class="remove-item-btn text-red-500 hover:text-red-400" data-id="${item.id}">

                        <i class="fas fa-times text-xl"></i>

                    </button>

                </div>

                <div class="flex justify-between items-center mt-4">

                    <div>

                        <span class="text-gray-400 text-sm">Цена:</span>

                        <span class="text-xl font-bold text-[#7f5af0] ml-2">${item.price} ETH</span>

                    </div>

                    <a href="nft-detail.html?id=${item.id}" class="text-[#7f5af0] hover:underline">

                        Подробнее <i class="fas fa-arrow-right ml-1"></i>

                    </a>

                </div>

            </div>

        </div>

    `;



    // Обработчик удаления

    const removeBtn = div.querySelector('.remove-item-btn');

    removeBtn.addEventListener('click', () => {

        removeFromCart(item.id);

    });



    return div;

}



function updateCartSummary() {

    const count = cart.getCartCount();

    const total = cart.getTotalPrice();



    document.getElementById('cart-count').textContent = count;

    document.getElementById('cart-total').textContent = `${total.toFixed(2)} ETH`;

    document.getElementById('cart-total-price').textContent = `${total.toFixed(2)} ETH`;

}



function setupEventListeners() {

    // Кнопка оформления заказа

    const checkoutBtn = document.getElementById('checkout-btn');

    checkoutBtn.addEventListener('click', () => {

        const cartItems = cart.getCartItems();

        

        if (cartItems.length === 0) {

            showNotification('Корзина пуста', 'error');

            return;

        }



        const user = getCurrentUser();

        if (!user) {

            showNotification('Необходимо войти в систему для оформления заказа', 'error');

            setTimeout(() => {

                window.location.href = 'login.html';

            }, 2000);

            return;

        }



        // Оформление заказа

        const total = cart.getTotalPrice();

        const confirmMessage = `Оформить заказ на сумму ${total.toFixed(2)} ETH?`;

        

        if (confirm(confirmMessage)) {

            // Добавляем покупки в историю пользователя

            cartItems.forEach(item => {

                userData.addPurchase(user.id, item.id, item.price);

            });



            // Очищаем корзину

            cart.clearCart();

            showNotification('Заказ успешно оформлен!', 'success');

            

            setTimeout(() => {

                loadCartItems();

            }, 1000);

        }

    });



    // Кнопка очистки корзины

    const clearBtn = document.getElementById('clear-cart-btn');

    clearBtn.addEventListener('click', () => {

        if (confirm('Вы уверены, что хотите очистить корзину?')) {

            cart.clearCart();

            showNotification('Корзина очищена', 'success');

            loadCartItems();

        }

    });

}



