import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SaecService } from 'src/app/core/services/saec.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { checkError } from 'src/app/core/functions/checkError';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { catAccesorios } from 'src/app/core/models/catAccesorios.model';


@Component({
  selector: 'app-editaccesorios',
  templateUrl: './editaccesorios.component.html',
  styleUrls: ['./editaccesorios.component.scss']
})
export class EditaccesoriosComponent implements OnInit {
  frmAccesorioUpdate: FormGroup;
  accesorios: catAccesorios[] = [];

  constructor(
    private builder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<EditaccesoriosComponent>,
    private service: SaecService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.frmAccesorioUpdate = this.builder.group({
      sNombre: ['', Validators.required],
      bActivo: [false]
    });
  }

  ngOnInit(): void {
    //console.log(this.data)
    this.frmAccesorioUpdate.patchValue({
      sNombre: this.data.sNombre,
      bActivo: this.data.bActivo
    });
  }

  Close(): void {
    this.dialogRef.close();
  }

  updateAccesorio(){
    this.service.PutAccesorios(this.data.uiRegistro, this.frmAccesorioUpdate.value)
    .subscribe(result => {
      this.snackBar.open('Se actualizo el registro del accesorio correctamente', 'Aceptar', {
        duration: 10000,
        verticalPosition: 'bottom'
      });
      this.dialogRef.close(result);
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

}
