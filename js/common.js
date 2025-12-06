// Общие функции для всех страниц



document.addEventListener('DOMContentLoaded', function() {

    // Инициализация корзины

    if (typeof cart !== 'undefined') {

        cart.updateCartBadge();

    }



    // Инициализация поиска

    initSearch();



    // Инициализация мобильного меню

    initMobileMenu();



    // Инициализация кнопок на главной странице

    initHomeButtons();

});



// Поиск

function initSearch() {

    const searchButtons = document.querySelectorAll('.search-button, button:has(.fa-search)');

    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Поиск"], input[type="text"][placeholder*="поиск"]');

    

    searchButtons.forEach(button => {

        button.addEventListener('click', (e) => {

            e.preventDefault();

            const searchInput = button.closest('header')?.querySelector('input[type="text"]') || 

                              document.querySelector('input[type="text"][placeholder*="Поиск"], input[type="text"][placeholder*="поиск"]');

            

            if (searchInput) {

                searchInput.focus();

                searchInput.style.display = searchInput.style.display === 'none' ? 'block' : 'block';

            } else {

                // Если нет поля поиска, открываем модальное окно поиска

                openSearchModal();

            }

        });

    });



    // Обработка поиска при вводе

    searchInputs.forEach(input => {

        input.addEventListener('keypress', (e) => {

            if (e.key === 'Enter') {

                e.preventDefault();

                performSearch(input.value);

            }

        });



        // Кнопка поиска рядом с полем

        const searchBtn = input.parentElement?.querySelector('button');

        if (searchBtn) {

            searchBtn.addEventListener('click', () => {

                performSearch(input.value);

            });

        }

    });

}



function performSearch(query) {

    if (!query.trim()) {

        if (window.location.pathname.includes('marketplace.html')) {

            // Если мы уже на странице маркетплейса, просто применяем фильтр

            if (typeof nftFilters !== 'undefined') {

                nftFilters.filters.search = query.toLowerCase();

                nftFilters.applyFilters();

            }

        } else {

            showNotification('Введите поисковый запрос', 'error');

        }

        return;

    }



    // Если мы на странице маркетплейса, применяем поиск напрямую

    if (window.location.pathname.includes('marketplace.html')) {

        if (typeof nftFilters !== 'undefined') {

            nftFilters.filters.search = query.toLowerCase();

            nftFilters.applyFilters();

        }

    } else {

        // Иначе переходим на страницу маркетплейса с поисковым запросом

        window.location.href = `marketplace.html?search=${encodeURIComponent(query)}`;

    }

}



function openSearchModal() {

    const modal = document.createElement('div');

    modal.className = 'fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center';

    modal.innerHTML = `

        <div class="bg-[#16161a] rounded-xl p-6 w-full max-w-md">

            <div class="flex justify-between items-center mb-4">

                <h2 class="text-xl font-bold">Поиск NFT</h2>

                <button class="close-search text-gray-400 hover:text-white">

                    <i class="fas fa-times text-xl"></i>

                </button>

            </div>

            <div class="relative">

                <input type="text" id="search-modal-input" 

                       class="w-full bg-[#242629] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5af0]" 

                       placeholder="Поиск по названию, автору, категории...">

                <button class="absolute right-2 top-2 bg-[#7f5af0] text-white px-4 py-2 rounded-lg hover:bg-[#6a4ac9]">

                    <i class="fas fa-search"></i>

                </button>

            </div>

        </div>

    `;



    document.body.appendChild(modal);



    const input = modal.querySelector('#search-modal-input');

    input.focus();



    modal.querySelector('.close-search').addEventListener('click', () => {

        document.body.removeChild(modal);

    });



    modal.querySelector('button').addEventListener('click', () => {

        performSearch(input.value);

    });



    input.addEventListener('keypress', (e) => {

        if (e.key === 'Enter') {

            performSearch(input.value);

        }

    });



    modal.addEventListener('click', (e) => {

        if (e.target === modal) {

            document.body.removeChild(modal);

        }

    });

}



// Мобильное меню

function initMobileMenu() {

    const mobileMenuButtons = document.querySelectorAll('#mobile-menu-button');

    const closeMobileMenuButtons = document.querySelectorAll('#close-mobile-menu');

    const mobileMenus = document.querySelectorAll('#mobile-menu, .mobile-menu');



    mobileMenuButtons.forEach(button => {

        button.addEventListener('click', () => {

            mobileMenus.forEach(menu => {

                menu.classList.add('active');

                document.body.style.overflow = 'hidden';

            });

        });

    });



    closeMobileMenuButtons.forEach(button => {

        button.addEventListener('click', () => {

            mobileMenus.forEach(menu => {

                menu.classList.remove('active');

                document.body.style.overflow = '';

            });

        });

    });



    // Закрытие при клике вне меню

    mobileMenus.forEach(menu => {

        menu.addEventListener('click', (e) => {

            if (e.target === menu) {

                menu.classList.remove('active');

                document.body.style.overflow = '';

            }

        });

    });

}



// Кнопки на главной странице

function initHomeButtons() {

    // Кнопка "Создать NFT"

    const createBtn = document.getElementById('create-nft-btn');

    if (createBtn) {

        createBtn.addEventListener('click', (e) => {

            e.preventDefault();

            const user = typeof getCurrentUser !== 'undefined' ? getCurrentUser() : null;

            if (!user) {

                showNotification('Необходимо войти в систему для создания NFT', 'error');

                setTimeout(() => {

                    window.location.href = 'login.html';

                }, 2000);

            } else {

                showNotification('Функция создания NFT будет доступна в ближайшее время', 'info');

            }

        });

    }

}



// Обработка поиска на странице маркетплейса

function handleMarketplaceSearch() {

    const urlParams = new URLSearchParams(window.location.search);

    const searchQuery = urlParams.get('search');

    

    if (searchQuery) {

        const searchInput = document.querySelector('input[type="text"][placeholder*="Поиск"]');

        if (searchInput) {

            searchInput.value = searchQuery;

        }

        

        // Фильтруем NFT по запросу

        filterNftsBySearch(searchQuery);

    }

}



function filterNftsBySearch(query) {

    const allNfts = getAllNfts();

    const searchLower = query.toLowerCase();

    

    const filtered = allNfts.filter(nft => 

        nft.name.toLowerCase().includes(searchLower) ||

        nft.fullName.toLowerCase().includes(searchLower) ||

        nft.creator.name.toLowerCase().includes(searchLower) ||

        nft.category.toLowerCase().includes(searchLower) ||

        nft.description.toLowerCase().includes(searchLower)

    );

    

    const container = document.getElementById('nft-grid');

    if (container) {

        loadNftCards('nft-grid', filtered, 'marketplace');

        

        if (filtered.length === 0) {

            container.innerHTML = `

                <div class="col-span-full text-center py-12">

                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>

                    <p class="text-xl font-bold mb-2">Ничего не найдено</p>

                    <p class="text-gray-400">Попробуйте изменить поисковый запрос</p>

                </div>

            `;

        }

    }

}



