// Importa el paquete mongoose, que se utiliza para interactuar con bases de datos MongoDB.
const mongoose = require('mongoose');

// Enlace a la documentación oficial de Mongoose para más detalles: https://mongoosejs.com/

// Declara una función asincrónica para manejar la conexión a la base de datos.
const dbConnection = async() => {

    try {
        // Intenta conectarte a la base de datos MongoDB utilizando mongoose.
        // La URL de conexión (process.env.DB_CNN) se obtiene de las variables de entorno.
        await mongoose.connect(process.env.DB_CNN);

        // Si la conexión es exitosa, imprime un mensaje en la consola.
        console.log('DB Online');

    } catch (error) {
        // Captura cualquier error durante la conexión y lo muestra en la consola.
        console.log(error);

        // Lanza un error personalizado para indicar que la base de datos no pudo inicializarse.
        throw new Error('Error a la hora de inicializar BD');
    }
}

// Exporta la función dbConnection para que pueda ser utilizada en otras partes de la aplicación.
// Esto es útil para mantener la lógica de conexión separada del resto del código.
module.exports = {
    dbConnection
}
