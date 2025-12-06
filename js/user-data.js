// Управление пользовательскими данными с использованием localStorage



class UserData {

    constructor() {

        this.storageKey = 'nft_users';

        this.currentUserKey = 'nft_current_user';

        this.init();

    }



    init() {

        // Инициализация хранилища пользователей, если его нет

        if (!this.getUsers()) {

            this.saveUsers([]);

        }

    }



    // Получить всех пользователей

    getUsers() {

        try {

            const users = localStorage.getItem(this.storageKey);

            return users ? JSON.parse(users) : [];

        } catch (e) {

            console.error('Ошибка при чтении пользователей:', e);

            return [];

        }

    }



    // Сохранить пользователей

    saveUsers(users) {

        try {

            localStorage.setItem(this.storageKey, JSON.stringify(users));

            return true;

        } catch (e) {

            console.error('Ошибка при сохранении пользователей:', e);

            return false;

        }

    }



    // Регистрация нового пользователя

    register(userData) {

        const users = this.getUsers();

        

        // Проверяем, не существует ли уже пользователь с таким email

        if (users.find(u => u.email === userData.email)) {

            return { success: false, message: 'Пользователь с таким email уже существует' };

        }



        // Проверяем, не существует ли уже пользователь с таким username

        if (users.find(u => u.username === userData.username)) {

            return { success: false, message: 'Пользователь с таким именем уже существует' };

        }



        // Создаем нового пользователя (без фото, только инициалы)

        const newUser = {

            id: Date.now().toString(),

            username: userData.username,

            email: userData.email,

            password: userData.password, // В реальном приложении нужно хешировать

            fullName: userData.fullName || userData.username,

            avatar: null, // Будет генерироваться на основе инициалов

            avatarType: 'initials', // Тип аватара - инициалы

            description: userData.description || '',

            createdAt: new Date().toISOString(),

            favorites: [],

            purchases: [],

            created: []

        };



        users.push(newUser);

        this.saveUsers(users);



        return { success: true, message: 'Регистрация успешна', user: newUser };

    }



    // Вход пользователя

    login(email, password) {

        const users = this.getUsers();

        const user = users.find(u => u.email === email && u.password === password);



        if (!user) {

            return { success: false, message: 'Неверный email или пароль' };

        }



        // Сохраняем текущего пользователя

        this.setCurrentUser(user);

        

        // Триггерим событие для обновления UI

        if (typeof window !== 'undefined') {

            window.dispatchEvent(new Event('storage'));

            if (typeof updateAuthUI !== 'undefined') {

                setTimeout(() => updateAuthUI(), 100);

            }

        }



        if (typeof cart !== 'undefined' && typeof cart.handleUserChange === 'function') {

            cart.handleUserChange();

        }

        

        return { success: true, message: 'Вход выполнен', user: user };

    }



    // Выход пользователя

    logout() {

        localStorage.removeItem(this.currentUserKey);

        

        // Триггерим событие для обновления UI

        if (typeof window !== 'undefined') {

            window.dispatchEvent(new Event('storage'));

            if (typeof updateAuthUI !== 'undefined') {

                setTimeout(() => updateAuthUI(), 100);

            }

        }



        if (typeof cart !== 'undefined' && typeof cart.handleUserChange === 'function') {

            cart.handleUserChange();

        }



        // После выхода всегда отправляем на главную страницу

        if (typeof window !== 'undefined') {

            try {

                const path = window.location.pathname.split('/').pop() || 'index.html';

                if (path !== 'index.html') {

                    window.location.href = 'index.html';

                }

            } catch (e) {

                // игнорируем ошибки безопасно

            }

        }

        

        return { success: true, message: 'Выход выполнен' };

    }



    // Получить текущего пользователя

    getCurrentUser() {

        try {

            const user = localStorage.getItem(this.currentUserKey);

            return user ? JSON.parse(user) : null;

        } catch (e) {

            console.error('Ошибка при чтении текущего пользователя:', e);

            return null;

        }

    }



    // Установить текущего пользователя

    setCurrentUser(user) {

        try {

            localStorage.setItem(this.currentUserKey, JSON.stringify(user));

            return true;

        } catch (e) {

            console.error('Ошибка при сохранении текущего пользователя:', e);

            return false;

        }

    }



    // Обновить данные пользователя

    updateUser(userId, updates) {

        const users = this.getUsers();

        const userIndex = users.findIndex(u => u.id === userId);



        if (userIndex === -1) {

            return { success: false, message: 'Пользователь не найден' };

        }



        users[userIndex] = { ...users[userIndex], ...updates };

        this.saveUsers(users);



        // Если это текущий пользователь, обновляем его данные

        const currentUser = this.getCurrentUser();

        if (currentUser && currentUser.id === userId) {

            this.setCurrentUser(users[userIndex]);

        }



        return { success: true, message: 'Данные обновлены', user: users[userIndex] };

    }



    // Добавить NFT в избранное

    addToFavorites(userId, nftId) {

        const users = this.getUsers();

        const userIndex = users.findIndex(u => u.id === userId);



        if (userIndex === -1) {

            return { success: false, message: 'Пользователь не найден' };

        }



        if (!users[userIndex].favorites.includes(nftId)) {

            users[userIndex].favorites.push(nftId);

            this.saveUsers(users);

            

            const currentUser = this.getCurrentUser();

            if (currentUser && currentUser.id === userId) {

                currentUser.favorites = users[userIndex].favorites;

                this.setCurrentUser(currentUser);

            }

        }



        return { success: true, message: 'NFT добавлен в избранное' };

    }



    // Удалить NFT из избранного

    removeFromFavorites(userId, nftId) {

        const users = this.getUsers();

        const userIndex = users.findIndex(u => u.id === userId);



        if (userIndex === -1) {

            return { success: false, message: 'Пользователь не найден' };

        }



        users[userIndex].favorites = users[userIndex].favorites.filter(id => id !== nftId);

        this.saveUsers(users);

        

        const currentUser = this.getCurrentUser();

        if (currentUser && currentUser.id === userId) {

            currentUser.favorites = users[userIndex].favorites;

            this.setCurrentUser(currentUser);

        }



        return { success: true, message: 'NFT удален из избранного' };

    }



    // Добавить покупку

    addPurchase(userId, nftId, price) {

        const users = this.getUsers();

        const userIndex = users.findIndex(u => u.id === userId);



        if (userIndex === -1) {

            return { success: false, message: 'Пользователь не найден' };

        }



        const purchase = {

            nftId: nftId,

            price: price,

            date: new Date().toISOString()

        };



        users[userIndex].purchases.push(purchase);

        this.saveUsers(users);

        

        const currentUser = this.getCurrentUser();

        if (currentUser && currentUser.id === userId) {

            currentUser.purchases = users[userIndex].purchases;

            this.setCurrentUser(currentUser);

        }



        return { success: true, message: 'Покупка добавлена', purchase: purchase };

    }

}



// Создаем глобальный экземпляр

const userData = new UserData();



// Функции для использования в HTML

function registerUser(userData) {

    return userData.register(userData);

}



function loginUser(email, password) {

    return userData.login(email, password);

}



function logoutUser() {

    return userData.logout();

}



function getCurrentUser() {

    return userData.getCurrentUser();

}



function isUserLoggedIn() {

    return userData.getCurrentUser() !== null;

}



