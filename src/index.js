import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from "./fetchCountries.js";

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('input#search-box');
const divCardEl = document.querySelector('.country-info');
const ulCardsEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(evt) {
    console.log(evt.target.value.trim());
    const name = evt.target.value.trim();
    cleanPage();
    fetchCountries(name)
        .then(data => {
            if (data.length > 10) {
                return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            } else if (data.length > 1) {
                console.log(data);
                const cardsMarkup = createCardsListMarkup(data);
                return ulCardsEl.insertAdjacentHTML('beforeend', cardsMarkup);
            }
            console.log(data);
            return divCardEl.insertAdjacentHTML('beforeend', createCardMarkup(data));
        })
        .catch(error => {
            console.log('ОШИБКА!', error);
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
};

function createCardsListMarkup(data) {
    return data.map(({ capital,flags,languages,name,population }) => {
        return `
                <li>
                    <svg class="flag">
                        <use href="${flags.svg}"></use>
                    </svg>
                    <h3 class="name">${name.common}</h3>
                </li>
                `;
    }).join('');
}; 

function createCardMarkup(data) {
    const { capital, flags, languages, name, population } = data[0];
    const capitalCities = capital.join(", ");
    const languagesList = Object.values(languages).join(", ");
    return `
                <svg class="flag">
                    <use href="${flags.svg}"></use>
                </svg>
                <h3 class="name">${name.official}</h3>
                <p><span>Capital:</span> ${capitalCities}</p>
                <p><span>Population:</span> ${population}</p>
                <p><span>Languages:</span> ${languagesList}</p>
            `;
}; 

function cleanPage() {
    divCardEl.innerHTML = '';
    ulCardsEl.innerHTML = '';
};
