import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { checkError } from 'src/app/core/functions/checkError';
import { admEmpleados } from 'src/app/core/models/admEmpleados.model';
import { assigments } from 'src/app/core/modelviews/assigments.model';
import { datauploaddoc } from 'src/app/core/modelviews/datauploaddoc.model';
import { detaildevice } from 'src/app/core/modelviews/detaildevice.model';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { SaecService } from 'src/app/core/services/saec.service';
import { AddicionalsComponent } from 'src/app/shared/modals/addicionals/addicionals.component';
import { UploaddocComponent } from 'src/app/shared/modals/uploaddoc/uploaddoc.component';
import { AccesoriesComponent } from '../../modals/accesories/accesories.component';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  beforeOperation = false;
  inProccess = false;
  frmSearch: FormGroup;
  frmSerie: FormGroup;
  employeds: admEmpleados[] = [];
  employed: admEmpleados = new admEmpleados();
  series: string[] = [];
  assiggments: detaildevice[] = [];
  assiggment: detaildevice = new detaildevice();

  constructor(
    private builder: FormBuilder,
    public dialog: MatDialog,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private title: Title,
    private _bottomSheet: MatBottomSheet,
    private comunicate: CommunicationService
  ) {
    this.title.setTitle('Consulta');
    this.frmSearch = this.builder.group({
      sData: ['', Validators.required]
    });

    this.frmSerie = this.builder.group({
      sSerie: ['']
    });
  }

  ngOnInit(): void {
    this.beforeOperation = true;
    this.route.queryParams
    .subscribe(params => {
      if(params.sData !== undefined) {
        this.frmSearch.patchValue( { sData: params.sData } );
        this.GetData()
      }
    });

    this.service.GetAllNameEmail()
    .subscribe(result => { 
      this.employeds = result;
      this.beforeOperation = false;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.beforeOperation = false;
    });

    this.frmSerie.controls.sSerie.valueChanges
    .subscribe((serie: string) => {
      let assig = this.assiggments.find(x => x.sSerie === serie);
      if(assig !== undefined) {
        this.assiggment = assig;
        this.comunicate.senduiDivice(this.assiggment.uiRemision);
      }
    })
  }

  SearchEmployed() {
    this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { sData: this.frmSearch.controls.sData.value }, 
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
      this.GetData()
  }

  OpenAccesories() {
    this._bottomSheet.open(AccesoriesComponent,{
      data: this.assiggment.uiAsiggment
    });
  }

  OpenAddicionals() {
    this.dialog.open(AddicionalsComponent, {
      data: this.assiggment.uiAsiggment
    })
  }

  private GetData() {
    this.inProccess = true;
    this.service.GetEmployedByUi(this.frmSearch.controls.sData.value)
    .subscribe(employed => {
      this.employed = employed;
      this.title.setTitle('Consulta: ' + employed.sNombreUsuario);
      this.inProccess = false;
      this.frmSearch.reset();
      this.service.GetAssigmentsByEmployed(employed.uiNumeroEmpleado)
      .subscribe(result => {
        this.SetAssiggments(result);
      }, error => {
        this.inProccess = false;
        this.title.setTitle('Error Consulta');
        checkError(error, this.router, this.snackBar);
      })
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.inProccess = false;
      this.title.setTitle('Error Consulta');
    });
  }

  private SetAssiggments(asigs: detaildevice[]) {
    this.series = asigs.map(x => x.sSerie);
    this.assiggments = asigs;
    this.assiggment = this.assiggments[0];
    this.frmSerie.patchValue({ sSerie: this.assiggment.sSerie })
    this.comunicate.senduiDivice(this.assiggment.uiRemision);
  }

  CargarResponsiva() {
    let data: datauploaddoc = new datauploaddoc();
    data.sSerie = this.assiggment.sSerie;
    data.uiOrigen = this.assiggment.uiAsiggment;
    data.sType = 'Responsiva';
    data.bPre = this.assiggment.bDocument;

    const dialogRef = this.dialog.open(UploaddocComponent, {
      maxWidth: '750px',
      maxHeight: '700px',
      hasBackdrop: false,
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.assiggment.bDocument = result ? 'SI' : 'NO';
        let i = this.assiggments.findIndex(x=>x.sSerie === this.assiggment.sSerie);
        if(i !== -1) {
          this.assiggments[i].bDocument = result ? 'SI' : 'NO';
        }
      }
    });
  }
}
