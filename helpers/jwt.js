// Importamos el paquete jsonwebtoken, que se utiliza para generar y verificar JWT (JSON Web Tokens).
// JWT es un estándar que se utiliza para la autenticación de usuarios de forma segura.
const jwt = require('jsonwebtoken');

// Declaramos la función generarJWT, que se encarga de crear un token JWT.
// Esta función recibe como argumentos el uid (identificador único del usuario) y el name (nombre del usuario).
const generarJWT = (uid, name) => {
    // Retornamos una Promesa porque la generación del token puede implicar una operación asíncrona.
    return new Promise((resolve, reject) => {
        // Definimos el payload del token.
        // El payload es la parte del JWT que contiene información no sensible que se quiere incluir en el token.
        const payload = { uid, name };

        // Usamos jwt.sign para generar el token. Este método necesita 4 argumentos:
        // 1. payload: La información que queremos incluir dentro del token (en este caso, uid y name).
        // 2. process.env.SECRET_JWT_SEED: La clave secreta utilizada para firmar el token.
        //    Esta clave debe mantenerse oculta (se recomienda almacenarla en variables de entorno).
        // 3. Opciones: Por ejemplo, definimos "expiresIn" para establecer el tiempo de expiración del token. Aquí es de 2 horas.
        // 4. Un callback para manejar el token generado o un error si ocurre algún problema.
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h' // El token será válido durante 2 horas.
        }, (err, token) => {
            // Si ocurre un error durante la generación del token:
            if (err) {
                console.log(err); // Imprimimos el error en la consola para debug.
                reject('No se pudo generar el token'); // Rechazamos la promesa con un mensaje de error.
            }

            // Si el token se genera correctamente:
            resolve(token); // Resolvemos la promesa con el token generado.
        });
    });
};

// Exportamos la función generarJWT para que pueda ser utilizada en otros módulos del proyecto.
module.exports = {
    generarJWT
};
