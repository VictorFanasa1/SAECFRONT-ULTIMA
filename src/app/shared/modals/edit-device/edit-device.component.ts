import { validateVerticalPosition } from '@angular/cdk/overlay';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { checkError } from 'src/app/core/functions/checkError';
import { catGeneral } from 'src/app/core/models/catGeneral.model';
import { catStatus } from 'src/app/core/models/catStatus.model';
import { catSubStatus } from 'src/app/core/models/catSubStatus.model';
import { changesdevices } from 'src/app/core/modelviews/changesdevices.model';
import { dispositivos } from 'src/app/core/modelviews/dispositivos.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { BranchValid } from 'src/app/dispositivos/utils/BranchValid';
import { ModelValid } from 'src/app/dispositivos/utils/ModelValid';
import { PlacaComponent } from '../placa/placa.component';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss']
})
export class EditDeviceComponent implements OnInit {
  
  edit: FormGroup;
  status: catStatus[] = [];
  substatus: catSubStatus[] = [];
  branchs: catGeneral[] = [];
  filterbranchs!: Observable<catGeneral[]>;
  models: catGeneral[] = [];
  filtermodels!: Observable<catGeneral[]>;
  namefiles: string[] = [];

  constructor(
    private builder: FormBuilder,
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PlacaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dispositivos) {
      this.edit = this.builder.group({
        placa: [''],
        estatus: [0, [Validators.required, Validators.min(1)]],
        subestatus: [0, [Validators.required, Validators.min(1)]],
        branch: [catGeneral, [Validators.required, BranchValid.branch]],
        model: [catGeneral, [Validators.required, ModelValid.model]]
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    this.saecService.GetAllStatus()
    .subscribe(result => {
      this.status = result;
      const estatus = this.status.find(x => x.sDescripcion === this.data.sEstatus);
      this.edit.patchValue({ estatus: estatus?.uiStatus });
      this.status.splice(2,1);
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.saecService.GetAllSubStatus()
    .subscribe(result => {
      this.substatus = result;
      const subestatus = this.substatus.find(x => x.sDescripcion === this.data.sSubEstatus);
      this.edit.patchValue({ subestatus: subestatus?.uiSubStatus });
      this.substatus.splice(2,1); 
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.saecService.GetAllBranchs()
    .subscribe(result => {
      this.branchs = result;
      const branch = this.branchs.find(x => x.sNombre === this.data.sMarca);
      this.edit.patchValue({ branch: branch });
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.saecService.GetAllModels()
    .subscribe(result => {
      this.models = result;
      const model = this.models.find(x => x.sNombre === this.data.sModelo);
      this.edit.patchValue({ model: model });
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.filterbranchs = this.edit.controls.branch.valueChanges.pipe(
      startWith(''),
      map(value => this._filterbranchs(value))
    );

    this.filtermodels = this.edit.controls.model.valueChanges.pipe(
      startWith(''),
      map(value => this._filtermodels(value))
    );

    this.edit.patchValue({ placa: this.data.sPlaca });
  }

  private _filterbranchs(value: string): catGeneral[] {
    const filterValue = value.toString().toUpperCase();
    return this.branchs.filter(option => option.sNombre.toString().toUpperCase().includes(filterValue));
  }

  private _filtermodels(value: string): catGeneral[] {
    const filterValue = value.toString().toUpperCase();
    return this.models.filter(option => option.sNombre.toString().toUpperCase().includes(filterValue));
  }

  displayBranch(branch: catGeneral): string {
    if(branch === null)
    {
      return '';
    }
    else{
      return branch ? branch.sNombre : '';
    }
  }

  displayModel(model: catGeneral): string {
    if(model === null)
    {
      return '';
    }
    else{
      return model ? model.sNombre : '';
    }
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

  submit(): void{
    let changes: changesdevices = new changesdevices();
    changes.uiDispositivo = this.data.uiDispositivo;
    changes.uiSubStatus = this.edit.controls.subestatus.value;
    changes.uiStatus = this.edit.controls.estatus.value;
    changes.sPlaca = this.edit.controls.placa.value;
    changes.uiMarca = this.edit.controls.branch.value.uiRegistro;
    changes.uiModelo = this.edit.controls.model.value.uiRegistro;
    this.saecService.PutDevice(changes)
    .subscribe(result => {
      this.snackBar.open('Se editó el equipo!', 'Aceptar', {
        duration: 10000
      });
      const evidenciaRH = document.getElementById('tracing-upload') as HTMLInputElement;
      const listaFilesRH = evidenciaRH.files;
      if (listaFilesRH !== null) {
        if(listaFilesRH.length > 0) {
          const element = listaFilesRH[0];
          this.saecService.PostSupport(element, changes.uiDispositivo)
          .subscribe(result => {
          }, error => {
            checkError(error, this.router, this.snackBar);
          });
        }
      }
      this.dialogRef.close();
    }, error => {
      checkError(error, this.router, this.snackBar)
    });
  }
}
