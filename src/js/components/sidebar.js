export class Sidebar {
  /**
   * Creates an instance of the Sidebar class.
   * @param {string} sidebarSelector - Sidebar element selector.
   * @param {string} openBtnSelector - Button selector to open the sidebar.
   * @param {string} align - Slide direction ('left' or 'right').
   */
  constructor(sidebarSelector, openBtnSelector, align = 'left') {
    this.sidebar = document.querySelector(sidebarSelector)
    this.openBtn = document.querySelector(openBtnSelector)
    this.closeBtn = this.sidebar.querySelector('#close-sidebar')

    // Привязываем обработчики событий к экземпляру класса
    this.handleOpenClick = this.handleOpenClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.sidebar.addEventListener('click', this.closeOnBackdropClick.bind(this))

    // Устанавливаем атрибут data-align
    this.sidebar.setAttribute('data-align', align)

    this.attachListeners()
  }

  /**
   * Открывает сайдбар.
   */
  open() {
    this.sidebar.showModal()
    this.initialFormValues = this.getFormValues()
  }

  /**
   * Закрывает сайдбар и очищает поля.
   */
  close() {
    this.sidebar.close()
    this.clearFields()
  }

  /**
   * Добавляет обработчик события клика на сайдбар для закрытия.
   * Закрытие панели при клике на зайдний фон
   * @param {MouseEvent} event - Событие клика мыши.
   */
  closeOnBackdropClick(event) {
    const isClickedOnBackdrop = event.target === this.sidebar
    if (isClickedOnBackdrop) {
      this.isFormChanged() ? this.confirmCloseSidebar() : this.close()
    }
  }

  /**
   * Получает текущие значения полей формы.
   */
  getFormValues() {
    const formElements = this.sidebar.querySelectorAll('input, select, textarea')
    const values = {}
    formElements.forEach((element) => {
      values[element.name] = element.value
    })
    return values
  }

  /**
   * Проверяет, были ли изменены данные в форме.
   */
  isFormChanged() {
    const currentFormValues = this.getFormValues()
    for (const key in currentFormValues) {
      if (currentFormValues[key] !== this.initialFormValues[key]) {
        return true
      }
    }
    return false
  }

  /**
   * Очищает текстовые поля и области с текстом ошибок.
   */

  clearFields() {
    const formElementsToClear = this.sidebar.querySelectorAll('input, select, textarea')
    const errorFieldsToClear = this.sidebar.querySelectorAll('.input-error')

    if (formElementsToClear) {
      formElementsToClear.forEach((element) => {
        element.value = '' // Очищаем значение элемента формы

        if (element.tagName === 'SELECT') {
          element.selectedIndex = -1 // Сбрасываем выбор в селекте
        }
      })
    }

    if (errorFieldsToClear) {
      errorFieldsToClear.forEach((errorField) => {
        errorField.textContent = '' // Очищаем текст ошибок
      })
    }
  }

  /**
   * Прикрепляет обработчики событий.
   */
  attachListeners() {
    this.openBtn.addEventListener('click', this.handleOpenClick)
    this.closeBtn.addEventListener('click', this.handleCloseClick)
    this.sidebar.addEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Удаляет обработчики событий.
   */
  removeListeners() {
    this.openBtn.removeEventListener('click', this.handleOpenClick)
    this.closeBtn.removeEventListener('click', this.handleCloseClick)
    this.sidebar.removeEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Обработчик события клика на кнопке открытия.
   */
  handleOpenClick() {
    this.open()
  }

  /**
   * Отображает подтверждение закрытия сайдбара.
   */
  confirmCloseSidebar() {
    const confirmationMessage = 'Данные были изменены. Действительно хотите закрыть меню?'
    const isConfirmed = confirm(confirmationMessage)
    if (isConfirmed) {
      this.close()
    }
  }

  /**
   * Обработчик события клика на кнопке закрытия.
   */
  handleCloseClick() {
    if (this.isFormChanged()) {
      this.confirmCloseSidebar()
    } else {
      this.close()
    }
  }

  /**
   * Обработчик события нажатия клавиши.
   * @param {KeyboardEvent} event - Событие нажатия клавиши.
   */
  handleKeyDown(event) {
    if (event.key === 'Escape') {
      if (this.isFormChanged()) {
        this.confirmCloseSidebar()
      } else {
        this.close()
      }
    }
  }
}
