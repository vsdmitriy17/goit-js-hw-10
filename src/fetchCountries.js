// путь к API - эндпоинт, базовый URL, точка входа в API.
const BASE_URL = 'https://restcountries.com/v3.1'
// параметры настроек (выборки) запроса
const searchParams = new URLSearchParams({
    fields: "capital,flags,languages,name,population",
});

// Ф-ция для составления запросов к серверу API, принимает параметр name (строка - ресурс, к которому мы обращаемся в API), возвращает результат вызова метода fetch() - промис, который
//    вызывает метод then() и передает результат промиса (fulfilled) данные - в параметр (response) метода, который:
//             - если response не оk, принудительно вызывает ошибку throw new Error(response.status) - error
//             - иначе возвращает полученные данные в JSON формате response.json()
function fetchCountries(name) {
    return fetch(`${BASE_URL}/name/${name}?${searchParams}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    });
};
// именованный экспорт ф-ции fetchCountries
export { fetchCountries };