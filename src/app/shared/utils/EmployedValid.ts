import { AbstractControl } from '@angular/forms';

export class EmployedValid {
    static employed(control: AbstractControl) {
        const value = control.value;
        if (value.uiNumeroEmpleado === undefined || value.sNombreUsuario === undefined) {
            return { employed: true };
        }

        return null;
    }
}