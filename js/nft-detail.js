// Загрузка и отображение данных NFT на странице деталей



document.addEventListener('DOMContentLoaded', async function() {

    // Получаем ID NFT из URL параметров

    const urlParams = new URLSearchParams(window.location.search);

    const nftId = urlParams.get('id');

    

    if (!nftId) {

        showError();

        return;

    }

    

    // Получаем данные NFT с сервера

    const nft = await fetchNftById(nftId);

    

    if (!nft) {

        showError();

        return;

    }

    

    // Отображаем данные NFT

    displayNft(nft);

    

    // Загружаем похожие NFT

    loadSimilarNfts(nft);

});



function displayNft(nft) {

    // Скрываем загрузку и показываем контент

    document.getElementById('loading').classList.add('hidden');

    document.getElementById('nft-content').classList.remove('hidden');

    

    // Устанавливаем заголовок страницы

    document.getElementById('page-title').textContent = `${nft.fullName} | NFTopia Galaxy`;

    document.getElementById('breadcrumb-name').textContent = nft.fullName;

    

    // Изображение

    document.getElementById('nft-image').src = nft.image;

    document.getElementById('nft-image').alt = nft.fullName;

    

    // Название и основная информация

    document.getElementById('nft-name').textContent = nft.fullName;

    document.getElementById('nft-category').textContent = nft.category;

    document.getElementById('nft-collection').textContent = `Коллекция: ${nft.collection}`;

    document.getElementById('nft-description').textContent = nft.description;

    

    // Цены

    document.getElementById('nft-price').textContent = `${nft.price} ETH`;

    document.getElementById('nft-last-price').textContent = `${nft.lastPrice} ETH`;

    

    // Создатель

    document.getElementById('creator-avatar').src = nft.creator.avatar;

    document.getElementById('creator-avatar').alt = nft.creator.fullName;

    document.getElementById('creator-name').textContent = nft.creator.fullName;

    document.getElementById('creator-username').textContent = nft.creator.name;

    

    // Владелец

    document.getElementById('owner-avatar').src = nft.owner.avatar;

    document.getElementById('owner-avatar').alt = nft.owner.fullName;

    document.getElementById('owner-name').textContent = nft.owner.fullName;

    document.getElementById('owner-username').textContent = nft.owner.name;

    

    // Статистика

    document.getElementById('nft-likes').textContent = nft.likes.toLocaleString();

    document.getElementById('nft-views').textContent = nft.views.toLocaleString();

    document.getElementById('nft-edition').textContent = nft.edition;

    

    // Свойства - улучшенное отображение с иконками

    const propertiesContainer = document.getElementById('nft-properties');

    propertiesContainer.className = 'property-grid';

    propertiesContainer.innerHTML = '';

    

    // Иконки для разных типов свойств

    const propertyIcons = {

        'Редкость': 'fa-gem',

        'Тип': 'fa-tag',

        'Цвет': 'fa-palette',

        'Размер': 'fa-expand',

        'Стиль': 'fa-brush',

        'Год': 'fa-calendar',

        'Автор': 'fa-user',

        'Коллекция': 'fa-layer-group'

    };

    

    nft.properties.forEach(property => {

        const propertyItem = document.createElement('div');

        propertyItem.className = 'property-item';

        const iconClass = propertyIcons[property.trait] || 'fa-star';

        propertyItem.innerHTML = `

            <div class="property-icon-wrapper">

                <i class="fas ${iconClass}"></i>

            </div>

            <div class="property-name">${property.trait}</div>

            <div class="property-value">${property.value}</div>

        `;

        propertiesContainer.appendChild(propertyItem);

    });

    

    // История

    const historyContainer = document.getElementById('nft-history');

    historyContainer.innerHTML = '';

    nft.history.forEach(item => {

        const historyItem = document.createElement('div');

        historyItem.className = 'history-item';

        const priceText = item.price ? `${item.price} ETH` : '—';

        historyItem.innerHTML = `

            <div class="flex justify-between items-start">

                <div>

                    <div class="font-medium">${item.event}</div>

                    <div class="text-sm text-gray-400">${formatDate(item.date)}</div>

                </div>

                <div class="text-[#7f5af0] font-medium">${priceText}</div>

            </div>

        `;

        historyContainer.appendChild(historyItem);

    });

    

    // Обработчики кнопок

    setupButtons(nft);

}



function setupButtons(nft) {

    const buyButton = document.querySelector('.btn-primary');

    const bidButton = document.querySelector('.btn-secondary');

    const addToCartButton = document.querySelector('.btn-add-to-cart');

    

    // Кнопка покупки

    if (buyButton) {

        buyButton.addEventListener('click', () => {

            const user = getCurrentUser();

            if (!user) {

                showNotification('Необходимо войти в систему для покупки', 'error');

                setTimeout(() => {

                    window.location.href = 'login.html';

                }, 2000);

                return;

            }



            if (confirm(`Купить NFT "${nft.fullName}" за ${nft.price} ETH?`)) {

                // Добавляем покупку в историю пользователя

                userData.addPurchase(user.id, nft.id, nft.price);

                showNotification('Покупка успешно совершена!', 'success');

                

                // Обновляем информацию о владельце (в реальном приложении это делается через API)

                setTimeout(() => {

                    showNotification('NFT теперь в вашей коллекции', 'success');

                }, 1000);

            }

        });

    }

    

    // Кнопка ставки

    if (bidButton) {

        bidButton.addEventListener('click', () => {

            const user = getCurrentUser();

            if (!user) {

                showNotification('Необходимо войти в систему для размещения ставки', 'error');

                setTimeout(() => {

                    window.location.href = 'login.html';

                }, 2000);

                return;

            }



            const minBid = nft.currentBid + 0.1;

            const bidAmount = prompt(`Введите сумму ставки (минимум ${minBid.toFixed(2)} ETH):`);

            

            if (bidAmount) {

                const amount = parseFloat(bidAmount);

                if (isNaN(amount) || amount <= nft.currentBid) {

                    showNotification(`Ставка должна быть больше ${minBid.toFixed(2)} ETH`, 'error');

                    return;

                }

                

                showNotification(`Ставка ${amount.toFixed(2)} ETH размещена!`, 'success');

                // В реальном приложении здесь был бы запрос к API

            }

        });

    }



    // Кнопка добавления в корзину с функционалом удаления при наведении

    if (addToCartButton && typeof addToCart !== 'undefined' && typeof removeFromCart !== 'undefined') {

        const isInCart = typeof cart !== 'undefined' && cart.isInCart(nft.id);

        

        // Функция для добавления в корзину

        const handleAddToCart = (e) => {

            e.preventDefault();

            addToCart(nft.id);

            if (typeof showNotification !== 'undefined') {

                showNotification('Товар добавлен в корзину', 'success');

            }

            if (typeof updateCartBadge !== 'undefined') {

                updateCartBadge();

            }

            // Обновляем кнопку

            addToCartButton.classList.add('cart-in-cart');

            addToCartButton.innerHTML = `

                <span class="btn-text">

                    <i class="fas fa-check mr-2"></i> В корзине

                </span>

                <span class="btn-hover-text">

                    <i class="fas fa-trash mr-2"></i> Удалить из корзины

                </span>

            `;

            // Заменяем обработчик на удаление

            addToCartButton.removeEventListener('click', handleAddToCart);

            addToCartButton.addEventListener('click', handleRemoveFromCart);

        };

        

        // Функция для удаления из корзины

        const handleRemoveFromCart = (e) => {

            e.preventDefault();

            removeFromCart(nft.id);

            if (typeof showNotification !== 'undefined') {

                showNotification('Товар удален из корзины', 'success');

            }

            if (typeof updateCartBadge !== 'undefined') {

                updateCartBadge();

            }

            // Обновляем кнопку

            addToCartButton.classList.remove('cart-in-cart');

            addToCartButton.innerHTML = `

                <span class="btn-text">

                    <i class="fas fa-shopping-cart mr-2"></i> Добавить в корзину

                </span>

            `;

            // Заменяем обработчик на добавление

            addToCartButton.removeEventListener('click', handleRemoveFromCart);

            addToCartButton.addEventListener('click', handleAddToCart);

        };

        

        // Устанавливаем начальное состояние и обработчик

        if (isInCart) {

            addToCartButton.className = 'btn-add-to-cart cart-in-cart w-full mt-3';

            addToCartButton.innerHTML = `

                <span class="btn-text">

                    <i class="fas fa-check mr-2"></i> В корзине

                </span>

                <span class="btn-hover-text">

                    <i class="fas fa-trash mr-2"></i> Удалить из корзины

                </span>

            `;

            addToCartButton.addEventListener('click', handleRemoveFromCart);

        } else {

            addToCartButton.addEventListener('click', handleAddToCart);

        }

    }

}



function loadSimilarNfts(currentNft) {

    const allNfts = getAllNfts();

    const similarNfts = allNfts

        .filter(nft => nft.id !== currentNft.id && nft.category === currentNft.category)

        .slice(0, 4);

    

    const container = document.getElementById('similar-nfts');

    container.innerHTML = '';

    

    if (similarNfts.length === 0) {

        container.innerHTML = '<p class="text-gray-400 col-span-full text-center">Похожие NFT не найдены</p>';

        return;

    }

    

    similarNfts.forEach(nft => {

        const card = createNftCard(nft);

        container.appendChild(card);

    });

}



function createNftCard(nft) {

    const card = document.createElement('a');

    card.href = `nft-detail.html?id=${nft.id}`;

    card.className = 'bg-[#242629] rounded-xl overflow-hidden transition-all hover:transform hover:-translate-y-2 hover:shadow-lg';

    

    card.innerHTML = `

        <div class="relative">

            <img src="${nft.image}" alt="${nft.fullName}" class="w-full h-48 object-cover">

            <div class="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">

                <i class="fas fa-ethereum mr-1"></i> ${nft.price} ETH

            </div>

        </div>

        <div class="p-4">

            <h3 class="font-bold mb-2">${nft.fullName}</h3>

            <div class="flex justify-between items-center">

                <div class="flex items-center">

                    <img src="${nft.creator.avatar}" alt="${nft.creator.name}" class="w-8 h-8 rounded-full mr-2 border-2 border-[#7f5af0]">

                    <span class="text-sm text-gray-400">${nft.creator.name}</span>

                </div>

                <span class="text-xs text-gray-500">${nft.edition}</span>

            </div>

        </div>

    `;

    

    return card;

}



function formatDate(dateString) {

    const date = new Date(dateString);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString('ru-RU', options);

}



function showError() {

    document.getElementById('loading').classList.add('hidden');

    document.getElementById('error-message').classList.remove('hidden');

}



