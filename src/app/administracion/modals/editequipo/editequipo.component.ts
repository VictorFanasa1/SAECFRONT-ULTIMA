import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SaecService } from 'src/app/core/services/saec.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { checkError } from 'src/app/core/functions/checkError';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { catGeneral } from 'src/app/core/models/catGeneral.model';

@Component({
  selector: 'app-editequipo',
  templateUrl: './editequipo.component.html',
  styleUrls: ['./editequipo.component.scss']
})
export class EditequipoComponent implements OnInit {
  frmTipoEquiposUpdate: FormGroup;
  accesorios: catGeneral[] = [];

  constructor(
    private builder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<EditequipoComponent>,
    private service: SaecService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.frmTipoEquiposUpdate = this.builder.group({
      sNombre: ['', Validators.required],
      bActivo: [false],
      bActivoFijo: [false]
    });
  }

  ngOnInit(): void {
    //console.log(this.data)
    this.frmTipoEquiposUpdate.patchValue({
      sNombre: this.data.sNombre,
      bActivo: this.data.bActivo,
      bActivoFijo: this.data.bActivoFijo
    });
  }

  Close(): void {
    this.dialogRef.close();
  }

  updateModelo(){
    this.service.PutTipoEquipo(this.data.uiRegistro, this.frmTipoEquiposUpdate.value)
    .subscribe(result => {
      this.snackBar.open('Se actualizo el registro del equipo correctamente', 'Aceptar', {
        duration: 10000,
        verticalPosition: 'bottom'
      });
      this.dialogRef.close(result);
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

}
