import { Sidebar } from './components/sidebar'
import { nanoid } from 'nanoid'
import { Notification } from './components/notification'

// первый параметр - сайдбар,
// второй - кнопка по клику на которую открывается сайдбар,
// третий положение сайдбара (если не передан, то по умолчанию 'left'
const panel = new Sidebar('#sidebar', '#open-basket', 'right')
const form = document.querySelector('#productForm')
const productList = document.querySelector('.products-list') // контейнер для отрисовки товаров на главной странице
const basketItemList = document.querySelector('#basket-list') // контейнер для отрисовки товаров в корзине
const basketTotalValue = document.querySelector('.basket__total-value') // итоговое значение в корзине
const basketCountInfo = document.querySelector('.basket-count__info') // кол-во товаров (в кнопке basket)

// Функция для инициализации основных функций и т.д.
const init = () => {
  window.addEventListener('DOMContentLoaded', async () => {
    await loadJSON() // асинхронная функция загрузки данных (код будет ждать, пока эта функция завершится)

    loadCart() // функция загрузки данных в корзину товаров

    // Обработка данных формы
    form.addEventListener('submit', (e) => {
      e.preventDefault() // иначе форма отправится синхронно. Это приведет к перезапуску страницы, а значит, метод addProduct не успеет выполниться.
      addProduct()
    })
    purchaseProduct()
  })
}

init()

// Функция подгрузки данных на главную страницу
async function loadJSON() {
  let html = ''

  try {
    const response = await fetch('http://localhost:3000/products')
    const data = await response.json()

    console.log('data', data)

    if (data && Array.isArray(data)) {
      data.forEach((product) => {
        html += `
            <div class="main-card" data-card-id=${product?.id}>
              <div class="card-image">
                <img src="${product?.imgSrc}" alt="image">

                <div class="card-wishlist">
                  <div class="wishlist-rating">

                    <div class="rating-img">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 6.12414H9.89333L8 0L6.10667 6.12414H0L4.93333 9.90345L3.06667 16L8 12.2207L12.9333 16L11.04 9.87586L16 6.12414Z"
                          fill="#FFCE31" />
                      </svg>
                    </div>

                    <span class="rating-amount">${product?.rating}</span>
                  </div>

                  <svg class="whishlist-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                    </path>
                  </svg>
                </div>
              </div>

              <h3 class="card-name">${product?.name}</h3>

              <p class="card-category">${product?.category}</p>

              <p class="card-price">${product?.price}</p>

              <button class="btn btn-primary">Add to cart</button>
            </div>
          `
      })
    }
    productList.innerHTML = ''

    productList.insertAdjacentHTML('beforeend', html)
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}

// Функция создания товара через форму
const addProduct = async () => {
  // отдельная сущность товара
  const productData = {
    id: nanoid(),
  }

  // собираем данные из формы
  Array.from(form?.elements).forEach((element) => {
    if (element?.name) {
      productData[element?.name] = element?.value
    }
  })

  try {
    const response = await fetch(' http://localhost:3000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })

    if (response.ok) {
      const notificationInfo = new Notification({
        variant: 'green',
        title: 'Добавление товара:',
        subtitle: 'Товар был добавлен на страницу',
      })

      form.reset()
      loadJSON() // показываем актуальные данные
    } else {
      console.log('Error to add product.')
    }
  } catch (error) {
    console.error('Error', error)
  }
}

// Функция добавления товара в корзину
function purchaseProduct() {
  const cards = document.querySelectorAll('.main-card') // получаем все карточки

  cards.forEach((card) => {
    card.addEventListener('click', () => getProductInfo(card))
  })
}

// Функция извлечения данных из карточки на главной странице
function getProductInfo(product) {
  const imgElement = product?.querySelector('.card-image img')
  const imgSrc = imgElement ? new URL(imgElement.src).pathname : '' // для преобразования относительного пути в абсолютный

  const productInfo = {
    id: product?.dataset.cardId ?? '',
    imgSrc: imgSrc,
    name: product?.querySelector('.card-name')?.textContent ?? '',
    category: product?.querySelector('.card-category')?.textContent ?? '',
    price: product?.querySelector('.card-price')?.textContent ?? '',
  }

  addProductsToBasketList(productInfo) // добавление товара в корзину
  const notificationInfo = new Notification({
    variant: 'success',
    title: 'Добавление товара:',
    subtitle: 'Товар был добавлен в корзину',
  })

  product = {
    ...productInfo,
    quantity: 1, // Добавляем свойство количества товаров quantity с начальным значением 1
  }
  addProductsToBasketList(product)
  saveProductInStorage(productInfo) // запись товара в localStorage
  updateCartInfo()
}

// Функция добавления товаров в корзину
function addProductsToBasketList(product) {
  const basketItem = document.createElement('div')

  basketItem.classList.add('basket-item')

  basketItem.setAttribute('data-id', `${product?.id}`)

  basketItem.innerHTML = `
    <div class="item-card">
      <div class="item-image">
        <img src="${product?.imgSrc}" alt="product image">
      </div>
      <div class="inline-flex flex-column gap">
        <h3 class="item-name">${product?.name}</h3>
        <p class="item-category">${product?.category}</p>
        <!-- Компонент степпер  -->
          <div class="counter">
            <label class="counter__field">
              <input class="counter__input" type="text" value="1" maxlength="3" readonly />
              <span class="counter__text">шт</span>
            </label>
            <div class="counter__btns">
              <button class="counter__btn counter__btn--up" aria-label="Увеличить количество">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5">
                  <g>
                    <g>
                      <path d="M3.904-.035L-.003 3.151 1.02 5.03l2.988-2.387 2.988 2.387 1.022-1.88-3.89-3.186z"></path>
                    </g>
                  </g>
                </svg>
              </button>
              <button disabled class="counter__btn counter__btn--down" aria-label="Уменьшить количество">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5">
                  <g>
                    <g>
                      <path d="M3.904 5.003L-.003 1.818 1.02-.062l2.988 2.386L6.995-.063l1.022 1.88-3.89 3.186z"></path>
                    </g>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        <button id="delete-icon" class="button close-button">
          Remove
          <img src="src/images/delete-icon.svg" alt="delete-icon">
        </button>
      </div>
      <div class="inline-flex">
        <p class="item-price">${product?.price}</p>
      </div>
    </div>
  `

  basketItemList.appendChild(basketItem) // вставляем карточку в узел родителя

  const counter = basketItem.querySelector('.counter')
  const counterInput = basketItem.querySelector('.counter__input')
  const counterBtnUp = basketItem.querySelector('.counter__btn--up')
  const counterBtnDown = basketItem.querySelector('.counter__btn--down')
  const itemPriceElement = basketItem.querySelector('.item-price') // Элемент с ценой товара

  let itemPrice = parseFloat(product.price) // Получаем цену товара
  let COUNT = 1

  // let COUNT = Number.parseInt(counterInput.value, 10) // Получение значения

  // Увеличение значения
  counterBtnUp.addEventListener('click', () => {
    COUNT++

    updateCounterState()
  })

  // Уменьшение значения
  counterBtnDown.addEventListener('click', () => {
    COUNT--

    updateCounterState()
  })

  function updateCounterState() {
    counterBtnDown.toggleAttribute('disabled', COUNT === 1)
    counterBtnUp.toggleAttribute('disabled', COUNT === 10)
    counterInput.value = COUNT
    const totalPrice = itemPrice * COUNT // Общая стоимость товара
    itemPriceElement.textContent = totalPrice.toFixed(2) // Обновляем отображение суммы товара в корзине
    // Пересчет общей суммы в корзине
    updateCartInfo()
  }

  const deleteButton = basketItem.querySelector('#delete-icon')
  deleteButton.addEventListener('click', () => deleteProduct(basketItem))
  updateCartInfo()
}

/// Счетчик корзины

function updateCartInfo() {
  const cartInfo = findCartInfo() // Получаем данные о товарах

  basketCountInfo.textContent = cartInfo.productCount
  basketTotalValue.textContent = cartInfo.total // Обновляем общую сумму в корзине
}

// Итоговая функция (total) и кол-во товаров в сайдбаре
function findCartInfo() {
  const products = getProductFromStorage() // Получаем данные о товарах в корзине

  let total = 0 // Инициализируем общую стоимость

  // Перебираем каждый товар и прибавляем его стоимость к общей стоимости
  products.forEach((product) => {
    const price = Number.parseFloat(product.price) // Получаем цену товара из строки в число
    total += price * product.quantity || 0 // Умножаем цену на количество и добавляем к общей стоимости
    console.log(`Price: ${price}, Quantity: ${product.quantity}`)
  })

  return {
    total: total.toFixed(2), // Общая стоимость всех товаров в корзине
    productCount: products.length, // Количество товаров в корзине
  }
}

// Функция загрузки данных из localStorage в корзину товаров
function loadCart() {
  const elements = getProductFromStorage()

  elements.forEach((element) => addProductsToBasketList(element))

  updateCartInfo() // показ счетчика в корзине
}

// Функция удаления товара из DOM
function deleteProduct(basketItem) {
  basketItem.remove()
  updateCartInfo()

  const notificationInfo = new Notification({
    variant: 'success',
    title: 'Удаление товара:',
    subtitle: 'Товар был удален из корзины',
  })

  const products = getProductFromStorage()
  const updateProducts = products.filter((product) => product.id !== basketItem.dataset.id)
  localStorage.setItem('products', JSON.stringify(updateProducts))

  localStorage.setItem('products', JSON.stringify(updateProducts)) // перезапись данных в LocalStorage

  updateCartInfo()
}

// Функция для сохранения в localStorage
function saveProductInStorage(product) {
  const products = getProductFromStorage()

  products.push(product)

  localStorage.setItem('products', JSON.stringify(products)) // запись данных в localStorage

  updateCartInfo() // показ новых данных в корзине
}

// Функция для получения данных из localStorage
function getProductFromStorage() {
  // если данных нет, показываем []
  return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : []
}
