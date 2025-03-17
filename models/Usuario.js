// Importamos las funciones Schema y model desde mongoose.
// Schema se utiliza para definir la estructura de los documentos en la base de datos.
// model se usa para crear un modelo basado en un esquema.
const { Schema, model } = require('mongoose');

// Definimos un esquema para el modelo "Usuario".
// Esto describe cómo deben lucir los documentos de usuarios en la base de datos.
const UsuarioSchema = Schema({
    // Campo 'name': Representa el nombre del usuario.
    // Es de tipo String (cadena de texto) y es un campo obligatorio (require: true).
    name: {
        type: String,
        required: true
    },
    // Campo 'email': Representa el correo electrónico del usuario.
    // Es de tipo String y también es obligatorio. 
    // unique: true asegura que no se repitan valores (los correos deben ser únicos en la base de datos).
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Campo 'password': Contendrá la contraseña del usuario.
    // Es de tipo String y obligatorio.
    password: {
        type: String,
        required: true
    }
});

// Exportamos el modelo "Usuario" basado en el esquema UsuarioSchema.
// El primer argumento ('Usuario') es el nombre del modelo,
// y el segundo argumento (UsuarioSchema) es el esquema que define su estructura.
// Este modelo nos permitirá interactuar con la colección de usuarios en la base de datos.
module.exports = model('Usuario', UsuarioSchema);
