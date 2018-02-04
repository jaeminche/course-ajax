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
                Authorization: 'Client-ID 9c6285cdec23c3a2b01918475be5b49c27ea76a1493cf50c4004bdf474f1bd00'
            }
        }).done(addImage)
        .fail(function(err) {
        	requestError(err, 'image');
        });


        $.ajax({
        	url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=b6747e49e5854c1ab2602894bc6846a6`
        }).done(addArticles)
        .fail(function(err) {
        	requestError(err, 'articles');
        });

        // jQuery detects the response and 
        // if it's JSON, it will automatically convert it to JavaScript for us. How awesome is that!

        // the function now has one parameter images
		// this parameter has already been converted from JSON to a JavaScript object,
		// so * the line that had JSON.parse() is no longer needed.
		// the firstImage variable is set to the images.results first item
        function addImage(data) {
        	let htmlContent = '';

        	if (data && data.results && data.results.length > 1) {
			    const firstImage = data.results[0];
			    htmlContent = `<figure>
			            <img src="${firstImage.urls.small}" alt="${searchedForText}">
			            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
			        </figure>`;			    
        	} else {
        		htmlContent = '<div class="error-no-image">No images available</div>';
        	}

        	responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
		}

		function addArticles(data) {
			// debugger;
			let htmlContent = '';

			if (data.response && data.response.docs && data.response.docs.length > 1) {
            	htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article"><h2><a href="${article.web_url}">${article.headline.main}</a></h2><p>${article.snippet}</p></li>`
            		).join('') + '</ul>'; 				
			} else {
				htmlContent = '<div class="error-no-article">No article available</div>';
			}
  	
            responseContainer.insertAdjacentHTML('beforeend', htmlContent);    		
		}

		function requestError(e, part) {
			console.log(e);
			responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error">network-warning error ${part}</p>`);
		}

    });
})();
