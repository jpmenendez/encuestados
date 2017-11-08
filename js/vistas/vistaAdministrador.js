/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEliminada.suscribir(function(){
    contexto.reconstruirLista();
  });
  this.modelo.preguntasDescargadas.suscribir(function(){
    contexto.reconstruirLista();
  });
  this.modelo.nombrePreguntaEditado.suscribir(function(){
    contexto.reconstruirLista();
  });
  this.modelo.todasLasPreguntasEliminadas.suscribir(function(){
    contexto.reconstruirLista();
  })
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.configuracionDeBotones();
    this.reconstruirLista();
    this.descargarPreguntas();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem;
    var nuevoItem = $("<li class='list-group-item' id='" + pregunta.id + "'></li>");
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  //descarga las preguntas de LocalStorage
  descargarPreguntas: function(){
    this.controlador.descargarPreguntasLocal();
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    // asociacion de eventos a boton
    // agrega un elemento respuesta
    e.botonAgregarRespuesta.click(function(){
      var nuevaRespuesta = "<div class='form-group answer'>" +
                            "<input class='form-control' type='text' name='option[]' />" +
                            "<button type='button' class='btn btn-default botonBorrarRespuesta' name='borrarRespuesta'><i class='fa fa-minus'></i></button>" +
                          "</div>"
      $(nuevaRespuesta).insertBefore(e.botonAgregarRespuesta);
    });

    // agregar pregunta
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function() {
        //completar
        var textoRespuesta = $(this).val();
        respuestas.push(textoRespuesta);
      });
      contexto.controlador.agregarPregunta(value, respuestas);

    });

    // editar pregunta
    e.botonEditarPregunta.click(function(){
      var nuevoNombre = prompt("Ingrese nuevo nombre de pregunta");
      if (nuevoNombre != null) {
        var $id = $('.list-group-item.active').attr('id');
        contexto.controlador.editarNombrePregunta($id,nuevoNombre);
      }

    });

    //eliminar pregunta
    e.botonBorrarPregunta.click(function(){
      respuesta = window.confirm("¿Está seguro que desea borrar pregunta?");
      if (respuesta) {
        var $id = $('.list-group-item.active').attr('id');
        contexto.controlador.eliminarPregunta($id);
      }
    });

    // borrar todas las preguntas
    e.borrarTodo.click(function(){
      respuesta = window.confirm("¿Está seguro que desea borrar todas las preguntas?");
      if(respuesta){
        contexto.controlador.eliminarTodasLasPreguntas();
      }
    })

    //quita un elemento respuesta
    $('body').on("click",'[name="borrarRespuesta"]',function(){
      $(this).parent('.form-group.answer').remove();
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
}
