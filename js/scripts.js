// Wait til the DOM is loaded
$(document).ready(function(){

    // All api calls go to this link
    const apiBaseUrl = 'http://api.themoviedb.org/3';
    // All images use this link
    const imageBaseUrl = 'http://image.tmdb.org/t/p/';

    const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key=' + apiKey;
    // console.log(nowPlayingUrl);

    var buttonsHTML = '';
    buttonsHTML += '<button id="all-genres" class="btn btn-default">All Genres</button>';
    for(let i = 0; i < genreArray.length; i++){
        buttonsHTML += `<button class="btn btn-default genre-button">${genreArray[i].name}</button>`;
    }
    $('#genre-buttons').html(buttonsHTML);

    // Make AJAX request to the nowPlayingUrl
    $.getJSON(nowPlayingUrl,(nowPlayingData)=>{
        // console.log(nowPlayingData);
        var nowPlayingHTML = getHTML(nowPlayingData);
        $('#movie-grid').html(nowPlayingHTML);
        getModalOnClick();
        $grid = $('#movie-grid').isotope({
            itemSelector: '.movie-poster'
        });
        $('#all-genres').click(function(){
            $grid.isotope({ filter: ''});
        });
        $('.genre-button').click(function(){
            // console.dir(this.innerText);
            $grid.isotope({filter: '.' + this.innerText})
        });
    });


    $('#movie-form').submit((event)=>{
        event.preventDefault(); // Don't submit form! JS will handle
        var userInput = $('#search-input').val();
        $('#search-input').val('');
        var safeUserInput = encodeURI(userInput);
        var searchUrl = apiBaseUrl + '/search/movie?query=' + safeUserInput + '&api_key=' + apiKey;
        console.log(searchUrl);
        $.getJSON(searchUrl,(searchMovieData)=>{
            var searchMovieHTML = getHTML(searchMovieData);
            $('#movie-grid').html(searchMovieHTML);
            getModalOnClick();
        });
        $('.movie-search').html('<h2>Movie search for: ' + userInput + '</h2>');
    });

    function getHTML(data){
        var newHTML = '';
        for(let i = 0; i < data.results.length; i++){

            // Set up a var for the genre ids for THIS movie
            var thisMovieGenres = data.results[i].genre_ids;
            var movieGenreClassList = " ";

            // Loop through all known genres
            for (let j = 0; j < genreArray.length; j++){
                // The genre that we are on (genreArray[j]), check to see
                // if it is in THIS movies genres id list
                if(thisMovieGenres.indexOf(genreArray[j].id) > -1){
                    // HIT! This genre_id is in THIS movie's genre id list
                    // So we need to add the name to the class list
                    movieGenreClassList += genreArray[j].name + " ";
                }
                // console.log(genreArray[j].id);
            }

            // console.log(movieGenreClassList);

            var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
            newHTML += '<div class="movie-poster-div col-xs-6 col-sm-4 col-md-3 col-lg-2 movie-poster '+movieGenreClassList+'"" movie-id='+ data.results[i].id + '>';
                newHTML += `<img src="${posterUrl}">`;
            newHTML += '</div>';
        }
        return newHTML;
    }

    function getModalOnClick(){
        $('.movie-poster').click(function(){
            // Change the HTML inside the modal
            var thisMovieId = $(this).attr('movie-id');
            console.log(thisMovieId);
            var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
            $.getJSON(thisMovieUrl,(thisMovieData)=>{
                console.log(thisMovieData);
                $('#myModalLabel').html(thisMovieData.title);
                var newMovieHTML = '';
                    newMovieHTML += '<div class="modal-details">';
                        newMovieHTML += '<h3>Overview</h3>';
                        newMovieHTML += thisMovieData.overview;
                    newMovieHTML += '</div>';
                    newMovieHTML += '<div class="modal-details">';
                        newMovieHTML += '<h3>Release Date</h3>';
                        newMovieHTML += thisMovieData.release_date;
                    newMovieHTML += '</div>';
                    newMovieHTML += '<div class="modal-details">';
                        newMovieHTML += '<h3>Rating</h3>';
                        newMovieHTML += Math.round(thisMovieData.popularity) + '%';
                    newMovieHTML += '</div>';
                    newMovieHTML += '<div class="modal-details">';
                        newMovieHTML += '<h3>Runtime</h3>';
                        newMovieHTML += thisMovieData.runtime + ' minutes';
                    newMovieHTML += '</div>';
                    newMovieHTML += '<div class="modal-details">';
                        newMovieHTML += '<h3>Homepage</h3>';
                        newMovieHTML += '<a href="' + thisMovieData.homepage + '" target="_blank">' + thisMovieData.homepage + '</a>';
                    newMovieHTML += '</div>';
                $('.modal-body').html(newMovieHTML);
                // Then open the modal
                $('#myModal').modal();
            });
        });
    }

});