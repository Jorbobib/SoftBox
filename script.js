// ===== ПЕРЕМЕННЫЕ И КОНСТАНТЫ =====
let softwareList = [];
let selectedTags = new Set();
const ADMIN_PASSWORD = "admin123"; // Пароль для входа в админку
let isAuthenticated = false; // Флаг авторизации

// ===== ОБЩИЕ ФУНКЦИИ =====
// Форматирование чисел
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// Показ уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    setTimeout(() => style.remove(), 3300);
}

// ===== ФУНКЦИИ АВТОРИЗАЦИИ =====
function checkAdminAccess() {
    if (!isAuthenticated) {
        const password = prompt("Введите пароль для доступа к админ-панели:");
        if (password === ADMIN_PASSWORD) {
            isAuthenticated = true;
            showNotification("Доступ разрешен!", "success");
            return true;
        } else {
            showNotification("Неверный пароль!", "error");
            return false;
        }
    }
    return true;
}

// Выйти из админки
function logoutAdmin() {
    isAuthenticated = false;
    hideAdminPanel();
    showNotification("Вы вышли из админ-панели", "success");
}

// ===== УПРАВЛЕНИЕ ДАННЫМИ =====
// Загрузка утилит из localStorage
function loadSoftware() {
    const saved = localStorage.getItem('softbox_software');
    if (saved) {
        softwareList = JSON.parse(saved);
    } else {
        // Демо-данные
        softwareList = [
            {
                id: 1,
                name: "RAM Optimizer Pro",
                version: "2.0.1",
                description: "Оптимизация оперативной памяти для слабых ПК. Мониторинг, очистка, игровой режим.",
                category: "optimization",
                icon: "fa-memory",
                downloads: 15247,
                rating: 4.9,
                size: "5.2 MB",
                tags: ["free", "lightweight", "russian"],
                badge: "new",
                downloadUrl: "#",
                color: "#ff0080"
            },
            {
                id: 2,
                name: "PC Cleaner",
                version: "1.5.3",
                description: "Глубокая очистка системы от временных файлов и мусора.",
                category: "optimization",
                icon: "fa-broom",
                downloads: 12489,
                rating: 4.7,
                size: "8.1 MB",
                tags: ["free", "portable"],
                badge: "popular",
                downloadUrl: "#",
                color: "#00bfff"
            },
            {
                id: 3,
                name: "Network Booster",
                version: "1.2.0",
                description: "Оптимизация интернет-соединения, ускорение загрузки.",
                category: "tools",
                icon: "fa-wifi",
                downloads: 8934,
                rating: 4.6,
                size: "3.8 MB",
                tags: ["free", "lightweight"],
                downloadUrl: "#",
                color: "#ffcc00"
            }
        ];
        saveSoftware();
    }
    updateStatistics();
    renderSoftware();
    renderAdminSoftwareList();
}

// Сохранение утилит в localStorage
function saveSoftware() {
    localStorage.setItem('softbox_software', JSON.stringify(softwareList));
    updateStatistics();
}

// Обновление статистики
function updateStatistics() {
    const totalDownloads = softwareList.reduce((sum, item) => sum + item.downloads, 0);
    const totalSoftware = softwareList.length;
    
    document.getElementById('totalDownloads').textContent = formatNumber(totalDownloads);
    document.getElementById('totalSoftware').textContent = totalSoftware;
    document.getElementById('adminTotalDownloads').textContent = formatNumber(totalDownloads);
    document.getElementById('adminTotalSoftware').textContent = totalSoftware;
}

// ===== РЕНДЕРИНГ УТИЛИТ =====
// Рендеринг утилит на главной странице
function renderSoftware() {
    const grid = document.getElementById('softwareGrid');
    if (!grid) return;
    
    grid.innerHTML = softwareList.map(software => `
        <div class="software-card" data-id="${software.id}">
            ${software.badge ? `<div class="card-badge badge-${software.badge}">${software.badge === 'new' ? 'НОВОЕ' : 'ПОПУЛЯРНОЕ'}</div>` : ''}
            
            <div class="card-icon" style="background: ${software.color || 'linear-gradient(45deg, #ff0080, #00bfff)'}">
                <i class="fas ${software.icon}"></i>
            </div>
            
            <h3 class="card-title">
                ${software.name}
                <span class="card-version">v${software.version}</span>
            </h3>
            
            <p class="card-desc">${software.description}</p>
            
            <div class="card-tags">
                ${software.tags.map(tag => `
                    <span class="card-tag">${tag}</span>
                `).join('')}
            </div>
            
            <div class="card-stats">
                <div class="card-stat">
                    <i class="fas fa-download"></i>
                    <span>${formatNumber(software.downloads)}</span>
                </div>
                <div class="card-stat">
                    <i class="fas fa-star"></i>
                    <span>${software.rating}</span>
                </div>
                <div class="card-stat">
                    <i class="fas fa-weight"></i>
                    <span>${software.size}</span>
                </div>
            </div>
            
            <div class="card-actions">
                <button class="card-btn download" onclick="handleDownload(${software.id})">
                    <i class="fas fa-download"></i>
                    Скачать
                </button>
                <button class="card-btn details" onclick="showSoftwareDetails(${software.id})">
                    <i class="fas fa-info-circle"></i>
                    Подробнее
                </button>
            </div>
        </div>
    `).join('');
}

// Рендеринг утилит в админке
function renderAdminSoftwareList() {
    const list = document.getElementById('adminSoftwareList');
    if (!list) return;
    
    list.innerHTML = softwareList.map(software => `
        <div class="admin-software-item">
            <div class="admin-software-icon" style="background: ${software.color || 'linear-gradient(45deg, #ff0080, #00bfff)'}">
                <i class="fas ${software.icon}"></i>
            </div>
            
            <div class="admin-software-info">
                <h4>${software.name} v${software.version}</h4>
                <p>${software.description.substring(0, 100)}...</p>
                <small>Скачиваний: ${formatNumber(software.downloads)} | Категория: ${software.category}</small>
            </div>
            
            <div class="admin-software-actions">
                <button class="btn-action btn-edit" onclick="editSoftware(${software.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteSoftware(${software.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== ОБРАБОТКА ДЕЙСТВИЙ =====
// Обработка скачивания
function handleDownload(id) {
    const software = softwareList.find(item => item.id === id);
    if (!software) return;
    
    // Увеличиваем счетчик скачиваний
    software.downloads++;
    saveSoftware();
    
    // Показываем модальное окно
    showDownloadModal(software);
    
    // Уведомление
    showNotification(`Утилита "${software.name}" скачивается!`, 'success');
}

// Показ модального окна скачивания
function showDownloadModal(software) {
    const modal = document.getElementById('downloadModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Скачать ${software.name}`;
    modalBody.innerHTML = `
        <div class="download-info">
            <div class="card-icon" style="margin: 0 auto 20px; background: ${software.color || 'linear-gradient(45deg, #ff0080, #00bfff)'}">
                <i class="fas ${software.icon}"></i>
            </div>
            
            <h4 style="text-align: center; margin-bottom: 10px;">${software.name} v${software.version}</h4>
            <p style="text-align: center; color: #94a3b8; margin-bottom: 20px;">${software.description}</p>
                    
            <div class="card-stats" style="justify-content: center; gap: 30px;">
                <div class="card-stat">
                    <i class="fas fa-download"></i>
                    <span>${formatNumber(software.downloads)}</span>
                </div>
                <div class="card-stat">
                    <i class="fas fa-star"></i>
                    <span>${software.rating}</span>
                </div>
                <div class="card-stat">
                    <i class="fas fa-weight"></i>
                    <span>${software.size}</span>
                </div>
            </div>
                    
            <div style="margin-top: 30px; text-align: center;">
                <a href="${software.downloadUrl || '#'}" 
                   class="btn btn-primary" 
                   style="display: inline-flex; align-items: center; gap: 10px;"
                   onclick="document.getElementById('downloadModal').classList.remove('active')"
                   ${software.downloadUrl === '#' ? 'onclick="event.preventDefault(); showNotification(\'Ссылка для скачивания не указана\', \'error\')"' : ''}>
                    <i class="fas fa-download"></i>
                    Скачать сейчас
                </a>
                <p style="margin-top: 10px; color: #94a3b8; font-size: 0.9rem;">
                    ${software.downloadUrl === '#' ? '⚠️ Ссылка не указана. Добавьте ссылку в админке.' : 'Файл будет скачан автоматически'}
                </p>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Показ деталей утилиты
function showSoftwareDetails(id) {
    const software = softwareList.find(item => item.id === id);
    if (!software) return;
    
    showNotification(`${software.name}: ${software.description}`, 'success');
}

// ===== АДМИН ФУНКЦИИ =====
// Добавление новой утилиты
function addSoftware(data) {
    const newSoftware = {
        id: Date.now(),
        name: data.name,
        version: data.version,
        description: data.description,
        category: data.category,
        icon: data.icon,
        downloads: 0,
        rating: 4.5,
        size: data.size || '5 MB',
        tags: Array.from(selectedTags),
        badge: data.badge || 'new',
        downloadUrl: data.downloadUrl || '#',
        color: data.color || getRandomColor()
    };
    
    softwareList.unshift(newSoftware);
    saveSoftware();
    renderSoftware();
    renderAdminSoftwareList();
    showNotification(`Утилита "${data.name}" добавлена!`, 'success');
    
    // Очищаем форму
    selectedTags.clear();
    document.querySelectorAll('.tag-option').forEach(tag => tag.classList.remove('selected'));
    document.getElementById('addSoftwareForm').reset();
}

// Редактирование утилиты
function editSoftware(id) {
    const software = softwareList.find(item => item.id === id);
    if (!software) return;
    
    // Заполняем форму
    document.getElementById('name').value = software.name;
    document.getElementById('version').value = software.version;
    document.getElementById('description').value = software.description;
    document.getElementById('category').value = software.category;
    document.getElementById('icon').value = software.icon;
    document.getElementById('size').value = software.size;
    document.getElementById('downloadUrl').value = software.downloadUrl;
    
    // Тэги
    selectedTags = new Set(software.tags);
    document.querySelectorAll('.tag-option').forEach(tag => {
        tag.classList.toggle('selected', selectedTags.has(tag.dataset.tag));
    });
    
    // Показываем вкладку добавления
    showAdminTab('add');
    showNotification(`Редактируем "${software.name}"`, 'success');
}

// Удаление утилиты
function deleteSoftware(id) {
    if (confirm('Удалить эту утилиту?')) {
        const index = softwareList.findIndex(item => item.id === id);
        if (index !== -1) {
            const name = softwareList[index].name;
            softwareList.splice(index, 1);
            saveSoftware();
            renderSoftware();
            renderAdminSoftwareList();
            showNotification(`Утилита "${name}" удалена`, 'success');
        }
    }
}

// ===== УТИЛИТНЫЕ ФУНКЦИИ =====
// Генерация случайного цвета
function getRandomColor() {
    const colors = [
        '#ff0080', '#00bfff', '#ffcc00', '#9d4edd', 
        '#ff6d00', '#4cc9f0', '#ff4757', '#1dd1a1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Показ/скрытие админки
function showAdminPanel() {
    if (!checkAdminAccess()) return;
    
    document.getElementById('mainSite').style.display = 'none';
    document.getElementById('admin').style.display = 'block';
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    showAdminTab('add');
}

function hideAdminPanel() {
    document.getElementById('mainSite').style.display = 'block';
    document.getElementById('admin').style.display = 'none';
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    document.querySelector('.nav-links a[href="#home"]').classList.add('active');
}

// Переключение вкладок админки
function showAdminTab(tabName) {
    // Обновляем кнопки
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Показываем контент
    document.querySelectorAll('.admin-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName + 'Tab');
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    // Скрываем прелоадер
    setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
        }, 500);
    }, 1000);
    
    // Загружаем утилиты
    loadSoftware();
    
    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
    
    // Навигация
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            if (target === '#admin') {
                showAdminPanel();
            } else {
                hideAdminPanel();
                document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
            }
            
            // Обновляем активную ссылку
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Кнопки админки
    document.getElementById('adminBtn').addEventListener('click', showAdminPanel);
    document.getElementById('showAdminFromMain').addEventListener('click', showAdminPanel);
    
    // Меняем кнопку "На сайт" на "Выйти"
    document.getElementById('backToSite').textContent = 'Выйти';
    document.getElementById('backToSite').innerHTML = '<i class="fas fa-sign-out-alt"></i> Выйти';
    document.getElementById('backToSite').addEventListener('click', logoutAdmin);
    
    // Вкладки админки
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.dataset.tab) {
                showAdminTab(this.dataset.tab);
            }
        });
    });
    
    // Тэги в форме
    document.querySelectorAll('.tag-option').forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('selected');
            const tagValue = this.dataset.tag;
            
            if (selectedTags.has(tagValue)) {
                selectedTags.delete(tagValue);
            } else {
                selectedTags.add(tagValue);
            }
            
            document.getElementById('tags').value = Array.from(selectedTags).join(',');
        });
    });
    
    // Форма добавления утилиты
    document.getElementById('addSoftwareForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            version: document.getElementById('version').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            icon: document.getElementById('icon').value,
            size: document.getElementById('size').value,
            downloadUrl: document.getElementById('downloadUrl').value,
            badge: 'new'
        };
        
        // Валидация
        if (!formData.name || !formData.version || !formData.description || 
            !formData.category || !formData.icon) {
            showNotification('Заполните все обязательные поля!', 'error');
            return;
        }
        
        addSoftware(formData);
    });
    
    // Закрытие модального окна
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('downloadModal').classList.remove('active');
    });
    
    // Закрытие модального окна при клике вне его
    document.getElementById('downloadModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // Экспорт данных
    document.getElementById('exportBtn').addEventListener('click', function() {
        const dataStr = JSON.stringify(softwareList, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'softbox_software.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showNotification('Данные экспортированы в JSON файл', 'success');
    });
    
    // Импорт данных
    document.getElementById('importBtn').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                try {
                    const importedData = JSON.parse(event.target.result);
                    softwareList = importedData;
                    saveSoftware();
                    renderSoftware();
                    renderAdminSoftwareList();
                    showNotification('Данные успешно импортированы!', 'success');
                } catch (error) {
                    showNotification('Ошибка при импорте файла', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    });
    
    // Сброс данных
    document.getElementById('resetBtn').addEventListener('click', function() {
        if (confirm('ВНИМАНИЕ! Это удалит все ваши утилиты. Продолжить?')) {
            softwareList = [];
            saveSoftware();
            renderSoftware();
            renderAdminSoftwareList();
            showNotification('Все данные сброшены', 'success');
        }
    });
    
    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#admin') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});