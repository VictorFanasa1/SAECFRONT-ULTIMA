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
  selector: 'app-editmodelos',
  templateUrl: './editmodelos.component.html',
  styleUrls: ['./editmodelos.component.scss']
})
export class EditmodelosComponent implements OnInit {
  frmModeloUpdate: FormGroup;
  accesorios: catGeneral[] = [];

  constructor(
    private builder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<EditmodelosComponent>,
    private service: SaecService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.frmModeloUpdate = this.builder.group({
      sNombre: ['', Validators.required],
      bActivo: [false]
    });
  }

  ngOnInit(): void {
    //console.log(this.data)
    this.frmModeloUpdate.patchValue({
      sNombre: this.data.sNombre,
      bActivo: this.data.bActivo
    });
  }

  Close(): void {
    this.dialogRef.close();
  }

  updateModelo(){
    this.service.PutModelos(this.data.uiRegistro, this.frmModeloUpdate.value)
    .subscribe(result => {
      this.snackBar.open('Se actualizo el registro del modelo correctamente', 'Aceptar', {
        duration: 10000,
        verticalPosition: 'bottom'
      });
      this.dialogRef.close(result);
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

}
