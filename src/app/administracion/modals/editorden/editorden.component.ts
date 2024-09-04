import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { catTiposComercial } from 'src/app/core/models/catTiposComercial.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-editorden',
  templateUrl: './editorden.component.html',
  styleUrls: ['./editorden.component.scss']
})
export class EditordenComponent implements OnInit {

  frmOrden: FormGroup;
  typeslease: catTiposComercial[] = [];
  namefiles: string[] = [];

  constructor(
    private builder: FormBuilder,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditordenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.frmOrden = this.builder.group({
      dtFechaAlta: ['', Validators.required],
      sFolioOrdenCompra: ['', Validators.required],
      dtFechaOrden: ['', Validators.required],
      uiTipoAdquisicion: [0, Validators.required],
      sUEN: ['', Validators.required],
      uiComercial: ['00000000-0000-0000-0000-000000000000']
    });
  }

  ngOnInit(): void {
    this.service.GetAllTypesComercial()
    .subscribe(result => {
      this.typeslease = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.frmOrden.patchValue({
      dtFechaAlta: this.data.dtAlta,
      sFolioOrdenCompra: this.data.sFolio,
      dtFechaOrden: this.data.dtOrden,
      uiTipoAdquisicion: this.data.iType,
      sUEN: this.data.sUEN,
      uiComercial: this.data.uiComercial
    });
  }

  Close() {
    this.dialogRef.close();
  }

  upLoadFiles(): void {
    this.namefiles = [];
    const evidenciaRH = document.getElementById('tracing-upload') as HTMLInputElement;
    const listaFilesRH = evidenciaRH.files;
    if (listaFilesRH !== null) {
      for(var i = 0; i < listaFilesRH.length; i++){
        this.namefiles.push(listaFilesRH[i].name);
      }
    }
  }

  PutComerccial() {

  }
}
