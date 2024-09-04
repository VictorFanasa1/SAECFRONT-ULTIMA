import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

export function checkError(error: any, router: Router, snack: MatSnackBar): void {
    switch(error.status){
        case 400:
            snack.open(error.error, 'Cerrar', {
                duration: 10000
            });
            break;
        case 401:
            snack.open('Favor de inciar sesión.', 'Aceptar', {
                duration: 5000
            });
            router.navigate(['login']);
          break;
        case 403:
          snack.open('No tienes los permisos suficientes para realizar esta acción.', 'Aceptar', {
              duration: 7500
          });
          break;
        case 404:
            snack.open(error.error, 'Aceptar', {
                duration: 10000
            });
            break;
        default:
            console.log(error);
            alert(error.error);
          break;
      }
}