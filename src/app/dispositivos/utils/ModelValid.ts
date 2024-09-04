import { AbstractControl } from '@angular/forms';

export class ModelValid {
    static model(control: AbstractControl) {
        const value = control.value;
        if (value.sNombre === undefined || value.uiCategoria === undefined) {
            return { model: true };
        }

        return null;
    }
}