

$(document).ready(function(){

    var resultField = $('#result-field');
    var weatherField = $('#weather-field');

    $('.search-bar').on('submit', 'form', function(event){
        event.preventDefault();

        var bar = $('.search-bar');
        var form = bar.find('form');
        var button = form.find('button');
        var query = form.find('input').val();       

        $.ajax({
            method: 'get',
            url: 'http://autocomplete.wunderground.com/aq?query=' + query,
            dataType: 'jsonp',
            jsonp: 'cb',
            beforeSend: function(){
                button.addClass('is-loading');
                resultField.find('div').remove();
            },
            complete: function(){
                button.removeClass('is-loading');
            },
            success: function(data){
                renderSearchResult(data);
            },
            error: function(error){

            }
        });

    });

    function renderSearchResult(data){
        var html = '<div>';
        data.RESULTS.forEach(function(result){
            if (result.type == 'city'){
                var thisHtml = '<div>' + result.name + '</div>';
                html += thisHtml;
            }
        });

        var results = $(html);
        weatherField.hide();
        resultField.append(results);
        resultField.show();
    }

});