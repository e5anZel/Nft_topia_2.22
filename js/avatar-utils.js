// Утилиты для работы с аватарами пользователей



// Генерация цвета на основе строки

function generateColorFromString(str) {

    let hash = 0;

    for (let i = 0; i < str.length; i++) {

        hash = str.charCodeAt(i) + ((hash << 5) - hash);

    }

    

    const hue = hash % 360;

    const saturation = 60 + (hash % 20); // 60-80%

    const lightness = 45 + (hash % 15); // 45-60%

    

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;

}



// Получение инициалов из имени

function getInitials(username) {

    if (!username) return 'U';

    

    const parts = username.trim().split(/\s+/);

    if (parts.length >= 2) {

        return (parts[0][0] + parts[1][0]).toUpperCase();

    }

    

    if (username.length >= 2) {

        return username.substring(0, 2).toUpperCase();

    }

    

    return username.substring(0, 1).toUpperCase();

}



// Создание SVG аватара с инициалами

function createAvatarSVG(username, size = 100) {

    const initials = getInitials(username);

    const color = generateColorFromString(username);

    

    return `

        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">

            <rect width="${size}" height="${size}" fill="${color}" rx="${size / 2}"/>

            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 

                  font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">

                ${initials}

            </text>

        </svg>

    `;

}



// Создание data URL для аватара

function createAvatarDataURL(username, size = 100) {

    const svg = createAvatarSVG(username, size);

    const blob = new Blob([svg], { type: 'image/svg+xml' });

    return URL.createObjectURL(blob);

}



// Обновление аватара в элементе

function updateAvatarElement(element, username) {

    if (!element || !username) return;

    

    const dataURL = createAvatarDataURL(username);

    element.src = dataURL;

    element.alt = username;

}



// Создание аватара как background-image

function createAvatarBackground(username, size = 100) {

    const svg = createAvatarSVG(username, size);

    const blob = new Blob([svg], { type: 'image/svg+xml' });

    const url = URL.createObjectURL(blob);

    return `url(${url})`;

}



