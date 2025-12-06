// Функции для динамической генерации карточек NFT



function createNftCard(nft, style = 'marketplace') {

    if (style === 'marketplace') {

        return createMarketplaceCard(nft);

    } else if (style === 'index') {

        return createIndexCard(nft);

    } else if (style === 'profile') {

        return createProfileCard(nft);

    }

    return createMarketplaceCard(nft);

}



function createMarketplaceCard(nft) {

    const card = document.createElement('div');

    card.className = 'nft-card';

    

    const isInCart = typeof cart !== 'undefined' ? cart.isInCart(nft.id) : false;

    

    card.innerHTML = `

        <a href="nft-detail.html?id=${nft.id}">

            <div class="relative">

                <img src="${nft.image}" alt="${nft.fullName}" class="nft-image">

                <div class="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">

                    <i class="fas fa-ethereum mr-1"></i> ${nft.price} ETH

                </div>

            </div>

        </a>

        <div class="p-4">

            <a href="nft-detail.html?id=${nft.id}">

                <h3 class="font-bold mb-1 hover:text-[#7f5af0]">${nft.fullName}</h3>

            </a>

            <div class="flex justify-between items-center">

                <div class="flex items-center">

                    <img src="${nft.creator.avatar}" alt="${nft.creator.name}" class="creator-avatar mr-2">

                    <span class="text-sm">${nft.creator.name}</span>

                </div>

                <div class="text-sm text-gray-500">${nft.edition}</div>

            </div>

            <div class="mt-3 flex justify-between items-center text-sm">

                <div>

                    <div class="text-gray-500">Цена</div>

                    <div class="font-medium">${nft.price} ETH</div>

                </div>

                <div class="text-right">

                    <div class="text-gray-500">Последняя цена</div>

                    <div class="font-medium">${nft.lastPrice} ETH</div>

                </div>

            </div>

            <button class="add-to-cart-btn w-full mt-3 ${isInCart ? 'cart-in-cart' : ''}" 

                    data-nft-id="${nft.id}" ${isInCart ? '' : ''}>

                <span class="btn-text">

                    <i class="fas fa-shopping-cart mr-2"></i> ${isInCart ? 'В корзине' : 'В корзину'}

                </span>

                ${isInCart ? '<span class="btn-hover-text"><i class="fas fa-trash mr-2"></i> Удалить из корзины</span>' : ''}

            </button>

        </div>

    `;

    

    // Обработчик добавления/удаления из корзины

    const addBtn = card.querySelector('.add-to-cart-btn');

    if (addBtn && typeof addToCart !== 'undefined' && typeof removeFromCart !== 'undefined') {

        // Функция для добавления в корзину

        const handleAddToCart = (e) => {

            e.preventDefault();

            e.stopPropagation();

            addToCart(nft.id);

            if (typeof showNotification !== 'undefined') {

                showNotification('Товар добавлен в корзину', 'success');

            }

            if (typeof updateCartBadge !== 'undefined') {

                updateCartBadge();

            }

            // Обновляем кнопку

            addBtn.classList.add('cart-in-cart');

            addBtn.innerHTML = `

                <span class="btn-text">

                    <i class="fas fa-shopping-cart mr-2"></i> В корзине

                </span>

                <span class="btn-hover-text">

                    <i class="fas fa-trash mr-2"></i> Удалить из корзины

                </span>

            `;

            // Заменяем обработчик на удаление

            addBtn.removeEventListener('click', handleAddToCart);

            addBtn.addEventListener('click', handleRemoveFromCart);

        };

        

        // Функция для удаления из корзины

        const handleRemoveFromCart = (e) => {

            e.preventDefault();

            e.stopPropagation();

            removeFromCart(nft.id);

            if (typeof showNotification !== 'undefined') {

                showNotification('Товар удален из корзины', 'success');

            }

            if (typeof updateCartBadge !== 'undefined') {

                updateCartBadge();

            }

            // Обновляем кнопку

            addBtn.classList.remove('cart-in-cart');

            addBtn.innerHTML = `

                <span class="btn-text">

                    <i class="fas fa-shopping-cart mr-2"></i> В корзину

                </span>

            `;

            // Заменяем обработчик на добавление

            addBtn.removeEventListener('click', handleRemoveFromCart);

            addBtn.addEventListener('click', handleAddToCart);

        };

        

        // Устанавливаем начальный обработчик

        if (isInCart) {

            addBtn.addEventListener('click', handleRemoveFromCart);

        } else {

            addBtn.addEventListener('click', handleAddToCart);

        }

    }

    

    return card;

}



function createIndexCard(nft) {

    const card = document.createElement('a');

    card.href = `nft-detail.html?id=${nft.id}`;

    card.className = 'nft-card card-hover transition-all';

    

    card.innerHTML = `

        <img src="${nft.image}" alt="${nft.fullName}" class="nft-card-image">

        <div class="p-4">

            <div class="flex justify-between items-start mb-3">

                <div>

                    <h3 class="font-bold">${nft.name}</h3>

                    <div class="text-sm text-gray-400">by ${nft.creator.name}</div>

                </div>

                <span class="price-tag">${nft.price} ETH</span>

            </div>

            <div class="flex justify-between items-center">

                <div class="flex items-center">

                    <img src="${nft.creator.avatar}" alt="${nft.creator.name}" class="creator-avatar mr-2">

                    <div>

                        <div class="text-xs text-gray-400">Текущая ставка</div>

                        <div class="text-sm font-medium">${nft.currentBid} ETH</div>

                    </div>

                </div>

                <span class="category-tag">${nft.category}</span>

            </div>

        </div>

    `;

    

    return card;

}



function createProfileCard(nft) {

    const card = document.createElement('a');

    card.href = `nft-detail.html?id=${nft.id}`;

    card.className = 'nft-card hover:transform hover:scale-105 transition-all duration-300';

    

    // Проверяем, является ли NFT пользовательским

    const isUserCreated = nft.isUserCreated === true;

    const userBadge = isUserCreated ? '<span class="absolute top-2 right-2 bg-[#7f5af0] text-white text-xs px-2 py-1 rounded-full font-medium"><i class="fas fa-crown mr-1"></i>Ваше</span>' : '';

    

    card.innerHTML = `

        <div class="relative">

            <img src="${nft.image}" alt="${nft.fullName}" class="nft-image">

            ${userBadge}

            <div class="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">

                <i class="fas fa-ethereum mr-1"></i> ${nft.price} ETH

            </div>

        </div>

        <div class="p-4">

            <div class="flex justify-between items-start mb-3">

                <div class="flex-1">

                    <h3 class="font-bold text-lg mb-1 hover:text-[#7f5af0] transition-colors">${nft.fullName || nft.title}</h3>

                    <div class="text-sm text-gray-400">${nft.edition}</div>

                </div>

            </div>

            <div class="flex justify-between items-center pt-3 border-t border-gray-700">

                <div class="flex items-center gap-2">

                    <img src="${nft.creator.avatar}" alt="${nft.creator.name}" class="w-6 h-6 rounded-full border border-[#7f5af0]">

                    <span class="text-xs text-gray-400">${nft.creator.name}</span>

                </div>

                <div class="text-right">

                    <div class="text-xs text-gray-500">Категория</div>

                    <div class="text-sm font-medium text-[#7f5af0]">${nft.category}</div>

                </div>

            </div>

        </div>

    `;

    

    return card;

}



// Функция для загрузки NFT в контейнер

function loadNftCards(containerId, nfts, style = 'marketplace') {

    const container = document.getElementById(containerId);

    if (!container) return;

    

    container.innerHTML = '';

    

    nfts.forEach(nft => {

        const card = createNftCard(nft, style);

        container.appendChild(card);

    });

}



// Функция для загрузки NFT по категории

function loadNftsByCategory(containerId, category, style = 'marketplace') {

    const nfts = getNftsByCategory(category);

    loadNftCards(containerId, nfts, style);

}



// Функция для загрузки всех NFT

function loadAllNfts(containerId, style = 'marketplace') {

    const nfts = getAllNfts();

    loadNftCards(containerId, nfts, style);

}



