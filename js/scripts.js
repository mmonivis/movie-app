// Wait til the DOM is loaded
$(document).ready(function(){

    // All api calls go to this link
    const apiBaseUrl = 'http://api.themoviedb.org/3';
    // All images use this link
    const imageBaseUrl = 'http://image.tmdb.org/t/p/';

    const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key=' + apiKey;
    // console.log(nowPlayingUrl);

    // Make AJAX request to the nowPlayingUrl
    $.getJSON(nowPlayingUrl,(nowPlayingData)=>{
        // console.log(nowPlayingData);
        var nowPlayingHTML = getHTML(nowPlayingData);
        $('#movie-grid').html(nowPlayingHTML);
        $('.movie-poster').click(function(){
            // Change the HTML inside the modal
            var thisMovieId = $(this).attr('movie-id');
            console.log(thisMovieId);
            var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
            $.getJSON(thisMovieUrl,(thisMovieData)=>{
                console.log(thisMovieData);
                $('#myModalLabel').html(thisMovieData.title);
                $('.modal-body').html('<h3>Overview</h3><br />' + thisMovieData.overview);
                // Then open the modal

                $('#myModal').modal();
            });
        });
    });

    $('#movie-form').submit((event)=>{
        event.preventDefault(); // Stop browser from submitting because we're gonna handle it
        var userInput = $('#search-input').val();
        $('#search-input').val('');
        var safeUserInput = encodeURI(userInput);
        var searchUrl = apiBaseUrl + '/search/movie?query=' + safeUserInput + '&api_key=' + apiKey;
        console.log(searchUrl);
        $.getJSON(searchUrl,(searchMovieData)=>{
            var searchMovieHTML = getHTML(searchMovieData);
            $('#movie-grid').html(searchMovieHTML);
        });
    });

    function getHTML(data){
        var newHTML = '';
        for(let i = 0; i < data.results.length; i++){
            var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
            newHTML += '<div class="col-sm-6 col-md-3 movie-poster" movie-id='+ data.results[i].id + '>';
                newHTML += `<img src="${posterUrl}">`;
            newHTML += '</div>';
        }
        return newHTML;
    }
});