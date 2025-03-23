 \```
 1)primero, estabdo en el directorio del backend , usando cmd se pone le comando "npm init -y" para crear el package.js con la configuracion por defecto, seria lo mismo que poner "npm init" y enter para todo lo que aparezcas

 el package.js es el punto de entrada de cualquier aplicacion de node.js

2)segundo, se crea el index.js usando visual studio code

2.5) Si se quiere ejecutar el contenido de index.js , basta con ejecutar el comando "node index.js" desde cmd

3)tercero, para no tener que estar ejecutando el comando "node index.js" de forma manual cada vez que se haga un cambio en index.js, se instala el paquete "npm i nodemon -g" 
  desde cmd como administrador porque se va a instalar de manera global (tiene -g) en el directorio del proyecto, entonces nodemon va a ejecutar el comando "node index.js" de 
  forma automatica, cada vez que haya un cambio en el archivo index.js
  
4)cuarto, se ejecuta en cmd el comando "nodemon index.js"

5)quinto, en el package.js, en la parte de "scripts", se pone "dev": "nodemon index.js" , y para cuando se este en produccion se configura tambien "start": "node index.js"

	"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon index.js",
    "start": "node index.js"
    }
	
6)sexto, ahora en cmd, si se quiere ejecutar el script en modo produccion basta poner "nom start" sino, si se esta en desarrollo basta con "npm run dev"

7) instalacion de express npm i express

8) se crea un directorio publico, donde todo el mundo tendra acceso de lectura, para eso , se crea una carpeta llamada "public" a la misma altura que index.js y pacjage.js

9) se crea dentro de public un archivo index.html (dentro con escribir ! + tab  , se crea el contenido automaticamente)

10) para establecer las variables de entorno en el ambiente de Node.js hay que instalar un paquete de npm "npm i dotenv"


11) separa persistir la informacion se usa un ODM como Mongoose(https://mongoosejs.com/) -  npm i mongoose  y MongoDbAtlas para guardar 

12) en mongodb atlas, luego de tener el usuario , crear el cluser que se le puede llamar como se quiera, no tiene que se cluster0

13) para conectar , se va a connect y se selecciona "connect using MongoDB Compass" (que es un progrmaa que va a permitir conectarse a la base de datos utilizando un gestor o interfaz gradica de usuario en la pc ), se descarga el programa y se instala

14) con el string connection que se te muestra al dar click en connect , podes usar eso en el progrma uqe se instalo
15) se necesita un usuario , asi que en mongo db atlas, se va a security y luego database , se pone un usuario y se auto genera una pass y se selecciona previlegios


para encriptar se usa npm i bcryptjs


// Para generar los tokens, se utiliza el estándar JSON Web Tokens (JWT).
// Más información sobre JWT y su funcionamiento: https://jwt.io/

npm i jsonwebtoken

// ¿Qué es un JWT?
// Un JWT (JSON Web Token) es un estándar que permite generar tokens únicos y seguros.
// Los tokens son cadenas de texto firmadas digitalmente que contienen información, como el id del usuario.
// En este proyecto, el servidor (basado en Express) usa JWT para manejar la autenticación del usuario de forma segura.

// ¿Por qué usar JWT?
// JWT ayuda a gestionar el estado de sesión del usuario de manera "pasiva". 
// Esto significa que el servidor no necesita almacenar información de sesión en memoria o bases de datos.
// En cambio, el cliente (el navegador o aplicación móvil) envía el token en cada solicitud al servidor.
// El servidor valida el token para verificar:
// - Si es válido (no está manipulado).
// - Si no ha caducado (tokens pueden tener una fecha de expiración).
// Si el token pasa la verificación, el servidor le permite al usuario realizar las acciones solicitadas.

// Ejemplo en este proyecto:
// - Cuando un usuario inicia sesión correctamente, se genera un JWT que contiene su información básica (como su id).
// - El cliente guarda este token (por ejemplo, en localStorage o cookies) y lo envía en las solicitudes posteriores.
// - El servidor verifica el token recibido en cada solicitud para garantizar que es válido.
// De este modo, se asegura que solo los usuarios autenticados puedan acceder a ciertos recursos o realizar acciones.





# ¿Qué es un JWT?
Un JWT (JSON Web Token) es un estándar que se utiliza para transmitir información de forma segura entre dos partes (como un cliente y un servidor). Su estructura se divide en tres partes principales, que están codificadas en Base64. Estas partes son:

# 1. Header (Encabezado)
El header es la primera parte del token y contiene información sobre:

El tipo de token: en este caso, siempre será JWT.

El algoritmo de encriptación que se usa para firmar el token, como HS256 (HMAC con SHA-256) o RS256.

Ejemplo de un header codificado en JSON:

json
{
  "alg": "HS256", // Algoritmo de encriptación
  "typ": "JWT"    // Tipo de token
}
Este encabezado se codifica en formato Base64 para que sea legible por máquinas.

# 2. Payload (Cuerpo del mensaje)
El payload es la parte donde se almacena la información o los "claims" (reclamaciones). Esta información es pública y puede ser decodificada por cualquiera que tenga acceso al token. Por eso, nunca debe incluirse información sensible como contraseñas o datos privados. Algunos ejemplos de información que se puede incluir son:

ID del usuario (uid): Identificador único del usuario.

Nombre del usuario (name): Nombre que será útil en el frontend.

Fechas: Por ejemplo, iat (issued at) para saber cuándo fue generado el token, y exp para definir cuándo caduca.

Ejemplo de un payload:

json
{
  "sub": "1234567890", // ID del usuario
  "name": "Juan Pérez", // Nombre del usuario
  "iat": 1615513502     // Fecha en la que se emitió el token (en formato Unix Timestamp)
}
Esto también se codifica en Base64, lo que significa que cualquiera puede decodificarlo y leerlo, pero no puede modificarlo sin invalidar la firma.

# 3. Signature (Firma)
La firma es la parte que asegura que el token no ha sido manipulado. Es generada usando:

El header codificado en Base64.

El payload codificado en Base64.

Una clave secreta (que solo el servidor conoce).

La firma se crea combinando estos elementos con el algoritmo especificado en el header (como HS256). Por ejemplo:

HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
La firma garantiza:

Que el token no ha sido alterado (si se manipula el payload, la firma será inválida).

Que solo el servidor que conoce la clave secreta puede generar un token válido.

Nota: La clave secreta es algo que manejas en tu servidor (por ejemplo, process.env.JWT_SECRET en Node.js).

# Estructura final de un JWT
Cuando juntas las tres partes (header, payload, y signature), obtienes un JWT completo. Estas partes están separadas por un punto (.), y el token luce así:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikp1YW4gUGVyw6lzIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
La primera parte es el header.

La segunda parte es el payload.

La tercera parte es la firma.

Resumen del flujo de un JWT:
Cuando el usuario inicia sesión, el servidor genera un JWT con información del usuario en el payload (como su id).

El token se envía al cliente (navegador o aplicación móvil) y el cliente lo almacena (generalmente en localStorage o cookies).

En cada solicitud al servidor, el cliente incluye el JWT en los encabezados (por ejemplo, en el header Authorization: Bearer <token>).

El servidor verifica:

Si la firma es válida.

Si el token no ha caducado (según el campo exp del payload).

Si la validación es exitosa, el servidor da acceso al usuario a los recursos solicitados.


# se instala npm i cors


# se instala  npm i moment

# Publicacion del backend en internet usando Railway, pero primero 
# se usa github porque la actualizacion en produccion se hara automaticamente cuando se suba a github

# github
# git init 
# git add .
# git commit -m "First commit"

# git remote add origin https://github.com/JorgeRodriguez33/React-MERN-backend.git
# git branch -M main   -> renombra la rama donde se esta parado
# git push -u origin main  -> "git push" sube las cosas a github , "-u origin main" pone como defecto el orgin el "main"


# Railway para desplegar, es gratuito
# en la web de Railway se registra usando la cuanta de github

# para agregar las variables de entorno se puede dar en raw editor y se copia y pega tal cual los de env
# el PORT 4000 no es necesario porque Railway ya lo proporciona

# luego de hacer el deploy, en settings se puede ver la url que se nos dio

# En Networking
# Public Networking , se puede  generar un nuevo dominio


\```