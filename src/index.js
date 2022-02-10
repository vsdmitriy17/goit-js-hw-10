// Импортируем стили, библиотеки lodash.debounce, notiflix, ф-цию fetchCountries
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from "./fetchCountries.js";
import { notiflixOptions } from "./notiflixOptions.js";

// Задержка ф-ции debounce()
const DEBOUNCE_DELAY = 300;

// Выбираем элементы input#search-box, div.country-info, ul.country-list
const inputEl = document.querySelector('input#search-box');
const divCardEl = document.querySelector('.country-info');
const ulCardsEl = document.querySelector('.country-list');

// Устанавливаем слушатель собития 'input' на элемент inputEl
inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

// Колбэк ф-ция на событие 'input' на элементе inputEl:
//    1) выводит в консоль текущее значение inputEl
//    2) очищает страницу
//    3) если текущее значение inputEl - пустая строка, то прикращает работу;
//       иначе - вызывает ф-цию fetchCountries(name), которая возвращвет промис,
//              1. если результат fetchCountries(name) - fulfilled, то результат промиса массив объектов data (запрошенные данные с API), передается в параметр метода then(data):
//                   - если в data более 10 объектов, то метод then(data) возвращвет сообщение 'Too many matches found. Please enter a more specific name.';
//                   - если в data объктов больше 1, но меньше 10, то метод then(data):
//                          1) выводит в консоль массив data;
//                          2) создает разметку cardsMarkup на основе данных data;
//                          3) вставляет cardsMarkup в элемент ulCardsEl (добавляет разметку cardsMarkup в ul.country-list).
//                   - в остальных случаях, метод then(data):
//                          1) выводит в консоль массив data;
//                          2) создает разметку карточки (ф-ция createCardMarkup(data)), на основе данных data и вставляет ее в элемент divCardEl (добавляет разметку карточки в div.country-info).
//              2. если результат fetchCountries(name) - rejected, то результат промиса error (ошибка), передается в параметр метода catch(), который:
//                   - выводит в консоль сообщение '❌ Worning! Rejected promis!' и значение error;
//                   - выводит на экран сообщение 'Oops, there is no country with that name'
function onInputChange(evt) {
    console.log(evt.target.value.trim());
    const name = evt.target.value.trim(); // текущее значение inputEl (текст введенный в inputEl), с игнорированием пробелов (trim())
    cleanPage();
    if (!name) {
        return;
    };
    fetchCountries(name)
        .then(data => {
            if (data.length > 10) {
                return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            } else if (data.length > 1) {
                console.log(data);
                const cardsMarkup = createListMarkup(data);
                return ulCardsEl.insertAdjacentHTML('beforeend', cardsMarkup);
            }
            console.log(data);
            return divCardEl.insertAdjacentHTML('beforeend', createCardMarkup(data));
        })
        .catch(error => {
            console.log('❌ Worning! Rejected promis!', error);
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
};

// Ф-ция принимает массив объектов data и возвращает строку с разметкой карточек - єлементов <li></li>, для всех объектов массива, на основе свойств объекта { flags, name }
function createListMarkup(data) {
    return data.map(({ flags, name }) => {
        return `
                <li class="list_item">
                    <img class="flag"
                        src="${flags.png}"
                        alt="${name.common}"
                        width="40"
                    />
                    <b class="description">${name.common}</b>
                </li>
                `;
    }).join('');
};

// Ф-ция принимает массив объектов data и возвращает строку с разметкой карточки - єлемент <div class="list_item"></div>, для объекта массива data[0], на основе свойств объекта { capital, flags, languages, name, population }
function createCardMarkup(data) {
    const { capital, flags, languages, name, population } = data[0]; // деструктуризация объекта
    const capitalCities = capital.join(", "); // строка из всех элементов массива capital
    const languagesList = Object.values(languages).join(", "); // строка из всех собственных значений ключей объекта languages
    return `
                <div class="list_item">
                    <img class="flag"
                        src="${flags.png}"
                        alt="${name.common}"
                        width="70"
                    />
                    <h3 class="name">${name.official}</h3>
                </div>
                <p class="descrItem"><span class="description">Capital:</span> ${capitalCities}</p>
                <p class="descrItem"><span class="description">Population:</span> ${population}</p>
                <p class="descrItem"><span class="description">Languages:</span> ${languagesList}</p>
            `;
};

// Ф-ция удаляет разметку в элементах divCardEl и ulCardsEl
function cleanPage() {
    divCardEl.innerHTML = '';
    ulCardsEl.innerHTML = '';
};
