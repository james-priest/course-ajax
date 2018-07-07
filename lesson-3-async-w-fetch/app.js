(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // es5
        // fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
        //     headers: {
        //         Authorization: 'Client-ID 7b874923e93002bbae8595f0faaa117b1e05967b4d91a2c38fc7c72a92ba62ea'
        //     }
        // }).then(function (response) {
        //     if (response.ok) {
        //         return response.json();
        //     } else {
        //         console.log(response.status, response.statusText);
        //         throw new Error('network error');
        //     }
        // }).then(function (jsonData) {
        //     console.log(jsonData);
        //     return jsonData;
        // }).then(addImage).catch(function (err) {
        //     console.log('catch:', err);
        // });

        // es6
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 7b874923e93002bbae8595f0faaa117b1e05967b4d91a2c38fc7c72a92ba62ea'
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            console.log(response.status, response.statusText);
            throw new Error('network error');
        }).then(jsonData => {
            console.log(jsonData);
            return jsonData;
        }).then(addImage)
            .catch(err => requestError(err, 'image'));

        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?
            q=${searchedForText}&api-key=21b5ae09d2704d48906b40b4c10f0b31`
        ).then(response => {
            if (response.ok) {
                return response.json();
            }
            console.log(response.status, response.statusText);
            throw new Error('network error');
        }).then(jsonData => {
            console.log(jsonData);
            return jsonData;
        }).then(addArticles)
            .catch(err => requestError(err, 'articles'));

        function addImage(data) {
            let htmlContent = '';
            const firstImage = data.results[0];

            if (firstImage) {
                htmlContent = `<figure>
                    <img src="${firstImage.urls.small}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`;
            } else {
                htmlContent = 'Unfortunately, no image was returned for your search.'
            }

            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }

        function addArticles(data) {
            let htmlContent = ''

            if (data.response && data.response.docs && data.response.docs.length > 1) {
                htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                    </li>`
                ).join('') + '</ul>';
            } else {
                htmlContent = '<div class="error-no-articles">No articles available</div>';
            }

            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        function requestError(err, part) {
            console.log(err);
            responseContainer.insertAdjacentHTML('beforeend', `
                <p class="network-warning">
                    Oh no! There was an error making a request for the ${part}.
                </p>`);
        }
    });
})();
