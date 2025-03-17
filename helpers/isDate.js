// Importamos el módulo 'moment', que es una librería de JavaScript para manejar y manipular fechas
const moment = require('moment');

// Definimos una función llamada 'isDate' que verifica si un valor es una fecha válida
const isDate = ( value ) => {

    // Verificamos si el valor está vacío o no se ha proporcionado
    if ( !value ) {
        return false; // Si no hay valor, devolvemos 'false' porque no es una fecha válida
    }

    // Usamos 'moment' para intentar crear un objeto de fecha con el valor proporcionado
    const fecha = moment( value );

    // Comprobamos si la fecha es válida utilizando el método 'isValid' de 'moment'
    if ( fecha.isValid() ) {
        return true; // Si la fecha es válida, devolvemos 'true'
    } else {
        return false; // Si la fecha no es válida, devolvemos 'false'
    }
}

// Exportamos la función 'isDate' para que pueda ser utilizada en otros archivos del proyecto
module.exports = { isDate };
