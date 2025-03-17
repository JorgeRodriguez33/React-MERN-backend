// Importamos 'response' desde 'express' y 'jsonwebtoken' para trabajar con tokens JWT
const { response } = require('express');
const jwt = require('jsonwebtoken');

// Middleware para validar el JSON Web Token (JWT)
const validarJWT = ( req, res = response, next ) => {

 //**** */ Obtenemos el token desde los headers de la petición (header personalizado llamado 'x-token')***** Creado en POSTMAN
    const token = req.header('x-token');

    // Verificamos si el token está presente en los headers
    if ( !token ) {
        // Si no hay token, respondemos con un error 401 (No autorizado)
        return res.status(401).json({
            ok: false, // Indicador de fallo
            msg: 'No hay token en la petición' // Mensaje de error
        });
    }

    try {
        // Verificamos el token utilizando la llave secreta definida en las variables de entorno
        const { uid, name } = jwt.verify(
            token, // El token recibido
            process.env.SECRET_JWT_SEED // Clave secreta (asegurarte de configurarla correctamente en tus variables de entorno)
        );

        // Si el token es válido, añadimos el UID y el nombre del usuario a la request
        req.uid = uid;   // UID del usuario, extraído del token
        req.name = name; // Nombre del usuario, extraído del token

    } catch (error) {
        // Si ocurre un error durante la verificación del token, respondemos con un error 401
        return res.status(401).json({
            ok: false, // Indicador de fallo
            msg: 'Token no válido' // Mensaje de error
        });
    }

    // Llamamos al siguiente middleware o función si todo salió bien
    next();
}

// Exportamos la función para que pueda ser utilizada en otras partes de la aplicación
module.exports = {
    validarJWT
}
