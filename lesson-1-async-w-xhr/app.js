(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        // searchedForText = 'hippos';

        const imgRequest = new XMLHttpRequest();
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.onload = addImage;
        imgRequest.onerror = handleError;
        imgRequest.setRequestHeader('Authorization', 'Client-ID 7b874923e93002bbae8595f0faaa117b1e05967b4d91a2c38fc7c72a92ba62ea');
        imgRequest.send();

        function handleError(error) {
            console.log('An error occurred.😞');
            console.log('error:', error);
        }

        function addImage() {
            let htmlContent = '';
            const data = JSON.parse(this.responseText);

            if (data && data.results && data.results[0]) {
                const firstImage = data.results[0];
                htmlContent = `<figure>
                    <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`;
            } else {
                htmlContent = '<div class="error-no-image">No images available</div>';
            }

            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=21b5ae09d2704d48906b40b4c10f0b31`);
        articleRequest.send();

        function addArticles() {
            let htmlContent = '';
            const data = JSON.parse(this.responseText);

            // my way (es5)
            // if (data && data.response.docs && data.response.docs[0]) {
            //     htmlContent += '<ul>';
            //     for (let i = 0; i < data.response.docs.length; i++) {
            //         const article = data.response.docs[i];
            //         htmlContent += `<li class="article">
            //                 <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
            //                 <p>${article.snippet}</p>
            //             </li>`;
            //     }
            //     htmlContent += '</ul>';
            // } else {
            //     htmlContent = '<div class="error-no-article">No articles available</div>';
            // }

            // their way (es6)
            if (data && data.response.docs && data.response.docs[0]) {
                htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                        <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                        <p>${article.snippet}</p>
                    </li>`
                ).join('') + '</ul>';
            } else {
                htmlContent = '<div class="error-no-article">No articles available</div>';
            }

            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }
    });
})();
