# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


https://cdnjs.com/libraries/bootswatch

npm i bootstrap@5.3.8


<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/lumen/bootstrap.min.css" integrity="sha512-hdHm7G0usstmeadnEc35uty2sWkdO3btt1t4+yQOieAPIyUyC6AcE36YIrL4SrbNinll5f4HxpQSUA0UseNhVg==" crossorigin="anonymous" referrerpolicy="no-referrer" />



https://cdnjs.com/libraries/bootswatch

https://bootswatch.com/lumen/

https://css-tricks.com/snippets/css/a-guide-to-flexbox/


https://www.flaticon.es/

es muy importante CommonModule, RouterLink para que pueda usar routerLink


ng g s services/user


npm install ngx-toastr --save
npm install @angular/animations@19 --save

creación spinner
ng generate component shared/spinner


https://getbootstrap.com/docs/5.3/components/spinners/


node dist/index.js
https://bootswatch.com/lumen/



https://rxjs.dev/deprecations/subscribe-arguments


AuthService  se crea como service para la lógica de autenticación y rol 

Guard es un componente que decide si una ruta puede activarse o no    , Usa el Service para consultar el rol.


tuve un erro en frontend no pude ejecutarlo , habrá algo roto en ele la carpeta node_module  y suele pasa esto en 
angular 
error de parallel-worker.js

tuve que crear otra carpeta dentro C

rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install


http://localhost:3000/api/clientes


http://localhost:3000/api/users



{
  "email": "usuario3@test.com",
  "password": "123456",
  "repeatPassword": "123456",
  "id_rol": 3
}

{
  "id_usuario": 63,
  "nombre": "Raoua",
  "apellido": "Ben",
  "dni": "12345678",
  "tipo_dni": "DNI",
  "telefono": "555-1234",
  "direccion": "Calle Principal 123",
  "notas_internas": "Cliente de prueba"
}


http://localhost:4200/clientes/editar/2

http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=gestordocumentos&table=usuarios