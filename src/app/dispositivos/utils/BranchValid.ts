import { AbstractControl } from '@angular/forms';

export class BranchValid {
    static branch(control: AbstractControl) {
        const value = control.value;
        if (value.sNombre === undefined || value.uiCategoria === undefined) {
            console.log('error en marca')
            return { branch: true };
        }

        return null;
    }
}