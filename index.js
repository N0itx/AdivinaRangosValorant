$(document).ready(function () {
  // Lista de videos con sus rangos correspondientes

  const jsonUrl = 'https://pastebin.com/raw/w4HqP9bX';
  var videosInfo = null;

  async function loadJson() {
    try {
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo JSON');
      }
      videosInfo = await response.json();
      mostrarVideo();
    } catch (error) {
      console.error('Error al cargar el JSON:', error);
    }
  }

  // Variables para llevar el registro de los puntos y el video actual
  var puntos = 0;
  var videoActual = null;
  var checkcolor = '';

  // Función para mostrar un video aleatorio y sus opciones de rango
  function mostrarVideo() {
    // Seleccionar un video aleatorio de la lista
    var videosNoVistos = videosInfo.filter(function (video) {
      return !video.visto;
    });
    if (videosNoVistos.length === 0) {
      $('body').append(`<div class="final-box"><h1>ESOS FUERON TODOS LOS CLIPS <p>TOTAL: ${puntos}/${videosInfo.length}</p> </h1><img src="sources/baile.webp"></div>`)
      return;
    }
    var videoIndex = Math.floor(Math.random() * videosNoVistos.length);
    var video = videosNoVistos[videoIndex];

    // Mostrar el video en el contenedor correspondiente / se usa jquerry solo para test
    // $("#video").append(`<iframe src="https://www.youtube.com/embed/${video.src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share" allowfullscreen></iframe>`)
    var videoContainer = $("#video");
    videoContainer.html(
      `<iframe src="https://www.youtube.com/embed/${video.src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share" allowfullscreen></iframe>`
    );

    // Crear las opciones de rango
    var optionsContainer = $("#rangos");
    optionsContainer.empty();
    var rangos = ["Hierro", "Bronce", "Plata", "Oro", "Platino", "Diamante", "Ascendente", "Inmortal", "Radiante"];
    for (var i = 0; i < rangos.length; i++) {
      var option = $("<div>").addClass("option-rank").attr("data-rango", rangos[i]);
      // var optionImg = $("<img>").attr("src", "rangos/rank_" + (i+1) + ".png");
      var optionImg = $("<img>").attr("src", `rangos/${rangos[i]}.png`);
      option.append(optionImg);
      optionsContainer.append(option);
    }

    // Actualizar la variable de video actual
    videoActual = video;

    // Quitar la clase "selected" de las opciones al hacer clic en ellas
    optionsContainer.children().click(function () {
      optionsContainer.children().removeClass("selected");
      $(this).addClass("selected");
    });

    $('#check-answer-btn').show('slow');
    $('#check-container-next').hide('fast');

    // $('.info-pfp img').attr('src', video.profile);
    // let nombreUwu = video.user.split('#')
    // $('.info-user').html(`${nombreUwu[0]}<i>#${nombreUwu[1]}</i>`);

    // Actualizar las barras de estadísticas
    let totalGames = video.win + video.lose;
    $('#wins').css('width', calculateBarWidth(video.win, totalGames))
    $('#loses').css('width', calculateBarWidth(video.lose, totalGames))
    $('#headshot').css('width', calculateBarWidth(video.headshot, 100))
    $('#kd').css('width', calculateBarWidth(video.kd, 5))
    $('#kround').css('width', calculateBarWidth(video.kround, 5))
    $('#horas').css('width', calculateBarWidth(video.horas, 2000))
    for (let i = 0; i < 3; i++) {
      $('#agentes-'+i).attr('src', `./personajes/${video.agentes[i]}.png`)
    }

    $('.winrate-num').html(`W: ${video.win}  |  L: ${video.lose}`)
    $('.headshot-num').text(`${video.headshot}%`)
    $('.kd-num').text(video.kd)
    $('.kround-num').text(video.kround)
    $('.horas-num').text(video.horas)
  }

  // Función para comprobar si la opción seleccionada es la correcta
  function comprobarPuntuacion() {
    var selectedOption = $("#rangos").find(".selected");
    if (selectedOption.length > 0) {
      var rangoSeleccionado = selectedOption.attr("data-rango");
      if (rangoSeleccionado === videoActual.rango) {
        puntos++;
        checkcolor = 'acierto';
      } else {
        checkcolor = 'fallo';
      }
      generarResultado(videoActual, rangoSeleccionado, checkcolor, puntos);
      videoActual.visto = true;
    } else {
      alert("Por favor selecciona un rango antes de puntuar.");
    }
  }

  // Al hacer clic en el botón de puntuar, comprobar la puntuación
  $("#check-answer-btn").click(function () {
    comprobarPuntuacion();
  });
  $("#check-container-next").click(function () {
    mostrarVideo();
  });

  // Muestra la pantalla de resultado
  function generarResultado(info, rngslec, check, puntos) {
    let nombreUwu = info.user.split('#')
    $('body').append(`
        <div class="resultado-box bg-negro"></div>
        <div class="resultado-container">
          <div class="player-info">
            <div class="info-pfp"><img src="${info.profile}" alt=""></div>
            <div class="info-user">${nombreUwu[0]}<i>#${nombreUwu[1]}</i></div>
          </div>
		      <div class="resultado-titulo">RESULTADOS</div>
          <button class="resultado-close">X</button>
		      <div class="resultado-adivinado">
			      <p>ELEGISTE</p>
			      <img src="./rangos/${rngslec}.png" alt="">
		      </div>
		      <div class="resultado-correcto">
		      	<p>RANGO</p>
		      	<img src="./rangos/${info.rango}.png" alt="">
		      </div>
		      <div class="resultado-peak">
		      	<p>PEAK</p>
		      	<img src="./rangos/${info.peak}.png" alt="">
		      </div>
		      <div class="resultado-bott">
			      <button id="siguiente-clip" class="b-rojo">SIGUIENTE</button>
		      </div>
	      </div>
      `)
    $('#siguiente-clip').click(function () {
      mostrarVideo();
      $('.resultado-container, .resultado-box').fadeOut('slow', function () {
        $(this).remove();
      });
    });
    $('.resultado-close').click(function () {
      $('.resultado-container, .resultado-box').fadeOut('slow', function () {
        $(this).remove();
        $('#check-answer-btn').hide('fast');
        $('#check-container-next').show('fast');
      });
    });
  }

  // Mostrar el primer video al cargar la página
  // mostrarVideo();
  loadJson();

  // Función para calcular el ancho de la barra en porcentaje
  function calculateBarWidth(value, max) {
    return (value / max) * 100 + '%';
  }

});
