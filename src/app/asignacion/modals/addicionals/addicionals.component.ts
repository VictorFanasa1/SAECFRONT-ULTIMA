import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { checkError } from 'src/app/core/functions/checkError';
import { activofijo } from 'src/app/core/modelviews/activofijo.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-addicionals',
  templateUrl: './addicionals.component.html',
  styleUrls: ['./addicionals.component.scss']
})
export class AddicionalsComponent implements OnInit {

  adicionals: activofijo[] = [];
  filteradicionals!: Observable<activofijo[]>;
  frmAdicional: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddicionalsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Guid,
    private formbuilder: FormBuilder,
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.frmAdicional = this.formbuilder.group({
      divice: [activofijo]
    });
  }

  ngOnInit(): void {
    this.saecService.GetStockAdicionals()
    .subscribe(result => {
      this.adicionals = result;
    }, error => {
      checkError(error,this.router,this.snackBar);
    });

    this.filteradicionals = this.frmAdicional.controls.divice.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAdi(value))
    );
  }

  private _filterAdi(value: string): activofijo[] {
    if(value !== null)
    {
      const filterValue = value.toString().toUpperCase();
      return this.adicionals.filter(option => option.sSerie.toString().toUpperCase().includes(filterValue));
    }
    else {
      return this.adicionals;
    }
  }

  displayActivo(division: activofijo): string {
    if(division === null)
    {
      return '';
    }
    else{
      return division ? division.sSerie : '';
    }
  }

  PostAdicional() {
    if(confirm(`Está por asignar la Serie: ${this.frmAdicional.value.sSerie}, esto se quedará registrado en el expediente del mismo ¿Está de acuerdo?`)) {
      this.saecService.PostAddicional(this.data, this.frmAdicional.value.divice)
      .subscribe(result => {
        this.dialogRef.close(result);
        this.snackBar.open('Se asignó el adicional: ' + result.sSerie, 'Aceptar', {
          duration: 10000
        })
      }, error => {
        checkError(error,this.router,this.snackBar);
      });
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
