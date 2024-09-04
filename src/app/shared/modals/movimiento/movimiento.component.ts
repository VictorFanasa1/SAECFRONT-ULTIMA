import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { catStatus } from 'src/app/core/models/catStatus.model';
import { catSubStatus } from 'src/app/core/models/catSubStatus.model';
import { catTipoAsignacion } from 'src/app/core/models/catTipoAsignacion.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-movimiento',
  templateUrl: './movimiento.component.html',
  styleUrls: ['./movimiento.component.scss']
})
export class MovimientoComponent implements OnInit {

  frmLiberacion: FormGroup;
  status: catStatus[] = [];
  substatus: catSubStatus[] = [];
  types: catTipoAsignacion[] = [];

  constructor(
    public dialogRef: MatDialogRef<MovimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private builder: FormBuilder
  ) {
    this.frmLiberacion = this.builder.group({
      uiLiberacion: ['00000000-0000-0000-0000-000000000000', Validators.required],
      uiAsignacion: [this.data.uiAsignacion, Validators.required],
      uiMotivo: [null, Validators.required],
      uiEntrega: [null, Validators.required],
      uiStatus: [null, Validators.required],
      uiSubStatus: [null, Validators.required],
      sComentario: [null],
      dtFecha: [new Date(), Validators.required],
    });
  }

  SendLiberacion() {
  }

  ngOnInit(): void {
    this.service.GetAllStatus()
    .subscribe(result => {
      this.status = result;
      this.status.splice(1,1);
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.service.GetAllSubStatus()
    .subscribe(result => {
      this.substatus = result;
      this.substatus.splice(1,1);
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.service.GetTypesAsigments()
    .subscribe( result => {
      this.types = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
  }

  close(){
    this.dialogRef.close();
  }
}
