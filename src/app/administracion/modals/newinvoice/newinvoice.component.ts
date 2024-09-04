import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { comercial } from 'src/app/core/modelviews/comercial.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-newinvoice',
  templateUrl: './newinvoice.component.html',
  styleUrls: ['./newinvoice.component.scss']
})
export class NewinvoiceComponent implements OnInit {

  frmInvoice: FormGroup;
  ocerror = '';
  namefiles: string[] = [];
  datacomercial: comercial = new comercial();
  ttlPz = 0;
  ttlPrice = 0;

  constructor(
    public builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any[],
    public dialogref: MatDialogRef<NewinvoiceComponent>,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.frmInvoice = this.builder.group({
      sComercial: [''],
      uiComercial: ['', Validators.required],
      sFactura: ['', Validators.required],
      dtFecha: [null, Validators.required],
      details: this.builder.array([])
    })
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  get details(): FormArray {
    return this.frmInvoice.controls["details"] as FormArray;
  }

  AddDetail(): void {
    const detail = this.builder.group({
      uiDetalle: [null],
      uiFactura: [null],
      uiRegistro: [null, Validators.required],
      uiModelo: [null, Validators.required],
      mCostoUnitario: [0, Validators.required],
      iCantidad: [0, Validators.required],
      mCostoTotal: [0, Validators.required]
    });

    this.details.push(detail);
  }

  Calculate(i: number) {
    this.details.controls[i].patchValue({ mCostoTotal: this.details.controls[i].value.mCostoUnitario * this.details.controls[i].value.iCantidad });
    this.ttlPrice = this.details.controls.reduce((acc, data) => acc + data.value.mCostoTotal, 0);
    this.ttlPz = this.details.controls.reduce((acc, data) => acc + parseFloat(data.value.iCantidad), 0);
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

  SearchData() {
    let data = this.data.find(x => x.sComercial === this.frmInvoice.value.sComercial);
    if(data !== undefined) {
      this.service.GetComercialByUI(data.uiComercial)
      .subscribe(result => {
        console.table(result)
        this.datacomercial = result;
        this.ocerror = result.sType;
        this.frmInvoice.patchValue({ uiComercial: result.uiComercial });
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
    }

    else {
      this.datacomercial = new comercial();
      this.ocerror = 'No se encontro la OC.';
    }
  }
}
