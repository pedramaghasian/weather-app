$(document).ready(function () {
  let coutries = $('#country');
  let coutryUrl = 'https://restcountries.eu/rest/v2/all';

  $.getJSON(coutryUrl, {
    format: 'json',
  })
    .done(function (data) {
      fetchingCountryName(data);

      coutries.change(function () {
        let seletedOption = $(this).find(':selected').text();
        fetchingDataForSectoinLeft(data, seletedOption);
        fetchWeatherDataAndFill(data, seletedOption);
      });
    })
    .fail(function () {
      console.log('cant get countries !');
    });

  //***********************************FUNCTIONS**************************************************
  function makeWeatherUrl(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4b9a60c82dbcf02b84fb1d455c0e4258`;
  }

  function getIconUrl(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  //fetching country function for selcet on the navbar
  function fetchingCountryName(data) {
    $.each(data, function (index, item) {
      let option = $('<option>').attr('value', item.name).text(item.name);
      $(option).appendTo(coutries);
    });
  }

  //fetching data and filling the section 1 -left
  function fetchingDataForSectoinLeft(data, seletedOption) {
    $('#country-name').text(seletedOption).prependTo('#c-info');
    let a = $.grep(data, function (item) {
      return item.name === seletedOption;
    });

    $('#native-name span').empty().append(a[0].nativeName);
    $('#capital span').empty().append(a[0].capital);
    $('#region span')
      .empty()
      .text(a[0].region + ', ' + a[0].subregion);
    $('#population span').empty().append(a[0].population);
    $('#languages span')
      .empty()
      .text(a[0].languages[0].name + ', ' + a[0].languages[0].nativeName);
    $('#timezone span').empty().append(a[0].timezones[0]);
    $('#calling-code ').siblings('p').empty().append(a[0].callingCodes[0]);
    $('#flag')
      .empty()
      .attr({ src: `${a[0].flag}`, alt: a[0].capital });
  }
  //fetch data from Weather API and Fill the weather report field
  function fetchWeatherDataAndFill(data, seletedOption) {
    let latlang = data.find(function (item) {
      return item.name === seletedOption;
    });
    let lat = latlang.latlng[0];
    let lon = latlang.latlng[1];
    $.getJSON(makeWeatherUrl(lat, lon), {
      format: 'json',
    })
      .done(function (weather) {
        $('#description ').empty().append(weather.weather[0].description);
        $('#wind-speed ').empty().append(weather.wind.speed);
        $('#temprature ').empty().append(`${weather.main.temp} K`);
        $('#humidity').empty().append(weather.main.humidity);
        $('#visibility').empty().append(weather.visibility);
        $('#img-cloudes')
          .empty()
          .attr('src', getIconUrl(weather.weather[0].icon));
        mapGenerator(lat, lon);
      })
      .fail(function () {
        console.log('cant get weater !');
      });
  }

  function mapGenerator(lat, lon) {
    mapboxgl.accessToken =
      'pk.eyJ1IjoicGVkcmFtLTAwNyIsImEiOiJja2dub3Ixa3AwOWF0Mzdtc3FzemhidXV5In0.EcM71qE8U3yKfIAkd09DlQ';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lon, lat],
      zoom: 2,
    });

    var marker = new mapboxgl.Marker().setLngLat([lon, lat]).addTo(map);
    map.addControl(new mapboxgl.NavigationControl());
  }
  //end
});
