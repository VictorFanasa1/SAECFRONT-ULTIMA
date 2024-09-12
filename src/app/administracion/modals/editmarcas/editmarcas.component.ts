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
  selector: 'app-editmarcas',
  templateUrl: './editmarcas.component.html',
  styleUrls: ['./editmarcas.component.scss']
})
export class EditmarcasComponent implements OnInit {

  frmMarcaUpdate: FormGroup;
  accesorios: catGeneral[] = [];

  constructor(
    private builder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<EditmarcasComponent>,
    private service: SaecService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.frmMarcaUpdate = this.builder.group({
      sNombre: ['', Validators.required],
      bActivo: [false]
    });
  }

  ngOnInit(): void {
    //console.log(this.data)
    this.frmMarcaUpdate.patchValue({
      sNombre: this.data.sNombre,
      bActivo: this.data.bActivo
    });
  }

  Close(): void {
    this.dialogRef.close();
  }

  updateMarca(){
    this.service.PutMarcas(this.data.uiRegistro, this.frmMarcaUpdate.value)
    .subscribe(result => {
      this.snackBar.open('Se actualizo el registro de la marca correctamente', 'Aceptar', {
        duration: 10000,
        verticalPosition: 'bottom'
      });
      this.dialogRef.close(result);
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

}
