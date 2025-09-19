const terminal = document.getElementById('terminal');
let currentTime = document.getElementById('current-time');
let commandHistory = [];
let historyIndex = -1;

// Обновление времени
function updateDateTime() {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth()+1).toString().padStart(2, '0')}.${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    currentTime.textContent = formattedDate;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Scroll to bottom function
function scrollToBottom() {
    terminal.scrollTop = terminal.scrollHeight;
}

// Добавление строки ввода
function addInputLine() {
    const newInputLine = document.createElement('div');
    newInputLine.className = 'input-line';
    newInputLine.innerHTML = `
        <span class="prompt">operator@cassie-mpr</span>
        <input type="text" class="command-input" autofocus>
        <span class="cursor"></span>
    `;
    terminal.appendChild(newInputLine);
    
    const newInput = newInputLine.querySelector('.command-input');
    newInput.focus();
    
    newInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.value.trim();
            this.value = '';
            
            if (command) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                processCommand(command);
            } else {
                addInputLine();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex > 0) historyIndex--;
                this.value = commandHistory[historyIndex] || '';
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value = commandHistory[historyIndex] || '';
            } else {
                historyIndex = commandHistory.length;
                this.value = '';
            }
        }
    });
    
    scrollToBottom();
}

// Обработка команд
function processCommand(command) {
    // Отображение введенной команды
    const inputLineDisplay = document.createElement('div');
    inputLineDisplay.className = 'input-line';
    inputLineDisplay.innerHTML = `<span class="prompt">operator@cassie-mpr</span> <span class="command-history">${command}</span>`;
    terminal.appendChild(inputLineDisplay);
    
    let responseText = '';
    let responseClass = 'response';
    
    // Симуляция обработки
    const processing = document.createElement('div');
    processing.className = 'response processing';
    processing.textContent = 'CASSIE-МПР обрабатывает запрос';
    terminal.appendChild(processing);
    
    setTimeout(() => {
        terminal.removeChild(processing);
        
        // Обработка команд
        if (command === 'help') {
            responseText = `Доступные команды CASSIE-МПР:<br>
            - help: показать эту справку<br>
            - анализ [SCP]: анализ и прогнозирование поведения аномалии (пример: анализ 173)<br>
            - сценарии [SCP]: показать возможные сценарии содержания<br>
            - визуализация [SCP]: визуализация данных аномалии<br>
            - вероятность [событие]: расчет вероятности события<br>
            - история: показать историю запросов<br>
            - очистка: очистить терминал<br>
            - статус: показать статус системы`;
        } 
        else if (command === 'очистка' || command === 'clear') {
            while (terminal.children.length > 2) {
                terminal.removeChild(terminal.lastChild);
            }
            addInputLine();
            scrollToBottom();
            return;
        }
        else if (command === 'статус' || command === 'status') {
            responseText = `Статус CASSIE-МПР:<br>
            - Система: Operational<br>
            - Загрузка ЦП: 23%<br>
            - Память: 64%<br>
            - База данных: 28492 записи об аномалиях<br>
            - Последнее обновление: 10.11.2023, 04:32:18<br>
            - Прогностическая точность: 92.7%`;
        }
        else if (command === 'история' || command === 'history') {
            if (commandHistory.length === 0) {
                responseText = 'История запросов пуста.';
            } else {
                responseText = 'История запросов:<br>';
                commandHistory.forEach((cmd, index) => {
                    responseText += `${index + 1}. ${cmd}<br>`;
                });
            }
        }
        else if (command.startsWith('анализ ')) {
            const scpNumber = command.split(' ')[1];
            if (scpNumber) {
                responseText = generateAnalysisReport(scpNumber);
                responseClass = 'analysis-result';
            } else {
                responseText = '<span class="error">Ошибка: укажите номер SCP для анализа (пример: анализ 173)</span>';
            }
        }
        else if (command.startsWith('сценарии ')) {
            const scpNumber = command.split(' ')[1];
            if (scpNumber) {
                responseText = generateScenarios(scpNumber);
            } else {
                responseText = '<span class="error">Ошибка: укажите номер SCP для просмотра сценариев (пример: сценарии 173)</span>';
            }
        }
        else if (command.startsWith('вероятность ')) {
            const event = command.substring(12);
            if (event) {
                responseText = calculateProbability(event);
            } else {
                responseText = '<span class="error">Ошибка: укажите событие для расчета вероятности (пример: вероятность нарушения содержания 173)</span>';
            }
        }
        else if (command.startsWith('визуализация ')) {
            const scpNumber = command.split(' ')[1];
            if (scpNumber) {
                responseText = `Подготовка визуализации данных для SCP-${scpNumber}...<br>
                <span class="nav-item" onclick="showVisualization('${scpNumber}')">Открыть визуализацию</span>`;
            } else {
                responseText = '<span class="error">Ошибка: укажите номер SCP для визуализации (пример: визуализация 173)</span>';
            }
        }
        else {
            responseText = `<span class="error">Команда не распознана. Введите "help" для списка доступных команд.</span>`;
        }
        
        // Добавление ответа
        if (responseText) {
            const responseElement = document.createElement('div');
            responseElement.className = responseClass;
            responseElement.innerHTML = responseText;
            terminal.appendChild(responseElement);
        }
        
        addInputLine();
        scrollToBottom();
    }, 800 + Math.random() * 700); // Случайная задержка для реалистичности
}

// Генерация отчета анализа
function generateAnalysisReport(scpNumber) {
    const reports = {
        '173': {
            класс: 'Евклид',
            риск: 'Высокий',
            прогноз: 'Стабильное содержание при соблюдении протокола визуального контакта',
            рекомендации: 'Поддержание постоянного визуального наблюдения, регулярная проверка систем освещения'
        },
        '096': {
            класс: 'Евклид',
            риск: 'Крайне высокий',
            прогноз: 'Высокий риск нарушения содержания при случайном наблюдении лица',
            рекомендации: 'Усиление мер по предотвращению случайного наблюдения, обучение персонала'
        },
        '049': {
            класс: 'Евклид',
            риск: 'Высокий',
            прогноз: 'Попытки "лечения" персонала при контакте',
            рекомендации: 'Использование защитного снаряжения уровня 4 при взаимодействии'
        },
        '106': {
            класс: 'Кетер',
            риск: 'Крайне высокий',
            прогноз: 'Постоянные попытки нарушения содержания',
            рекомендации: 'Поддержание протокола "Кислотная ванна", регулярная проверка целостности камеры'
        },
        '682': {
            класс: 'Кетер',
            риск: 'Максимальный',
            прогноз: 'Постоянная адаптация и попытки побега',
            рекомендации: 'Подготовка multiple протоколов уничтожения, постоянный мониторинг'
        }
    };
    
    const report = reports[scpNumber] || {
        класс: 'Данные загружаются',
        риск: 'Рассчитывается',
        прогноз: 'Анализ в процессе',
        рекомендации: 'Ожидание завершения анализа'
    };
    
    return `Анализ SCP-${scpNumber}:<br>
    - Класс объекта: ${report.класс}<br>
    - Уровень риска: ${report.риск}<br>
    - Прогноз поведения: ${report.прогноз}<br>
    - Рекомендации: ${report.рекомендации}<br>
    - Точность прогноза: ${(85 + Math.floor(Math.random() * 10))}%`;
}

// Генерация сценариев
function generateScenarios(scpNumber) {
    return `Возможные сценарии содержания для SCP-${scpNumber}:<br>
    <ul class="scenario-list">
        <li>Сценарий Alpha: Стандартное содержание - вероятность успеха 92%</li>
        <li>Сценарий Beta: Усиленные меры безопасности - вероятность успеха 96%</li>
        <li>Сценарий Gamma: Экспериментальные протоколы - вероятность успеха 78%</li>
        <li>Сценарий Omega: Нарушение содержания - вероятность 8%</li>
    </ul>`;
}

// Расчет вероятности
function calculateProbability(event) {
    const probability = Math.floor(Math.random() * 100);
    let assessment = '';
    
    if (probability < 20) assessment = 'маловероятно';
    else if (probability < 50) assessment = 'возможно';
    else if (probability < 80) assessment = 'вероятно';
    else assessment = 'очень вероятно';
    
    return `Вероятность события "${event}":<br>
    <div class="prediction-container">
        <div class="prediction-bar">
            <div class="prediction-fill" style="width: ${probability}%"></div>
            <div class="prediction-label">${probability}%</div>
        </div>
    </div>
    Оценка: ${assessment}`;
}

// Показать визуализацию
function showVisualization(scpNumber) {
    const modal = document.getElementById('visualization-modal');
    const container = document.getElementById('visualization-container');
    
    container.innerHTML = `
        <h2>Визуализация данных SCP-${scpNumber}</h2>
        <div class="visualization" id="data-visualization"></div>
        <p>Анализ паттернов поведения и прогнозирование аномальной активности</p>
    `;
    
    modal.style.display = 'block';
    renderDataVisualization(scpNumber);
}

// Рендер визуализации данных
function renderDataVisualization(scpNumber) {
    const viz = document.getElementById('data-visualization');
    viz.innerHTML = '';
    
    // Создание узлов данных
    for (let i = 0; i < 20; i++) {
        const node = document.createElement('div');
        node.className = 'data-node';
        node.style.left = `${10 + Math.random() * 80}%`;
        node.style.top = `${10 + Math.random() * 80}%`;
        node.style.backgroundColor = `hsl(${120 + Math.random() * 120}, 100%, 50%)`;
        viz.appendChild(node);
    }
    
    // Анимация движения узлов
    const nodes = viz.querySelectorAll('.data-node');
    nodes.forEach(node => {
        moveNode(node);
    });
}

// Движение узлов
function moveNode(node) {
    const x = Math.random() * 90 + 5;
    const y = Math.random() * 90 + 5;
    
    node.style.transition = `all ${2 + Math.random() * 3}s ease-in-out`;
    node.style.left = `${x}%`;
    node.style.top = `${y}%`;
    
    setTimeout(() => {
        moveNode(node);
    }, 2000 + Math.random() * 3000);
}

// Закрытие модального окна
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('visualization-modal').style.display = 'none';
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(event) {
    const modal = document.getElementById('visualization-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Инициализация
window.onload = function() {
    const initialInput = document.getElementById('command-input');
    initialInput.focus();
    
    initialInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.value.trim();
            this.value = '';
            
            if (command) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                processCommand(command);
            }
        }
    });
};
