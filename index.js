const express = require("express");
require("dotenv").config(); //me importo el dotenv
const { dbConnection } = require('./database/config');

// Importamos el paquete 'cors' (Cross-Origin Resource Sharing)
// Este paquete nos permite controlar quién puede acceder a nuestra API desde dominios diferentes
const cors = require('cors'); // Cuando se hacen pruebas desde POSTMAN, POSTMAN hace creer al cors de que la solicitud sale del mismo servidor, por eso siempre va a andar

//console.log(process.env); // muestra todos los proceses que se estan corriendo en el ambiente, hay que puede ver el PORT definido en el "".env"

/* Creo el servidor de express, poner "app" es un standar*/
const app = express(); 

// Base de datos
dbConnection();


// CORS
// Habilitamos CORS en nuestra aplicación Express
// 'app.use(cors())' aplica las configuraciones predeterminadas de CORS, permitiendo que otros dominios accedan a nuestra API
// Por defecto, esto habilita el acceso desde cualquier origen, pero podemos configurar restricciones (por ejemplo, dominios específicos)
app.use(cors()); // Importante que vaya antes de app.use(express.json()); !!!!



//              configuracion de Rutas (endpoint)
/***********************************************************/

/* app.get('/',(req,response) =>{
    console.log("Se requiere el /")

    //debo definir una respuesta 
    response.json({
        ok:true
    })
}); */


// Lectura y parseo del body
app.use(express.json());//las peticiones que vengan en formato json las voy procesar ahi y voy a extraer su contenido


/* Endpoints para el CRUD */

/* Especifico la ruta habilitada para aceder a los endopoints de auth "/api/auth" */
app.use("/api/auth",require("./routes/auth"));

app.use("/api/events",require("./routes/events"));

/***********************************************************/

// Directorio publico
/* 
En Express.js, un middleware es una función que se ejecuta durante el ciclo de vida de una solicitud antes 
de que llegue a su manejador final. Los middleware pueden modificar la solicitud (req), la respuesta (res) o 
terminar la solicitud. */
app.use(express.static("public")); //indico el path de donde esta el directorio publico que se creo, pero como esta en el mismo directorio, basta con poner "public"






// escuchar peticiones 
// (el puerto donde va a estar corriendo, un callback que se ejecutara cuando el servidor express este levantado)
app.listen(process.env.PORT ,()=>{
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
});
