// Система фильтрации и поиска NFT

class NFTFilters {
    constructor() {
        this.filters = {
            search: '',
            category: 'Все',
            creator: '',
            minPrice: 0,
            maxPrice: 100,
            sort: 'default'
        };
        this.allNfts = [];
        this.filteredNfts = [];
        this.init();
    }

    init() {
        // Используем функцию, которая включает пользовательские NFT
        if (typeof getAllNftsWithUserCreated !== 'undefined') {
            this.allNfts = getAllNftsWithUserCreated();
        } else {
            this.allNfts = getAllNfts();
        }
        this.setupEventListeners();
        this.populateCreators();
        this.applyFilters();
    }

    setupEventListeners() {
        // Поиск
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyFilters();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Фильтр по цене
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceMinInput = document.getElementById('price-min-input');
        const priceMaxInput = document.getElementById('price-max-input');
        
        if (priceMin && priceMax) {
            // Максимальное значение ползунка - 100 ETH
            const sliderMax = 100;
            priceMin.setAttribute('max', sliderMax);
            priceMax.setAttribute('max', sliderMax);
            priceMax.value = sliderMax;
            this.filters.maxPrice = sliderMax;
            
            // Инициализация полей ввода
            if (priceMinInput) {
                priceMinInput.value = '0';
            }
            if (priceMaxInput) {
                priceMaxInput.value = sliderMax.toString();
            }
            
            this.updatePriceDisplay();
            this.updatePriceTrack();

            // Обновление ползунков
            priceMin.addEventListener('input', (e) => {
                const sliderValue = parseFloat(e.target.value);
                const maxSliderValue = parseFloat(priceMax.value);
                
                // Ограничиваем минимальный ползунок максимальным
                if (sliderValue >= maxSliderValue) {
                    priceMin.value = maxSliderValue;
                }
                
                const finalValue = parseFloat(priceMin.value);
                this.filters.minPrice = finalValue;
                
                // Обновляем поле ввода (синхронизируем с ползунком)
                if (priceMinInput) {
                    priceMinInput.value = finalValue.toFixed(1);
                }
                
                this.updatePriceDisplay();
                this.updatePriceTrack();
                this.applyFilters();
            });

            priceMax.addEventListener('input', (e) => {
                const sliderValue = parseFloat(e.target.value);
                const minSliderValue = parseFloat(priceMin.value);
                
                // Ограничиваем максимальный ползунок минимальным
                if (sliderValue <= minSliderValue) {
                    priceMax.value = minSliderValue;
                }
                
                const finalValue = parseFloat(priceMax.value);
                this.filters.maxPrice = finalValue;
                
                // Обновляем поле ввода (синхронизируем с ползунком)
                if (priceMaxInput) {
                    priceMaxInput.value = finalValue.toFixed(1);
                }
                
                this.updatePriceDisplay();
                this.updatePriceTrack();
                this.applyFilters();
            });

            // Обновление полей ввода - можно вводить любые числа
            if (priceMinInput) {
                // Разрешаем ввод только чисел и точки
                priceMinInput.addEventListener('keydown', (e) => {
                    // Разрешаем: цифры, точка, Backspace, Delete, Tab, Escape, Enter, стрелки, минус
                    if (!/[0-9.]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '-'].includes(e.key)) {
                        e.preventDefault();
                    }
                    // Только одна точка
                    if (e.key === '.' && e.target.value.includes('.')) {
                        e.preventDefault();
                    }
                });

                priceMinInput.addEventListener('input', (e) => {
                    // Если пустое значение, разрешаем ввод
                    if (e.target.value === '' || e.target.value === '-') {
                        return;
                    }
                    
                    let value = parseFloat(e.target.value);
                    const sliderMax = parseFloat(priceMax.getAttribute('max'));
                    const maxInputValue = parseFloat(priceMaxInput?.value || priceMax.value);
                    
                    // Валидация минимального значения
                    if (isNaN(value)) {
                        return; // Позволяем продолжить ввод
                    }
                    if (value < 0) {
                        value = 0;
                        priceMinInput.value = '0';
                    }
                    
                    // Если значение больше максимума из поля ввода, не ограничиваем
                    // Но ограничиваем ползунок максимумом слайдера
                    if (value > maxInputValue) {
                        // Не позволяем минимуму быть больше максимума
                        value = maxInputValue;
                        priceMinInput.value = value.toString();
                    }
                    
                    // Обновляем ползунок (но не больше его максимума)
                    const sliderValue = Math.min(value, sliderMax);
                    priceMin.value = sliderValue;
                    
                    // Обновляем фильтр (используем реальное значение из поля, а не ползунка)
                    this.filters.minPrice = value;
                    this.updatePriceTrack();
                    this.applyFilters();
                });

                priceMinInput.addEventListener('blur', (e) => {
                    let value = parseFloat(e.target.value);
                    const maxInputValue = parseFloat(priceMaxInput?.value || priceMax.value);
                    const sliderMax = parseFloat(priceMax.getAttribute('max'));
                    
                    if (isNaN(value) || value < 0) {
                        value = 0;
                        priceMinInput.value = '0';
                    }
                    
                    if (value > maxInputValue) {
                        value = maxInputValue;
                        priceMinInput.value = value.toString();
                    }
                    
                    // Обновляем ползунок
                    const sliderValue = Math.min(value, sliderMax);
                    priceMin.value = sliderValue;
                    this.filters.minPrice = value;
                    this.updatePriceTrack();
                    this.applyFilters();
                });
            }

            if (priceMaxInput) {
                // Разрешаем ввод только чисел и точки
                priceMaxInput.addEventListener('keydown', (e) => {
                    // Разрешаем: цифры, точка, Backspace, Delete, Tab, Escape, Enter, стрелки
                    if (!/[0-9.]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                        e.preventDefault();
                    }
                    // Только одна точка
                    if (e.key === '.' && e.target.value.includes('.')) {
                        e.preventDefault();
                    }
                });

                priceMaxInput.addEventListener('input', (e) => {
                    // Если пустое значение, разрешаем ввод
                    if (e.target.value === '' || e.target.value === '-') {
                        return;
                    }
                    
                    let value = parseFloat(e.target.value);
                    const sliderMax = parseFloat(priceMax.getAttribute('max'));
                    const minInputValue = parseFloat(priceMinInput?.value || priceMin.value);
                    
                    // Валидация максимального значения
                    if (isNaN(value)) {
                        return; // Позволяем продолжить ввод
                    }
                    
                    // Не ограничиваем максимальное значение сверху - можно вводить любые числа
                    // Но не позволяем быть меньше минимума
                    if (value < minInputValue) {
                        value = minInputValue;
                        priceMaxInput.value = value.toString();
                    }
                    
                    // Обновляем ползунок (но не больше его максимума - он упрется в правый край)
                    const sliderValue = Math.min(value, sliderMax);
                    priceMax.value = sliderValue;
                    
                    // Обновляем фильтр (используем реальное значение из поля, а не ползунка)
                    this.filters.maxPrice = value;
                    this.updatePriceTrack();
                    this.applyFilters();
                });

                priceMaxInput.addEventListener('blur', (e) => {
                    let value = parseFloat(e.target.value);
                    const minInputValue = parseFloat(priceMinInput?.value || priceMin.value);
                    const sliderMax = parseFloat(priceMax.getAttribute('max'));
                    
                    if (isNaN(value)) {
                        // Если пусто, устанавливаем значение ползунка
                        value = sliderMax;
                        priceMaxInput.value = sliderMax.toString();
                    }
                    
                    if (value < minInputValue) {
                        value = minInputValue;
                        priceMaxInput.value = value.toString();
                    }
                    
                    // Обновляем ползунок (но не больше его максимума)
                    const sliderValue = Math.min(value, sliderMax);
                    priceMax.value = sliderValue;
                    this.filters.maxPrice = value;
                    this.updatePriceTrack();
                    this.applyFilters();
                });
            }
        }

        // Фильтр по категории
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.filters.category = chip.dataset.category || chip.textContent.trim();
                this.applyFilters();
            });
        });

        // Фильтр по издателю
        const creatorFilter = document.getElementById('creator-filter');
        if (creatorFilter) {
            creatorFilter.addEventListener('change', (e) => {
                this.filters.creator = e.target.value;
                this.applyFilters();
            });
        }

        // Сортировка
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.applyFilters();
            });
        }

        // Сброс фильтров
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    updatePriceDisplay() {
        // Этот метод больше не нужен, так как поля ввода обновляются напрямую
        // Оставлен для совместимости, но не форматирует значения
    }

    updatePriceTrack() {
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const track = document.getElementById('price-range-track');
        
        if (!priceMin || !priceMax || !track) return;
        
        const min = parseFloat(priceMin.value);
        const max = parseFloat(priceMax.value);
        const minMax = parseFloat(priceMin.getAttribute('max'));
        
        const leftPercent = (min / minMax) * 100;
        const rightPercent = 100 - (max / minMax) * 100;
        
        track.style.left = leftPercent + '%';
        track.style.right = rightPercent + '%';
    }

    populateCreators() {
        const creatorFilter = document.getElementById('creator-filter');
        if (!creatorFilter) return;

        const creators = [...new Set(this.allNfts.map(nft => nft.creator.name))].sort();
        
        creators.forEach(creator => {
            const option = document.createElement('option');
            option.value = creator;
            option.textContent = creator;
            creatorFilter.appendChild(option);
        });
    }

    applyFilters() {
        // Перезагружаем все NFT (включая пользовательские) перед каждой фильтрацией
        if (typeof getAllNftsWithUserCreated !== 'undefined') {
            this.allNfts = getAllNftsWithUserCreated();
        } else {
            this.allNfts = getAllNfts();
        }
        
        let filtered = [...this.allNfts];

        // Поиск
        if (this.filters.search) {
            const searchLower = this.filters.search.toLowerCase();
            filtered = filtered.filter(nft => 
                nft.name.toLowerCase().includes(searchLower) ||
                nft.fullName.toLowerCase().includes(searchLower) ||
                nft.creator.name.toLowerCase().includes(searchLower) ||
                nft.creator.fullName.toLowerCase().includes(searchLower) ||
                nft.category.toLowerCase().includes(searchLower) ||
                nft.description.toLowerCase().includes(searchLower) ||
                nft.collection.toLowerCase().includes(searchLower)
            );
        }

        // Фильтр по категории
        if (this.filters.category && this.filters.category !== 'Все') {
            filtered = filtered.filter(nft => nft.category === this.filters.category);
        }

        // Фильтр по издателю
        if (this.filters.creator) {
            filtered = filtered.filter(nft => nft.creator.name === this.filters.creator);
        }

        // Фильтр по цене
        filtered = filtered.filter(nft => 
            nft.price >= this.filters.minPrice && nft.price <= this.filters.maxPrice
        );

        // Сортировка
        switch(this.filters.sort) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.history[0].date) - new Date(a.history[0].date));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.history[0].date) - new Date(b.history[0].date));
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        this.filteredNfts = filtered;
        this.displayResults();
    }

    displayResults() {
        const container = document.getElementById('nft-grid');
        const resultsCount = document.getElementById('results-count');
        
        if (!container) return;

        if (this.filteredNfts.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <p class="text-xl font-bold mb-2">Ничего не найдено</p>
                    <p class="text-gray-400 mb-4">Попробуйте изменить параметры поиска или фильтры</p>
                    <button id="reset-filters-btn" class="bg-[#7f5af0] text-white px-6 py-2 rounded-lg hover:bg-[#6a4ac9]">
                        Сбросить фильтры
                    </button>
                </div>
            `;
            
            const resetBtn = document.getElementById('reset-filters-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.resetFilters());
            }
        } else {
            loadNftCards('nft-grid', this.filteredNfts, 'marketplace');
        }

        if (resultsCount) {
            resultsCount.textContent = `Найдено: ${this.filteredNfts.length} из ${this.allNfts.length}`;
        }
    }

    resetFilters() {
        this.filters = {
            search: '',
            category: 'Все',
            creator: '',
            minPrice: 0,
            maxPrice: 100,
            sort: 'default'
        };

        // Сбрасываем UI
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';

        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceMinInput = document.getElementById('price-min-input');
        const priceMaxInput = document.getElementById('price-max-input');
        
        const sliderMax = 100;
        
        if (priceMin) {
            priceMin.value = 0;
        }
        if (priceMinInput) {
            priceMinInput.value = '0';
        }
        
        if (priceMax) {
            priceMax.value = sliderMax;
        }
        if (priceMaxInput) {
            priceMaxInput.value = sliderMax.toString();
        }
        
        this.filters.minPrice = 0;
        this.filters.maxPrice = sliderMax;
        this.updatePriceTrack();

        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
            if (chip.dataset.category === 'Все' || chip.textContent.trim() === 'Все') {
                chip.classList.add('active');
            }
        });

        const creatorFilter = document.getElementById('creator-filter');
        if (creatorFilter) creatorFilter.value = '';

        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'default';

        this.updatePriceDisplay();
        this.applyFilters();
    }
}

// Инициализация фильтров
let nftFilters;

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('nft-grid')) {
        nftFilters = new NFTFilters();
        
        // Обработка параметров из URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        const categoryQuery = urlParams.get('category');
        
        if (searchQuery) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = searchQuery;
                nftFilters.filters.search = searchQuery.toLowerCase();
            }
        }
        
        if (categoryQuery) {
            nftFilters.filters.category = categoryQuery;
            // Активируем соответствующую кнопку категории
            document.querySelectorAll('.filter-chip').forEach(chip => {
                chip.classList.remove('active');
                if (chip.dataset.category === categoryQuery || chip.textContent.trim() === categoryQuery) {
                    chip.classList.add('active');
                }
            });
        }
        
        if (searchQuery || categoryQuery) {
            nftFilters.applyFilters();
        }
    }
});

