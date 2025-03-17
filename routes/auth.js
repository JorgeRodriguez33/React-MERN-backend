/* 
    Rutas de Usuarios / Auth
    host + /api/auth

*/

const express = require("express"); //esta bien cargar express aqui y en cada rchivo, express es eficiente y no carga varias veces lass  librerias
const {check} = require("express-validator"); //el "check" es el middleware se va a encargar de validar un campo en particular, lo hara 1 a la vez

const {validarCampos} = require("../middlewares/validar-campos")
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/auth");
const { validarJWT } = require('../middlewares/validar-jwt');

const router = express.Router();


// tambien se podia hacer "  const {Router} = require("express")  "  y  "  const router = Router();  "

//en lugar de usar "app" se usa "router"
router.get("/", (req, response) => {
  //entonces el llamado de este endpoint es "localhost:4000/api/auth" seguido de "/" , que es lo que se concatena en el get "router.get('/',(req,response) =>{"
  console.log("Se requiere el /");

  //debo definir una respuesta
  response.json({
    ok: true,
    msg: "get",
  });
});


/* Voy aplicar el "npm i express-validator" para validar informacion, "npm i express-validator" esta compuesto
por varios midlewares, recordar que un midleware es una funcion que se ejecuta antes que otra, es por eso que 
en el llamado del endpoint se pone en el medio el mideware, que sera mas de uno por eso se pone un array 
primero se ejecuta cada uno de los midleware del array uno por uno y al final ejecuta "crearUsuario"*/
router.post(
  "/new", 
  [ //middlewares
    check("name","El nombre es obligatorio").not().isEmpty(), //se fija que llegue por el body el atributo "name", sino da el error
    check("email","El email es obligatorio").isEmail(), //valida si es un email
    check("password","El password es obligatorio que cuenta con 6 cracteres").isLength({min:6}),
    validarCampos //implemento el middleware personalizado
  ] ,
  crearUsuario);

router.post(
  "/",
  [ //middlewares
    check("email","El email es obligatorio").isEmail(), //valida si es un email
    check("password","El password es obligatorio que cuenta con 6 cracteres").isLength({min:6}),
    validarCampos //implemento el middleware personalizado
  ] ,
   loginUsuario);

router.get("/renew", validarJWT ,revalidarToken);

//para habiliar que la ruta existe y esta configurada ... , y se implemente cuando se use ese midleware
module.exports = router;
