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
3-git show v1.0
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

he tenido prob en JWT me salía el error en sign y error de No overload matches this call
 TENIA QUE  installar  v8
El problema específico con TypeScript
sign tiene overloads incompatibles
sign(payload, null, { algorithm: "none" })
debe trabajar con V8 de Jsonwebtoken 

npm install --save-dev @types/jsonwebtoken@8


Se corrige la creación del token JWT en TypeScript resolviendo conflictos de tipado con jsonwebtoken.
Se utiliza la versión estable v8, compatible con Express y CommonJS, permitiendo el uso correcto de jwt.sign con expiresIn y variables de entorno.


ADMIN crea CLIENTE (createUser) → requiere_cambio_password = true
2️⃣ CLIENTE hace login (auth.controller.ts/login)
3️⃣ Backend detecta requiere_cambio_password = true → devuelve 403 con mensaje
4️⃣ Frontend redirige a /cambiar-password → llama a changePassword()
5️⃣ Backend actualiza contraseña y pone requiere_cambio_password = false
6️⃣ Cliente hace login de nuevo → acceso normal



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





