/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID 7b874923e93002bbae8595f0faaa117b1e05967b4d91a2c38fc7c72a92ba62ea'
            }
        }).done(addImage)
            .fail(function (err) {
                requestError(err, 'image');
            });

        function addImage(data) {
            let htmlContent = '';

            if (data && data.results && data.results.length > 1) {
                const firstImage = data.results[0];

                responseContainer.insertAdjacentHTML('afterbegin', `<figure>
                        <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                    </figure>`
                );
            } else {
                htmlContent = '<div class="error-no-image">No images available</div>';
            }

            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }

        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=21b5ae09d2704d48906b40b4c10f0b31`
        }).done(
            addArticles
        ).fail(function (err) {
            requestError(err, 'articles');
        });

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

        function requestError(e, part) {
            console.log('An error occurred.😞');
            console.log('error:', e);
            responseContainer.insertAdjacentHTML('beforeend',
                `<p class="network-warning error-no-${part}">Missing ${part}</p>`);
        }
    });
})();
