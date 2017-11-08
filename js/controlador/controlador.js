/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },
  eliminarPregunta: function(id){
    this.modelo.eliminarPregunta(id);
  },
  descargarPreguntasLocal: function(){
    this.modelo.descargarPreguntasLocal();
  },
  agregarVoto: function(preguntaId, respuesta){
    this.modelo.agregarVoto(preguntaId, respuesta);
  },
  editarNombrePregunta: function(id, nuevoNombre){
    this.modelo.editarNombrePregunta(id, nuevoNombre);
  },
  eliminarTodasLasPreguntas(){
    this.modelo.eliminarTodasLasPreguntas();
  }
};
