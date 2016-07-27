$(document).ready(function(){

    const QUERY_PREFIX = 'http://api.wunderground.com/api/68f45e5f84fe8ad4/conditions/q/';

    var resultField = $('#result-field');
    var weatherField = $('#weather-field');

    // Init the weather of current ip
    // $.ajax({
    //     method: 'get',
    //     url: QUERY_PREFIX + 'autoip.json',
    //     dataType: 'jsonp',
    //     success: function(data){
    //         renderWeather(data);
    //     }
    // });


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
        console.log(url);

        $.ajax({
            method: 'get',
            url: url,
            dataType: 'jsonp',
            beforeSend: function(){
                resultField.hide();
                cleanWeatherField();
                weatherField.show();
            },
            success: function(data){
                renderWeather(data);
            }
        })
    });

    function cleanWeatherField(){
        weatherField.find('img').attr('src', '');
        weatherField.find('#city').text('');
        weatherField.find('#weather').html('');
    }

    function renderSearchResult(data){
        // var html = '<div>';
        // data.RESULTS.forEach(function(result){
        //     if (result.type == 'city'){
        //         var ll = result.ll;
        //         ll = ll.replace(' ', ',');
        //         var thisHtml = '<div><span class="city-cell" data-ll="' + ll + 
        //             '">' + result.name + '</span></div>';
        //         html += thisHtml;
        //     }
        // });

        var source = $('#result-template').html();
        var template = Handlebars.compile(source);
        var html = template(data);
        // var results = $(html);
        weatherField.hide();
        resultField.append(html);
        resultField.show();
    }

    function renderWeather(data){
        var ob = data.current_observation
        var city = ob.display_location.full;
        var weatherHtml = 'Weather: ' + ob.weather + '<br>' +
            'Temperature: ' + ob.temperature_string + '<br>' +
            'Feels Like: ' + ob.feelslike_string + '<br>' +
            'Relative Humidity: ' + ob.relative_humidity + '<br>' +
            'Solar Radiation: ' + ob.solarradiation;

        weatherField.find('img').attr('src', ob.icon_url);
        weatherField.find('#city').text(city);
        weatherField.find('#weather').html(weatherHtml);
    }

});