class UserMenu extends HTMLElement {

  constructor() {

    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `

      <style>

        .user-menu {

          position: relative;

          display: inline-block;

        }

        

        .user-button {

          display: flex;

          align-items: center;

          background: none;

          border: none;

          cursor: pointer;

          color: white;

          padding: 0.5rem;

          border-radius: 0.5rem;

          transition: all 0.2s ease;

        }

        

        .user-button:hover {

          background: rgba(255, 255, 255, 0.1);

        }

        

        .avatar {

          width: 32px;

          height: 32px;

          border-radius: 50%;

          margin-right: 0.5rem;

          border: 2px solid #7f5af0;

          object-fit: cover;

          flex-shrink: 0;

        }

        .dropdown {

          position: absolute;

          right: 0;

          top: 100%;

          background: #242629;

          border-radius: 8px;

          padding: 0.5rem 0;

          min-width: 200px;

          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

          z-index: 100;

          opacity: 0;

          visibility: hidden;

          transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;

          transform: translateY(10px);

        }

.dropdown.active {

          opacity: 1;

          visibility: visible;

          transform: translateY(0);

        }

        

        .dropdown-item {

          display: block;

          padding: 0.5rem 1rem;

          color: white;

          text-decoration: none;

          transition: all 0.2s ease;

        }

        

        .dropdown-item:hover {

          background: #7f5af0;

          color: white;

        }

        

        .dropdown-divider {

          height: 1px;

          background: #2a2b32;

          margin: 0.5rem 0;

        }

      </style>

      

      <div class="user-menu">

        <button class="user-button">

          <div id="user-menu-avatar" class="avatar" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 0.5rem; border: 2px solid #7f5af0; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; background: #7f5af0;"></div>

          <span id="user-menu-name">User</span>

          <i class="fas fa-chevron-down ml-2"></i>

        </button>

        

        <div class="dropdown">

          <a href="profile.html" class="dropdown-item">

<i class="fas fa-user mr-2"></i> Профиль

          </a>

          <a href="cart.html" class="dropdown-item">

            <i class="fas fa-shopping-cart mr-2"></i> Корзина

          </a>

          <a href="my-collections.html" class="dropdown-item">

            <i class="fas fa-layer-group mr-2"></i> Мои коллекции

          </a>

          <a href="settings.html" class="dropdown-item">

            <i class="fas fa-cog mr-2"></i> Настройки

          </a>

          

          <div class="dropdown-divider"></div>

          

          <a href="#" id="logout-link" class="dropdown-item">

            <i class="fas fa-sign-out-alt mr-2"></i> Выйти

          </a>

        </div>

      </div>

    `;

  }



  connectedCallback() {

    const userButton = this.shadowRoot.querySelector('.user-button');

    const dropdown = this.shadowRoot.querySelector('.dropdown');

    const avatar = this.shadowRoot.querySelector('#user-menu-avatar');

    const name = this.shadowRoot.querySelector('#user-menu-name');

    const logoutLink = this.shadowRoot.querySelector('#logout-link');



    // Загружаем данные пользователя

    this.updateUserInfo();



    userButton.addEventListener('click', () => {

      dropdown.classList.toggle('active');

    });

        let closeTimeout;

        const closeDelay = 300; // 300ms delay before closing



        // Show dropdown on hover

        userButton.addEventListener('mouseenter', () => {

          clearTimeout(closeTimeout);

          dropdown.classList.add('active');

        });

        

        // Hide dropdown with delay when leaving

        userButton.addEventListener('mouseleave', () => {

          closeTimeout = setTimeout(() => {

            if (!dropdown.matches(':hover')) {

              dropdown.classList.remove('active');

            }

          }, closeDelay);

        });

        

        dropdown.addEventListener('mouseenter', () => {

          clearTimeout(closeTimeout);

          dropdown.classList.add('active');

        });

        

        dropdown.addEventListener('mouseleave', () => {

          closeTimeout = setTimeout(() => {

            dropdown.classList.remove('active');

          }, closeDelay);

        });

// Close dropdown when clicking outside

    document.addEventListener('click', (e) => {

      if (!this.contains(e.target)) {

        dropdown.classList.remove('active');

      }

    });



    // Обработчик выхода

    logoutLink.addEventListener('click', (e) => {

      e.preventDefault();

      if (typeof logoutUser !== 'undefined') {

        logoutUser();

        this.updateUserInfo();

        // Обновляем UI авторизации

        if (typeof updateAuthUI !== 'undefined') {

          updateAuthUI();

        }

        window.location.href = 'index.html';

      }

    });

  }



  updateUserInfo() {

    // Проверяем, есть ли доступ к userData

    if (typeof getCurrentUser !== 'undefined') {

      const user = getCurrentUser();

      if (user) {

        const avatar = this.shadowRoot.querySelector('#user-menu-avatar');

        const name = this.shadowRoot.querySelector('#user-menu-name');

        

        if (name) name.textContent = user.username || user.fullName || 'User';

        

        if (avatar) {

          // Если есть загруженное фото

          if (user.avatar && user.avatarType === 'image') {

            avatar.style.backgroundImage = `url(${user.avatar})`;

            avatar.style.backgroundSize = 'cover';

            avatar.style.backgroundPosition = 'center';

            avatar.textContent = '';

          } else {

            // Иначе показываем инициалы

            if (typeof generateColorFromString !== 'undefined' && typeof getInitials !== 'undefined') {

              avatar.style.background = generateColorFromString(user.username);

              avatar.textContent = getInitials(user.username);

            } else {

              avatar.style.background = '#7f5af0';

              avatar.textContent = (user.username || 'U').substring(0, 1).toUpperCase();

            }

            avatar.style.backgroundImage = 'none';

          }

        }

      } else {

        // Если пользователь не авторизован, скрываем меню

        const userMenu = this.shadowRoot.querySelector('.user-menu');

        if (userMenu) {

          userMenu.style.display = 'none';

        }

      }

    }

    

    // Обновляем каждые 2 секунды на случай изменения пользователя

    setTimeout(() => this.updateUserInfo(), 2000);

  }

}



customElements.define('user-menu', UserMenu);