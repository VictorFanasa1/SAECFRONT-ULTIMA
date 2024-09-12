import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SaecService } from 'src/app/core/services/saec.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { checkError } from 'src/app/core/functions/checkError';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { catProveedoresAux } from 'src/app/core/models/catProveedoresAux.model';

@Component({
  selector: 'app-editproveedores',
  templateUrl: './editproveedores.component.html',
  styleUrls: ['./editproveedores.component.scss']
})
export class EditproveedoresComponent implements OnInit {

  frmProveedorUpdate: FormGroup;
  proveedores: catProveedoresAux[] = [];


  constructor(
    private builder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<EditproveedoresComponent>,
    private service: SaecService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.frmProveedorUpdate = this.builder.group({
      sNombre: ['', Validators.required],
      sRazonSocial: ['', Validators.required],
      uiCategoria: ['', Validators.required],
      bActivo: [false]
    });
  }

  ngOnInit(): void {
    this.frmProveedorUpdate.patchValue({
      sNombre: this.data.sNombre,
      sRazonSocial: this.data.sRazonSocial,
      uiCategoria: this.data.uiCategoria,
      bActivo: this.data.bActivo
    });
    this.service.GetTypeProveedores()
    .subscribe(result => {
      this.proveedores = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
  }

  Close(): void {
    this.dialogRef.close();
  }

  updateProveedor(){
    //console.log(this.frmProveedorUpdate.value);
    this.service.PutProveedores(this.data.uiProveedor, this.frmProveedorUpdate.value)
    .subscribe(result => {
      this.snackBar.open('Se actualizo el registro del proveedor correctamente', 'Aceptar', {
        duration: 10000,
        verticalPosition: 'bottom'
      });
      this.dialogRef.close(result);
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

}
