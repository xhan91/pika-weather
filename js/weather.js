$(document).ready(function(){

    const QUERY_PREFIX = 'http://api.wunderground.com/api/68f45e5f84fe8ad4/conditions/q/';

    var resultField = $('#result-field');
    var weatherField = $('#weather-field');

    // Init the weather of current ip
    $.ajax({
        method: 'get',
        url: QUERY_PREFIX + 'autoip.json',
        dataType: 'jsonp',
        success: function(data){
            renderWeather(data);
        }
    });


    // Search for a list of related cities
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

    // Click a search reasult to go to that city
    resultField.on('click', '.city-cell', function(){
        var query = $(this).data('ll').replace(' ',',') + '.json';
        var url = QUERY_PREFIX + query;

        $.ajax({
            method: 'get',
            url: url,
            dataType: 'jsonp',
            beforeSend: function(){
                resultField.hide();
                weatherField.find('div').remove();
                weatherField.show();
            },
            success: function(data){
                renderWeather(data);
            }
        })
    });

    function renderSearchResult(data){
        var source = $('#result-template').html();
        var template = Handlebars.compile(source);

        data.RESULTS.forEach(function(result){
            if (result.type == 'city'){
                var html = template(result);
                resultField.append(html);
            }
        });
        weatherField.hide();
        resultField.show();
    }

    function renderWeather(data){
        var source = $('#weather-template').html();
        var template = Handlebars.compile(source);
        var html = template(data.current_observation);

        weatherField.append(html);
    }

});