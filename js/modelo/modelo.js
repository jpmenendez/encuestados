/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.preguntasDescargadas = new Evento(this);
  this.votoAgregado = new Evento(this);
  this.nombrePreguntaEditado = new Evento(this);
  this.todasLasPreguntasEliminadas = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    var maxId = -1;
    for(var i=0;i<this.preguntas.length;++i){
      if(this.preguntas[i].id > maxId)
        maxId = this.preguntas[i].id;
    }
    return maxId;
  },

  //crea el array de objetos de respuestas
  crearRespuesta: function(resp){
    var respuestas = [];
    for (var i = 0; i < resp.length; i++) {
      respuestas[i] = {'textoRespuesta': resp[i], 'cantidad': 0};
    }
    return respuestas;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    respuestas = this.crearRespuesta(respuestas);
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardarLocal(nuevaPregunta);
    this.preguntaAgregada.notificar();
  },

  //agrega un voto a una pregunta
  agregarVoto: function(preguntaId, respuesta){
    for (var i = 0; i < this.preguntas.length; i++) {
      if (this.preguntas[i].id == preguntaId) {
        for (var j = 0; j <   this.preguntas[i].cantidadPorRespuesta.length; j++) {
          if (this.preguntas[i].cantidadPorRespuesta[j].textoRespuesta == respuesta) {
            this.preguntas[i].cantidadPorRespuesta[j].cantidad += 1;
            this.guardarVotoLocal(preguntaId, respuesta);
            this.votoAgregado.notificar();
            return;
          }
        }
      }
    }
  },

  // edita el nombre de una pregunta
  editarNombrePregunta: function(id, nuevoNombre){
    for (var i = 0; i < this.preguntas.length; i++) {
      if (this.preguntas[i].id == id) {
          this.preguntas[i].textoPregunta = nuevoNombre;
          this.guardarLocal(this.preguntas[i]);
          this.nombrePreguntaEditado.notificar();
          return;
      }
    }
  },

  //se elimina una pregunta seleccionada dado un id
  eliminarPregunta: function(id){
    for (var i = 0; i < this.preguntas.length; i++) {
      if (this.preguntas[i].id == id) {
        this.preguntas.splice(i,1);
        this.eliminarLocal(id);
        this.preguntaEliminada.notificar();
        return;
      }
    }
  },

  // elimina todas las preguntas
  eliminarTodasLasPreguntas: function(){
    this.preguntas = [];
    this.eliminarTodasLasPreguntasLocal();
    this.todasLasPreguntasEliminadas.notificar();
  },

  //se guarda la pregunta en localStorage
  guardarLocal: function(nuevaPregunta){
    localStorage.setItem('pregunta' + nuevaPregunta.id, JSON.stringify(nuevaPregunta));
  },

  // guarda un  voto en LocalStorage
  guardarVotoLocal: function(preguntaId, respuesta){
    var pregunta = JSON.parse(localStorage.getItem('pregunta' + preguntaId));
    for (var i = 0; i < pregunta.cantidadPorRespuesta.length; i++) {
      if (pregunta.cantidadPorRespuesta[i].textoRespuesta == respuesta) {
        pregunta.cantidadPorRespuesta[i].cantidad += 1;
        this.guardarLocal(pregunta);
      }
    }

  },

  //se elimina la pregunta en localStorage
  eliminarLocal: function(id){
    localStorage.removeItem('pregunta' + id);
  },

  //elimina todas las preguntas en localStorage
  eliminarTodasLasPreguntasLocal: function(){
    localStorage.clear();
  },

  // descarga preguntas guardadas en localStorage y las pushea en this.preguntas[]
  descargarPreguntasLocal: function(){
    for (var a in localStorage) {
      this.preguntas.push(JSON.parse(localStorage[a]));
    }
    this.preguntasDescargadas.notificar();
  }
};
