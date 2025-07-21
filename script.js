document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('feedbackForm');
  const messagesList = document.getElementById('messagesList');

  // Загружаем последние сообщения при загрузке страницы
  loadMessages();

  // Обработка отправки формы
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
      date: new Date().toLocaleString()
    };

    // Проверка заполнения полей
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Заполните все поля!');
      return;
    }

    // Сохраняем сообщение
    saveMessage(formData);
    
    // Очищаем форму
    form.reset();
    
    // Обновляем список сообщений
    loadMessages();
  });

  // Функция сохранения сообщения в JSON-файл
  function saveMessage(data) {
    let messages = [];
    
    // Пытаемся загрузить существующие сообщения
    try {
      const saved = localStorage.getItem('feedbackMessages');
      if (saved) messages = JSON.parse(saved);
    } catch (e) {
      console.error('Ошибка чтения сообщений:', e);
    }
    
    // Добавляем новое сообщение
    messages.unshift(data);
    
    // Оставляем только 3 последних
    messages = messages.slice(0, 3);
    
    // Сохраняем обратно в localStorage
    localStorage.setItem('feedbackMessages', JSON.stringify(messages));
  }

  // Функция загрузки и отображения сообщений
  function loadMessages() {
    let messages = [];
    
    try {
      const saved = localStorage.getItem('feedbackMessages');
      if (saved) messages = JSON.parse(saved);
    } catch (e) {
      console.error('Ошибка загрузки сообщений:', e);
    }
    
    // Отображаем сообщения
    messagesList.innerHTML = messages.length > 0
      ? messages.map(msg => `
          <div class="message-item">
            <p><strong>${msg.name}</strong> (${msg.phone})</p>
            <p>${msg.message}</p>
            <small>${msg.date}</small>
          </div>
        `).join('')
      : '<p>Пока нет сообщений.</p>';
  }
});