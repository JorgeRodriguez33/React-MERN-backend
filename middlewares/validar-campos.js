const {response} = require("express");
const {validationResult} = require("express-validator");


// "next" es una funcion que se debe llamar si todo este middleware se ejecuta correctamente
//el next hace que se pase al siguinte middleware (es el que se va a encargar de que se ejecuten 
// los middleware del array uno detras de otro)
const validarCampos = (req, res = response, next)=>{

    const errores = validationResult(req) //validationResult para obtener los errores
    if(!errores.isEmpty()){
      return res.status(400).json({
        ok:false,
        errores: errores.mapped() //mapped para serializarlos en un objeto sencillo de trabajar
      })
    }

    next();
}

module.exports = {validarCampos}
