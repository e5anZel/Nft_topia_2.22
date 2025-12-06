// Система уведомлений



function showNotification(message, type = 'info', duration = 3000) {

    // Создаем контейнер для уведомлений, если его нет

    let container = document.getElementById('notifications-container');

    if (!container) {

        container = document.createElement('div');

        container.id = 'notifications-container';

        container.style.cssText = `

            position: fixed;

            top: 20px;

            right: 20px;

            z-index: 10000;

            display: flex;

            flex-direction: column;

            gap: 10px;

        `;

        document.body.appendChild(container);

    }



    // Создаем уведомление

    const notification = document.createElement('div');

    notification.style.cssText = `

        background: ${type === 'success' ? '#2cb67d' : type === 'error' ? '#ef4444' : '#7f5af0'};

        color: white;

        padding: 16px 20px;

        border-radius: 8px;

        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

        min-width: 300px;

        max-width: 400px;

        animation: slideIn 0.3s ease-out;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 12px;

    `;



    // Добавляем стили анимации, если их еще нет

    if (!document.getElementById('notification-styles')) {

        const style = document.createElement('style');

        style.id = 'notification-styles';

        style.textContent = `

            @keyframes slideIn {

                from {

                    transform: translateX(100%);

                    opacity: 0;

                }

                to {

                    transform: translateX(0);

                    opacity: 1;

                }

            }

            @keyframes slideOut {

                from {

                    transform: translateX(0);

                    opacity: 1;

                }

                to {

                    transform: translateX(100%);

                    opacity: 0;

                }

            }

        `;

        document.head.appendChild(style);

    }



    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

    notification.innerHTML = `

        <div style="display: flex; align-items: center; gap: 10px;">

            <span style="font-size: 20px; font-weight: bold;">${icon}</span>

            <span>${message}</span>

        </div>

        <button style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">&times;</button>

    `;



    // Обработчик закрытия

    const closeBtn = notification.querySelector('button');

    closeBtn.addEventListener('click', () => {

        closeNotification(notification);

    });



    container.appendChild(notification);



    // Автоматическое закрытие

    if (duration > 0) {

        setTimeout(() => {

            closeNotification(notification);

        }, duration);

    }



    return notification;

}



function closeNotification(notification) {

    notification.style.animation = 'slideOut 0.3s ease-out';

    setTimeout(() => {

        if (notification.parentNode) {

            notification.parentNode.removeChild(notification);

        }

    }, 300);

}



