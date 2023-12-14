export class Notification {
  /**
   * Создает новый экземпляр уведомления.
   * @param {Object} options - Опции уведомления.
   * @param {string} options.variant - Вариант уведомления (например, 'information', 'warning', 'error' ...).
   * @param {string} [options.title] - Заголовок уведомления.
   * @param {string} [options.subtitle] - Подзаголовок уведомления.
   */
  constructor({ variant, title, subtitle }) {
    this.variant = variant
    this.title = title || 'Notification title'
    this.subtitle = subtitle || 'Subtitle text goes here.'
    this.container = this.getTemplate()
    this.addToDOMAfterDelay()
    this.addCloseButtonHandler()
  }

  /**
   * Создает элемент уведомления и заполняет его контентом.
   * @returns {HTMLDivElement} Элемент уведомления.
   */
  getTemplate() {
    const template = document.createElement('div')
    template.classList.add('notification', `notification-${this.variant}`)

    template.innerHTML = `
      <div class="notification-icon">
        ${this.getIconSVG(this.variant)} <!-- Вставляем иконку в зависимости от варианта -->
      </div>
      <div class="notification-content">
        <span class="notification-title">${this.title}</span>
        <span class="notification-subtitle">${this.subtitle}</span>
      </div>
      <button class="notification-button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15 5.875L14.125 5L10 9.125L5.875 5L5 5.875L9.125 10L5 14.125L5.875 15L10 10.875L14.125 15L15 14.125L10.875 10L15 5.875Z" fill="white"/>
        </svg>
      </button>
    `

    return template
  }

  /**
   * Возвращает SVG-иконку в зависимости от заданного варианта.
   *
   * @param {string} variant - Вариант иконки.
   * @returns {string} SVG-иконка.
   */
  getIconSVG(variant) {
    switch (variant) {
      case 'success':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.25C5.125 1.25 1.25 5.125 1.25 10C1.25 14.875 5.125 18.75 10 18.75C14.875 18.75 18.75 14.875 18.75 10C18.75 5.125 14.875 1.25 10 1.25ZM8.75 13.75L5.375 10.375L6.5 9.375L8.75 11.625L13.75 6.75L14.875 7.75L8.75 13.75Z" fill="#42BE65"/></svg>`
      case 'information':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM10 5C10.1854 5 10.3667 5.05498 10.5208 5.158C10.675 5.26101 10.7952 5.40743 10.8661 5.57873C10.9371 5.75004 10.9557 5.93854 10.9195 6.1204C10.8833 6.30225 10.794 6.4693 10.6629 6.60041C10.5318 6.73152 10.3648 6.82081 10.1829 6.85699C10.001 6.89316 9.81254 6.87459 9.64123 6.80364C9.46993 6.73268 9.32351 6.61252 9.2205 6.45835C9.11748 6.30418 9.0625 6.12292 9.0625 5.9375C9.0625 5.68886 9.16127 5.4504 9.33709 5.27459C9.5129 5.09877 9.75136 5 10 5ZM12.5 15.0781H7.5V13.6719H9.29688V10.0781H8.125V8.67188H10.7031V13.6719H12.5V15.0781Z" fill="#4589FF"/></svg>`
      case 'warning':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.25C5.25 1.25 1.25 5.25 1.25 10C1.25 14.75 5.25 18.75 10 18.75C14.75 18.75 18.75 14.875 18.75 10C18.75 5.125 14.875 1.25 10 1.25ZM9.375 5H10.625V11.25H9.375V5ZM10 15.25C9.5 15.25 9 14.75 9 14.25C9 13.75 9.375 13.25 10 13.25C10.5 13.25 11 13.75 11 14.25C11 14.75 10.5 15.25 10 15.25Z" fill="#F1C21B"/>
        </svg>`
      case 'error':
        return `<svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.25C5.125 1.25 1.25 5.125 1.25 10C1.25 14.875 5.125 18.75 10 18.75C14.875 18.75 18.75 14.875 18.75 10C18.75 5.125 14.875 1.25 10 1.25ZM13.375 14.375L5.625 6.625L6.625 5.625L14.375 13.375L13.375 14.375Z" fill="#FA4D56"/></svg>`
    }
  }

  /**
   * Добавляет уведомление в DOM с небольшой задержкой.
   */
  addToDOMAfterDelay() {
    // Замедление в 0.5 секунды перед добавлением в DOM
    setTimeout(() => {
      document.body.appendChild(this.container)

      // Автоматическое закрытие через 2 секунды
      setTimeout(() => {
        this.closeNotification()
      }, 2000)
    }, 1000)
  }

  /**
   * Добавляет обработчик на кнопку закрытия уведомления.
   */
  addCloseButtonHandler() {
    const closeButton = this.container.querySelector('.notification-button')
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.closeNotification()
      })
    }
  }

  /**
   * Закрывает уведомление и удаляет его из DOM.
   */
  closeNotification() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
  }
}
