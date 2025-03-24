const express = require("express");
// Importa el paquete bcryptjs, que se utiliza para encriptar contraseñas
// de forma segura antes de almacenarlas en la base de datos.
const bcrypt = require("bcryptjs");
//const {validationResult} = require("express-validator");//validationResult es un middleware, para obtener los errores
const Usuario = require("../models/Usuario");
const { generarJWT } = require('../helpers/jwt');
/* 
Informacion de la base de datos mongodb atlas
dbuser : MERN_USER

pass : j1jMC4lUQxzVdXrU

*/

/* 

para agregar inteligens a la clase controller, 
para que me sugiera que poner es necesaario declarar 
const express = require('express')

const crearUsuario = (req,response = express.response) =>{ 
    .....

******************************************************************
    otra forma seria ..

   const {response} = require('express')

   const crearUsuario = (req,response = response) =>{ 
......


*/

const crearUsuario = async (req, response = express.response) => {
  const { name, email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email }); // esto es lo mismo que poner "findOne({ email:email }); "

    if (usuario) {
      return response.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    //mongoose ya sabe que estructura va a tener, que valores son validos, que tipos y si son o no obligatorios
    usuario = new Usuario(req.body); // le paso los campos desde el body a mongoose para que cree el usuario

    // Encriptar contraseña
    // Genera un "salt" aleatorio.
    // Si no especificas el número de "vueltas" (o rounds), bcrypt usará 10 por defecto.
    const salt = bcrypt.genSaltSync();
    /* 
    Un salt es una cadena de caracteres aleatorios que se usa para "aderezar" (de ahí el nombre "sal" en inglés) 
    la contraseña antes de encriptarla. 
    Su propósito es hacer que las contraseñas sean únicas, incluso si dos usuarios tienen la misma contraseña
    
    Las "vueltas" son la cantidad de veces que bcrypt aplica un algoritmo para fortalecer el salt. 
    En términos simples, más vueltas = más seguridad, pero también más lento el proceso de encriptación.
    */
    // Encripta la contraseña usando el "salt" generado.
    //Esta función combina la contraseña original (password) con el salt y luego las encripta.
    // El resultado es una contraseña encriptada que es extremadamente difícil de descifrar
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save(); //Guardo en base de datos

    // Generar JWT
    const token = await generarJWT( usuario.id, usuario.name );

    response.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }

  //manejo de errores , aqui se procesan los errores que captura el midleware "check" de auth.js
  /*   const errores = validationResult(req) //validationResult para obtener los errores
  if(!errores.isEmpty()){
    return response.status(400).json({
      ok:false,
      errores: errores.mapped() //mapped para serializarlos en un objeto sencillo de trabajar
    })
  } */

  //para devolver el codigo de error se pone "response.status(400)"
  /* if(name.length < 5){
    return response.status(400).json({
        ok: false,
        msg: "El nombre debe ser de 5 letras al menos",
    })
} */

  //debo definir una respuesta
  /*   response.status(201).json({
    ok: true,
    msg: "registro",
    name,
    email,
    password,
  }); */
};

// Definimos una función asíncrona para manejar el login del usuario.
// `req` (request) contiene la información enviada por el cliente, como el email y la contraseña.
// `response` es el objeto que usamos para enviar la respuesta al cliente.
const loginUsuario = async(req, response = express.response) => {
  // Extraemos el email y la contraseña del cuerpo de la solicitud (req.body).
  const { email, password } = req.body;

  try {
    // Buscamos en la base de datos un usuario que coincida con el email proporcionado.
    const usuario = await Usuario.findOne({ email });

    // Si no se encuentra un usuario con ese email, devolvemos una respuesta con un error.
    if (!usuario) {
      return response.status(400).json({
        ok: false, // Indicamos que la operación no fue exitosa.
        msg: 'El usuario no existe con ese email' // Mensaje explicativo.
      });
    }

    // Validamos si la contraseña ingresada es correcta.
    // bcrypt.compareSync() compara la contraseña enviada por el cliente (`password`) con la
    // contraseña encriptada almacenada en la base de datos (`usuario.password`).
    const validPassword = bcrypt.compareSync(password, usuario.password);

    // Si la contraseña no es válida, enviamos un error indicando que es incorrecta.
    if (!validPassword) {
      return response.status(400).json({
        ok: false,
        msg: 'Password incorrecto' // Mensaje explicativo en caso de error.
      });
    }

    // Si el email y la contraseña son válidos, generamos un token JWT (JSON Web Token).
    // Este token se utiliza para autenticar al usuario en futuras solicitudes.
    const token = await generarJWT(usuario.id, usuario.name);

    // Respondemos al cliente indicando que el login fue exitoso.
    // Incluimos la información del usuario y el token generado.
    response.json({
      ok: true, // La operación fue exitosa.
      uid: usuario.id, // Identificador único del usuario.
      name: usuario.name, // Nombre del usuario.
      token // Token de autenticación.
    });

  } catch (error) {
    // Capturamos cualquier error que ocurra en el proceso y lo mostramos en la consola (útil para depuración).
    console.log(error);

    // Respondemos al cliente con un mensaje genérico en caso de error interno.
    response.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador' // Mensaje en caso de error del servidor.
    });
  }








  /* .............
  Para no repetir codigo, se crea un midleware personalizado, para que cada vez que se usa el "check"
  no se tenga que estar duplicando el codigo de abajo 
  ...........*/
  /*  const errores = validationResult(req) //validationResult para obtener los errores
  if(!errores.isEmpty()){
    return response.status(400).json({
      ok:false,
      errores: errores.mapped() //mapped para serializarlos en un objeto sencillo de trabajar
    })
  } */

  //debo definir una respuesta
/*   response.json({
    ok: true,
    msg: "login",
    email,
    password,
  }); */
};

// Controlador para revalidar un token JWT
// Este controlador genera un nuevo token JWT basado en la información del usuario que está incluida en la solicitud (req).
const revalidarToken = async(req, response = express.response) => {
  
  // Extraemos el UID (identificador único) y el nombre del usuario de la solicitud
  // Estos valores se espera que se hayan agregado previamente por algún middleware, como validarJWT.
  const { uid, name } = req;

  // Generar un nuevo token JWT utilizando una función auxiliar (generarJWT)
  // Esta función probablemente toma el UID y el nombre del usuario y devuelve un token firmado.
  const token = await generarJWT( uid, name );

  // Enviamos una respuesta al cliente en formato JSON
  // La respuesta incluye un indicador de éxito (ok: true) y el nuevo token generado.
  response.json({
      ok: true,  // Indica que la operación fue exitosa
      uid, name,
      token      // Devuelve el nuevo token JWT al cliente
  });
};


//Para exportar todas las operaciones que hay en auth.js
// se exportaria como {crearUsuario:crearUsuario} lo que es reduntante,
//  por lo que se pone {crearUsuario}
module.exports = { crearUsuario, loginUsuario, revalidarToken };
