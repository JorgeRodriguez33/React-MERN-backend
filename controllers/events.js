// Importamos 'response' desde express, que se utiliza para tipificar la respuesta que enviaremos
const { response } = require('express');

// Importamos el modelo 'Evento', que representa la colección de eventos en la base de datos
const Evento = require('../models/Evento');

// Definimos una función asíncrona llamada 'getEventos' para manejar solicitudes de obtener eventos
const getEventos = async( req, res = response ) => {

    // Usamos el modelo 'Evento' para buscar todos los documentos (eventos) en la colección de la base de datos
    const eventos = await Evento.find()
                                // Con 'populate', sustituimos el campo 'user' por los 
                                // datos del usuario relacionado
                                // y especificamos que solo queremos obtener el campo 'name' del usuario
                                .populate('user', 'name'); // Reemplaza el campo 'user' en el evento con un objeto reducido que solo contiene el campo 'name' del usuario relacionado.
                                                           // SI quisiera mas datos del user, es agregar mas  atributos por ejemplo  .populate('user', 'name password')  

    // Enviamos una respuesta en formato JSON con un estado de éxito y los eventos encontrados
    res.json({
        ok: true, // Indicamos que la operación fue exitosa
        eventos  // Incluimos los eventos recuperados en la respuesta
    });
}

// Función asíncrona para crear un evento en la base de datos
const crearEvento = async ( req, res = response ) => {

    // Creamos una nueva instancia del modelo 'Evento' usando los datos enviados en el cuerpo de la solicitud (req.body)
    const evento = new Evento( req.body );

    try {

        // El campo 'user' del evento se asigna con el 'uid' (ID del usuario) que fue añadido al request (req)
        // Este 'uid' proviene del middleware de validación del JWT (validarJWT), donde se extrae del token.
        evento.user = req.uid;
        
        // Guardamos el evento en la base de datos usando el método .save() de Mongoose
        const eventoGuardado = await evento.save();

        // Enviamos una respuesta JSON indicando que la operación fue exitosa
        res.json({
            ok: true, // Indicamos que todo salió bien
            evento: eventoGuardado // Devolvemos el evento recién guardado
        });

    } catch (error) {
        // Si ocurre un error, lo mostramos en la consola para depuración
        console.log(error);
        
        // Enviamos una respuesta con un código de estado 500 (error interno del servidor)
        res.status(500).json({
            ok: false, // Indicamos que hubo un error
            msg: 'Hable con el administrador' // Mensaje genérico para el cliente
        });
    }
}

// Función asíncrona para actualizar un evento existente en la base de datos
const actualizarEvento = async( req, res = response ) => {
    
    // Obtenemos el ID del evento desde los parámetros de la URL (req.params)
    const eventoId = req.params.id;

    // Obtenemos el ID del usuario (uid) que fue añadido al request por el middleware validarJWT
    const uid = req.uid;

    try {

        // Intentamos buscar el evento en la base de datos por su ID
        const evento = await Evento.findById( eventoId );

        // Validamos si el evento existe. Si no lo encontramos:
        if ( !evento ) {
            return res.status(404).json({ // Respondemos con un error 404 (no encontrado)
                ok: false,
                msg: 'Evento no existe por ese id' // Mensaje indicando que el evento no se encontró
            });
        }

        // Validamos que el usuario actual sea el creador del evento
        // `evento.user` es un ObjectId (referencia al usuario que creó el evento) almacenado en la base de datos.
        // Lo convertimos a string usando `.toString()` para compararlo con `uid`, que es el ID del usuario autenticado.
        // Si los IDs no coinciden, significa que el usuario actual no es el creador del evento
        // y, por lo tanto, no tiene permiso para editarlo.
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({ // Si no es el creador, respondemos con un error 401 (no autorizado)
                ok: false,
                msg: 'No tiene privilegio de editar este evento' // Mensaje indicando que no tiene permiso
            });
        }

        // Creamos un nuevo objeto con los datos actualizados del evento
        const nuevoEvento = {
            ...req.body, // Copiamos todos los datos que vienen en el cuerpo de la solicitud
            user: uid    // Reasignamos el campo user con el ID del usuario actual (por seguridad)
        }

        // Actualizamos el evento en la base de datos usando su ID
        // El tercer argumento `{ new: true }` asegura que se devuelva el evento ya actualizado, si fuera false o no estuviera, devuelve el viejo objeto
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        // Enviamos la respuesta con el evento actualizado
        res.json({
            ok: true, // Indicamos que la operación fue exitosa
            evento: eventoActualizado // Incluimos el evento actualizado en la respuesta
        });

    } catch (error) {
        // Capturamos errores inesperados y los mostramos en la consola
        console.log(error);
        
        // Enviamos una respuesta con error 500 (error interno del servidor) y un mensaje genérico
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


const eliminarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }


        await Evento.findByIdAndDelete( eventoId );

        res.json({ ok: true });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}