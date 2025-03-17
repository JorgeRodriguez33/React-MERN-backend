/* 
    Rutas de Eventos / Events
    host + /api/events

*/

const express = require("express"); 

const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {actualizarEvento,eliminarEvento,getEventos,crearEvento} = require('../controllers/events')

const router = express.Router();

// Middleware global: Todas las rutas definidas DESPUÉS de esta línea en este router 
// deben pasar primero por la validación del JWT. 
// Las rutas definidas arriba de esta línea no estarán afectadas por esta validación.
router.use(validarJWT);

router.get('/',getEventos);

// Crear un nuevo evento
router.post(
    '/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento 
);

// Actualizar Evento
router.put(
    '/:id', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento 
);

// Borrar evento
router.delete('/:id', eliminarEvento );


module.exports = router;

