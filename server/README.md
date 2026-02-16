http://localhost:3000/api/users

{
  "email": "admin@admin.com",
  "password": "123456",
  "id_rol": 1
}


echo "# Gestor-documentos" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/essenia/Gestor-documentos.git
git push -u origin main

****
git add .

git push
creación etiqueta


git tag -a v1.2 -m "Implementación y corrección de autenticación JWT"
git push origin v1.2
1-   git log --oneline
2- git tag -a v1.0 ee3b04a -m "Versión 1.0"
3-git show v.0
4-git push origin v1.0
5-git push origin --tags
 git tag -a v2.1  
git push origin v2.1
 git tag -a v2.1 -m "Versión 2.1"
git tag -a v1.2 ee3b04a -m "Configuración y gestión de roles"



*****
comande  para iniciar el proyecto 
npm init -y

npm install express bcrypt cors dotenv jsonwebtoken sequelize

https://sequelize.org/docs/v6/getting-started/

https://www.typescriptlang.org/

npm install typescript --save-dev
to run with this =>  npx tsc


install Nodemon  va a estar escuchando los cambios refrescar todos los cambios  cada vez que hacemos un cambio

 npm i nodemon --save-dev 

--install express
npm i --save-dev @types/express


1-- ejecutar el Comande con  npx tsc --init



npx tsc

npx nodemon dist/index.js

npx tsc --watch


dentro package.json ponemos ==> "dev" : "nodemon dist/index.js"
 So podemos ejecutar con => 
npm run dev


"verbatimModuleSyntax": true
 deberia ser comentada  Por qué TypeScript  estaba “forzando” a require


npm i --save-dev @types/jsonwebtoken

en el login 
if (user.requiere_cambio_password) {
  return res.status(403).json({
    message: 'Debe cambiar su contraseña',
    requiereCambioPassword: true
  });
}

--------- JWT_SECRET  => se usa para firmar los tokens JWT


const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

he tenido prob en JWT , error en sign y error de No overload matches this call
 TENIA QUE  installar  v8
El problema específico con TypeScript
sign tiene overloads incompatibles
sign(payload, null, { algorithm: "none" })
debe trabajar con V8 de Jsonwebtoken 

npm install --save-dev @types/jsonwebtoken@8


Se corrige la creación del token JWT en TypeScript resolviendo conflictos de tipado con jsonwebtoken.
Se utiliza la versión estable v8, compatible con Express y CommonJS, permitiendo el uso correcto de jwt.sign con expiresIn y variables de entorno.


ADMIN crea CLIENTE (createUser) → requiere_cambio_password = true
1 CLIENTE hace login (auth.controller.ts/login)
2 Backend detecta requiere_cambio_password = true → devuelve 403 con mensaje
3  Frontend redirige a /cambiar-password → llama a changePassword()
4 Backend actualiza contraseña y pone requiere_cambio_password = false
5 Cliente hace login de nuevo → acceso normal



loging y generar Token 



Post --->  http://localhost:3000/api/auth/login
{
  "email": "abogada@abogada.com",
  "password": "123456"
}


{
  "email": "cliente@gmail.com",
  "password": "temporal123"
}



Post ---> http://localhost:3000/api/auth/change-password

{
  "userId": 5,
   "newPassword": "Cliente123456"

}
 to generate a token like this with this library is:



jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: '1h' });



***+*Siguiente paso crear validate-jwt  para proteger rutas verificando que el usuario tenga un JWT (JSON Web Token) válido.


**decoded es la información del usuario que viene dentro del JWT después de validarlo.


*****************creacion  del  Front y  instalacion de Boostrap para la parte del Login **


install Angular CLI
Creación NEW Project
dentro CMD  =>>  ng new frontend   

ls
dir .
cd frontend
code .




ng g c components/login



http://localhost:3000/api/users
parte del test 
{
  "email": "usuario3@test.com",
  "password": "123456",
  "repeatPassword": "123456",
  "id_rol": 3
}

http://localhost:3000/api/auth/change-password

{
  "userId": 40,
  "newPassword": "12345678"
}



Crear Caso

1-- crear nuevo caso
2-- Después de crear el caso, crear automáticamente los registros en caso_documento según tipo_caso_documento.

en el momento a crear  un caso  nuevo el sitema genera automaticamente un código único code caso 
  usando DNI + año actual 

 3- Crear automaticamente el checklist de documentps de tabla caso_documento cuando se crea el caso 
 cuando se crea un caso miramos qué trámite es  (tipo_tramite_id)      , buscamos sus docs en tipo_caso_docm   luego creamos copias de esos docus en caso docus 
Crear caso -> mirar qué trámite es -> copiar sus documentos base -> crear checklist en caso_documento


***  subir un archivo y actualizar ese registro con ruta, tamaño, tipo y fecha de subida

Cuando se crea un caso:

- Ya tiene su código único
- Ya tiene su número de expediente
-Ya tiene lista de documentos a entregar
- El frontend puede mostrar el checklist inmediatamente
-La abogada solo tiene que empezar a subir archivos
ç
CasoDocumento que es donde se almacenan los documentos reales de cada caso (el checklist + archivos subidos).

Crear un caso (casos)

Generar su checklist automático (caso_documento)

Saber qué documentos subir y cuáles son obligatorios

Consultar los documentos con su nombre desde la base

Multer es un middleware de Node.js para Express que se usa para manejar la subida de archivos (file uploads),
1- install Multer
npm install multer
npm install -D @types/multer

http://localhost:3000/api/caso-documentos/4/upload




http://localhost:3000/api/casos


{
  "id_cliente": 4,
  "tipo_tramite_id": 1
}


PATCH http://localhost:3000/api/caso-documentos/4/validar



crear caso

listar trámites

listar documentos

subir archivo

validar documento


