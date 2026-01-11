echo "# Gestor-documentos" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/essenia/Gestor-documentos.git
git push -u origin main

****

creación etiqueta

1-   git log --oneline
2- git tag -a v1.0 ee3b04a -m "Versión 1.0"
3-git show v1.0
4-git push origin v1.0
5-git push origin --tags

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
