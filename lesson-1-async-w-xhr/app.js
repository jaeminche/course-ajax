(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText = 'hippos';
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
    

        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function (err) {
            requestError(err, 'image');
        };
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);        
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 9c6285cdec23c3a2b01918475be5b49c27ea76a1493cf50c4004bdf474f1bd00');
        unsplashRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function (err) {
            requestError(err, 'article');
        };
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=b6747e49e5854c1ab2602894bc6846a6`);
        articleRequest.send();

        function addImage() {
            // debugger;
            let htmlContent = '';
            const data = JSON.parse( this.responseText ); // convert data from JSON to a JavaScript object
            if (data && data.results && data.results[0]) {
                const firstImage = data.results[0];

                htmlContent = `<figure>
                    <img src = "${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                    </figure>`;         
            } else {
                htmlContent = '<div class="error-no-image">No images available</div>';
            }
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }


        function addArticles () {
            let htmlContent = '';
            const data = JSON.parse( this.responseText ); // convert data from JSON to a JavaScript object
            console.log(data);
            if (data && data.response && data.response.docs.length > 1) {
                htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article"><h2><a href="${article.web_url}">${article.headline.main}</a></h2><p>${article.snippet}</p></li>`).join('') + '</ul>';         
            } else {
                htmlContent = '<div class="error-no-article">No article available</div>';
            }
            responseContainer.insertAdjacentHTML('beforeend', htmlContent);            
        }
    });
})();
