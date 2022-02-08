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

function createListMarkup(data) {
    return data.map(({ flags,name }) => {
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

function createCardMarkup(data) {
    const { capital, flags, languages, name, population } = data[0];
    const capitalCities = capital.join(", ");
    const languagesList = Object.values(languages).join(", ");
    return `
                <div class="list_item">
                    <img class="flag"
                        src="${flags.png}"
                        alt="${name.common}"
                        width="70"
                    />
                    <h3 class="name">${name.official}</h3>
                </div>
                <p><span class="description">Capital:</span> ${capitalCities}</p>
                <p><span class="description">Population:</span> ${population}</p>
                <p><span class="description">Languages:</span> ${languagesList}</p>
            `;
}; 

function cleanPage() {
    divCardEl.innerHTML = '';
    ulCardsEl.innerHTML = '';
};
