// Редактирование профиля



function initProfileEdit() {

    const editButton = document.querySelector('button:has-text("Редактировать"), button:contains("Редактировать")');

    if (!editButton) {

        const buttons = Array.from(document.querySelectorAll('button'));

        const editBtn = buttons.find(btn => btn.textContent.includes('Редактировать'));

        if (editBtn) {

            editBtn.addEventListener('click', openEditModal);

        }

    } else {

        editButton.addEventListener('click', openEditModal);

    }

}



function openEditModal() {

    const user = getCurrentUser();

    if (!user) {

        showNotification('Необходимо войти в систему', 'error');

        return;

    }



    const modal = document.createElement('div');

    modal.className = 'fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4';

    modal.id = 'edit-profile-modal';

    

    modal.innerHTML = `

        <div class="bg-[#16161a] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">

            <div class="flex justify-between items-center mb-6">

                <h2 class="text-2xl font-bold">Редактировать профиль</h2>

                <button class="close-edit-modal text-gray-400 hover:text-white text-2xl">

                    <i class="fas fa-times"></i>

                </button>

            </div>

            

            <form id="edit-profile-form" class="space-y-4">

                <!-- Аватар -->

                <div class="text-center mb-4">

                    <div id="avatar-preview" class="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold" 

                         style="background: ${typeof generateColorFromString !== 'undefined' ? generateColorFromString(user.username) : '#7f5af0'};">

                        ${typeof getInitials !== 'undefined' ? getInitials(user.username) : (user.username || 'U').substring(0, 2).toUpperCase()}

                    </div>

                    <input type="file" id="avatar-upload" accept="image/*" class="hidden">

                    <button type="button" id="change-avatar-btn" class="text-sm text-[#7f5af0] hover:underline">

                        Изменить фото

                    </button>

                </div>

                

                <!-- Имя пользователя -->

                <div>

                    <label class="block text-sm font-medium mb-2">Имя пользователя</label>

                    <input type="text" id="edit-username" value="${user.username}" 

                           class="w-full bg-[#242629] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7f5af0]">

                </div>

                

                <!-- Полное имя -->

                <div>

                    <label class="block text-sm font-medium mb-2">Полное имя</label>

                    <input type="text" id="edit-fullname" value="${user.fullName || ''}" 

                           class="w-full bg-[#242629] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7f5af0]">

                </div>

                

                <!-- Описание -->

                <div>

                    <label class="block text-sm font-medium mb-2">Описание</label>

                    <textarea id="edit-description" rows="3" 

                              class="w-full bg-[#242629] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7f5af0]">${user.description || ''}</textarea>

                </div>

                

                <!-- Кнопки -->

                <div class="flex gap-3 pt-4">

                    <button type="submit" class="flex-1 bg-[#7f5af0] text-white px-4 py-2 rounded-lg hover:bg-[#6a4ac9] transition-all">

                        Сохранить

                    </button>

                    <button type="button" class="close-edit-modal flex-1 bg-[#242629] text-white px-4 py-2 rounded-lg hover:bg-[#2a2b32] transition-all">

                        Отмена

                    </button>

                </div>

            </form>

        </div>

    `;

    

    document.body.appendChild(modal);

    

    // Обработчики

    const closeBtn = modal.querySelector('.close-edit-modal');

    closeBtn.addEventListener('click', () => {

        document.body.removeChild(modal);

    });

    

    modal.addEventListener('click', (e) => {

        if (e.target === modal) {

            document.body.removeChild(modal);

        }

    });

    

    // Загрузка аватара

    const changeAvatarBtn = modal.querySelector('#change-avatar-btn');

    const avatarUpload = modal.querySelector('#avatar-upload');

    const avatarPreview = modal.querySelector('#avatar-preview');

    

    // Устанавливаем начальный аватар

    if (user.avatar && user.avatarType === 'image') {

        avatarPreview.style.backgroundImage = `url(${user.avatar})`;

        avatarPreview.style.backgroundSize = 'cover';

        avatarPreview.style.backgroundPosition = 'center';

        avatarPreview.textContent = '';

    } else {

        // Если нет фото, показываем инициалы

        if (typeof generateColorFromString !== 'undefined') {

            avatarPreview.style.background = generateColorFromString(user.username);

        }

        if (typeof getInitials !== 'undefined') {

            avatarPreview.textContent = getInitials(user.username);

        } else {

            avatarPreview.textContent = (user.username || 'U').substring(0, 2).toUpperCase();

        }

    }

    

    changeAvatarBtn.addEventListener('click', () => {

        avatarUpload.click();

    });

    

    avatarUpload.addEventListener('change', (e) => {

        const file = e.target.files[0];

        if (file) {

            const reader = new FileReader();

            reader.onload = (event) => {

                avatarPreview.style.backgroundImage = `url(${event.target.result})`;

                avatarPreview.style.backgroundSize = 'cover';

                avatarPreview.style.backgroundPosition = 'center';

                avatarPreview.textContent = '';

            };

            reader.readAsDataURL(file);

        }

    });

    

    // Сохранение формы

    const form = modal.querySelector('#edit-profile-form');

    form.addEventListener('submit', (e) => {

        e.preventDefault();

        

        const username = modal.querySelector('#edit-username').value.trim();

        const fullName = modal.querySelector('#edit-fullname').value.trim();

        const description = modal.querySelector('#edit-description').value.trim();

        const avatarFile = avatarUpload.files[0];

        

        // Валидация

        if (!username) {

            showNotification('Имя пользователя не может быть пустым', 'error');

            return;

        }

        

        // Проверяем, не занят ли username другим пользователем

        const users = userData.getUsers();

        const existingUser = users.find(u => u.username === username && u.id !== user.id);

        if (existingUser) {

            showNotification('Пользователь с таким именем уже существует', 'error');

            return;

        }

        

        // Обработка аватара

        if (avatarFile) {

            // Загружаем аватар на сервер

            const formData = new FormData();

            formData.append('image', avatarFile);

            

            fetch('/api/upload-avatar', {

                method: 'POST',

                body: formData

            })

            .then(response => response.json())

            .then(result => {

                if (result.success) {

                    saveProfileChanges(user.id, username, fullName, description, result.avatarUrl);

                } else {

                    showNotification('Ошибка при загрузке аватара: ' + (result.error || 'Неизвестная ошибка'), 'error');

                }

            })

            .catch(error => {

                console.error('Error uploading avatar:', error);

                showNotification('Ошибка при загрузке аватара', 'error');

            });

        } else {

            saveProfileChanges(user.id, username, fullName, description, null);

        }

    });

}



function saveProfileChanges(userId, username, fullName, description, avatarData) {

    const updates = {

        username: username,

        fullName: fullName || username,

        description: description

    };

    

    if (avatarData) {

        updates.avatar = avatarData;

        updates.avatarType = 'image';

    } else {

        // Если аватар не загружен, используем инициалы

        updates.avatarType = 'initials';

    }

    

    const result = userData.updateUser(userId, updates);

    

    if (result.success) {

        showNotification('Профиль успешно обновлен', 'success');

        setTimeout(() => {

            window.location.reload();

        }, 1000);

    } else {

        showNotification(result.message || 'Ошибка при обновлении профиля', 'error');

    }

}



// Функция openEditModal доступна глобально для использования в profile.html



