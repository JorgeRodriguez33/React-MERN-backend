// Importamos los módulos necesarios de Mongoose
const { Schema, model } = require('mongoose');

// Definimos un esquema de Mongoose para los eventos
const EventoSchema = Schema({

    // Campo para el título del evento
    title: {
        type: String, // El tipo de dato debe ser una cadena de texto (String)
        required: true // Este campo es obligatorio
    },
    
    // Campo para notas adicionales sobre el evento
    notes: {
        type: String, // Es un campo opcional, de tipo String
        // Si no se especifica `required`, no es obligatorio
    },
    
    // Fecha y hora de inicio del evento
    start: {
        type: Date, // El tipo de dato es Date (fecha y hora)
        required: true // Este campo es obligatorio
    },
    
    // Fecha y hora de finalización del evento
    end: {
        type: Date, // El tipo de dato es Date (fecha y hora)
        required: true // Este campo es obligatorio
    },
    
    // Usuario relacionado con el evento
    user: {
        type: Schema.Types.ObjectId, // Se usa un ObjectId de MongoDB para relacionar el evento con un usuario
        ref: 'Usuario', // Hace referencia al modelo de la colección 'Usuario'
        required: true // Este campo es obligatorio
    }

});

// Método para personalizar el formato del objeto JSON que retorna el esquema
EventoSchema.method('toJSON', function() {
    // Desestructuramos el objeto para excluir los campos `__v` y `_id`
    const { __v, _id, ...object } = this.toObject();
    // Renombramos `_id` a `id` para mayor claridad y compatibilidad
    object.id = _id;
    // Retornamos el objeto modificado
    return object;
});

// Exportamos el modelo basado en el esquema, con el nombre 'Evento'
// Este modelo se puede usar para interactuar con la colección 'eventos' en la base de datos
module.exports = model('Evento', EventoSchema);


/* 

Explicación general:

Schema y model: Estos se usan para definir la estructura de los documentos y crear modelos 
                de base de datos en MongoDB.

Validaciones (required): Garantizan que ciertos campos deben estar presentes al guardar un documento.

Relación con otro modelo (user): El ObjectId permite establecer relaciones entre colecciones en MongoDB.

Método toJSON: Simplifica la salida JSON eliminando campos innecesarios (__v) y renombrando _id a id 
               para una mejor comprensión.

*/