// Обработка выпадающих меню с задержкой



document.addEventListener('DOMContentLoaded', function() {

    const allMenus = document.querySelectorAll('.dropdown-menu');



    const hideMenuInstant = (menu) => {

        if (!menu) return;

        menu.classList.remove('active');

        menu.style.opacity = '0';

        menu.style.visibility = 'hidden';

        menu.style.transform = 'translateY(-10px)';

        menu.style.pointerEvents = 'none';

        menu.style.display = 'none';

    };



    const closeAllMenus = () => {

        allMenus.forEach(menu => {

            hideMenuInstant(menu);

        });

    };



    const showMenuBase = (menu) => {

        if (!menu) return;

        menu.style.opacity = '1';

        menu.style.visibility = 'visible';

        menu.style.transform = 'translateY(0)';

        menu.style.display = 'block';

        menu.style.pointerEvents = 'auto';

    };



    const showMarketplaceMenu = (menu) => {

        showMenuBase(menu);

    };



    const showDefaultMenu = (menu) => {

        if (!menu) return;

        menu.classList.add('active');

        showMenuBase(menu);

    };



    // Обработка меню "Маркетплейс"

    const marketplaceDropdowns = document.querySelectorAll('.marketplace-dropdown');

    

    marketplaceDropdowns.forEach(dropdown => {

        const button = dropdown.querySelector('button');

        const menu = dropdown.querySelector('.dropdown-menu');

        let closeTimeout;

        const closeDelay = 300; // 300ms задержка перед закрытием

        

        if (!button || !menu) return;

        

        // Показываем меню при наведении на кнопку

        button.addEventListener('mouseenter', () => {

            closeAllMenus();

            clearTimeout(closeTimeout);

            showMarketplaceMenu(menu);

        });

        

        // Скрываем меню с задержкой при уходе с кнопки

        button.addEventListener('mouseleave', () => {

            closeTimeout = setTimeout(() => {

                if (!menu.matches(':hover')) {

                    menu.style.opacity = '0';

                    menu.style.visibility = 'hidden';

                    menu.style.transform = 'translateY(-10px)';

                    menu.style.pointerEvents = 'none';

                    setTimeout(() => {

                        if (!menu.matches(':hover')) {

                            menu.style.display = 'none';

                        }

                    }, 300);

                }

            }, closeDelay);

        });

        

        // Показываем меню при наведении на само меню

        menu.addEventListener('mouseenter', () => {

            clearTimeout(closeTimeout);

            showMarketplaceMenu(menu);

        });

        

        // Скрываем меню с задержкой при уходе с меню

        menu.addEventListener('mouseleave', () => {

            closeTimeout = setTimeout(() => {

                menu.style.opacity = '0';

                menu.style.visibility = 'hidden';

                menu.style.transform = 'translateY(-10px)';

                menu.style.pointerEvents = 'none';

                setTimeout(() => {

                    menu.style.display = 'none';

                }, 300);

            }, closeDelay);

        });

    });

    

    // Обработка других выпадающих меню (Статистика и т.д.)

    const otherDropdowns = document.querySelectorAll('.dropdown:not(.marketplace-dropdown)');

    

    otherDropdowns.forEach(dropdown => {

        const button = dropdown.querySelector('button');

        const menu = dropdown.querySelector('.dropdown-menu');

        let closeTimeout;

        const closeDelay = 300;

        

        if (!button || !menu) return;

        

        button.addEventListener('mouseenter', () => {

            closeAllMenus();

            clearTimeout(closeTimeout);

            showDefaultMenu(menu);

        });

        

        button.addEventListener('mouseleave', () => {

            closeTimeout = setTimeout(() => {

                if (!menu.matches(':hover')) {

                    menu.classList.remove('active');

                    menu.style.display = 'none';

                }

            }, closeDelay);

        });

        

        menu.addEventListener('mouseenter', () => {

            clearTimeout(closeTimeout);

            showDefaultMenu(menu);

        });

        

        menu.addEventListener('mouseleave', () => {

            closeTimeout = setTimeout(() => {

                menu.classList.remove('active');

                menu.style.display = 'none';

            }, closeDelay);

        });

    });



    // Ссылки без выпадающих меню закрывают активные меню мгновенно

    const navLinks = document.querySelectorAll('header nav > a');

    navLinks.forEach(link => {

        link.addEventListener('mouseenter', () => {

            closeAllMenus();

        });

    });

});



