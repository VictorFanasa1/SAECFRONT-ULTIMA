import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { checkError } from 'src/app/core/functions/checkError';
import { asighistory } from 'src/app/core/modelviews/asighistory.model';
import { dispositivos } from 'src/app/core/modelviews/dispositivos.model';
import { seriesaf } from 'src/app/core/modelviews/seriesaf.model';
import { transferencia } from 'src/app/core/modelviews/transferencia.model';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { SaecService } from 'src/app/core/services/saec.service';
import { SupportsComponent } from 'src/app/shared/bottoms/supports/supports.component';
import { db } from '../../../core/database/saec';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.scss']
})
export class ExpedienteComponent implements OnInit {

  frmActivo: FormGroup;
  divices: seriesaf[] = [];
  isSelected = false;
  divice: dispositivos = new dispositivos();
  transfers: transferencia[] = [];
  history: asighistory[] = [];
  inProccess = false;

  constructor(
    private formbuilder: FormBuilder,
    private saecService: SaecService,
    private comuniService: CommunicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private titleservice: Title,
    private _bottomSheet: MatBottomSheet
  ) {
    this.titleservice.setTitle('Expediente');
    this.frmActivo = this.formbuilder.group({
      divice: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      if(params.sSerie !== undefined) {
        this.frmActivo.patchValue( { divice: params.sSerie } );
        this.setInfoDivice();
      }
    });

    this.frmActivo.controls.divice.valueChanges
    .subscribe(async (sSerie: string) => {
      db.series.where('sSerie').startsWith(sSerie.toUpperCase()).limit(10).toArray()
      .then(result => {
        this.divices = result;
      });
    });
  }

  downLoadFile(uiOrigen: Guid) {
    this.saecService.DownLoadFile(uiOrigen)
    .subscribe(async result => {
      const base64Response = await fetch(`data:${result.sType};base64,${result.btmFile}`);
      const blob = await base64Response.blob();
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = result.sFile;
      link.click();
    }, error => {
      checkError(error, this.router, this.snackBar)
    });
  }

  DownLoadResponsiva(uiAsiggment: Guid) {
    this.saecService.DownLoadResponsiva(uiAsiggment)
    .subscribe(async result => {
      const base64Response = await fetch(`data:${result.sType};base64,${result.btmFile}`);
      const blob = await base64Response.blob();
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = result.sFile;
      link.click();
    }, error => {
      checkError(error, this.router, this.snackBar)
    });
  }

  setInfoDivice(): void {
    this.isSelected = true;
    this.inProccess = true;
    this.saecService.GetDiviceBySerie(this.frmActivo.controls.divice.value)
    .subscribe(result => {
      this.divice = result;
      this.titleservice.setTitle('Expediente: ' + this.divice.sSerie);
      this.comuniService.senduiDivice(this.divice.uiRemision);
      if(this.divice.bTransfer) {
        this.saecService.GettransferByUI(this.divice.uiDispositivo)
        .subscribe(result => {
          this.transfers = result;
        }, error => {
          checkError(error, this.router, this.snackBar);
          this.inProccess = false;
        });
      }
      this.saecService.GetHistoryByDivice(this.divice.uiDispositivo)
      .subscribe(result => {
        this.history = result;
        this.inProccess = false;
      }, error => {
        checkError(error, this.router, this.snackBar);
        this.inProccess = false;
      });
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isSelected = false;
      this.divice = new dispositivos();
      this.inProccess = false;
    });
  }

  ChangeDevice(sSerie: string): void {
    this.frmActivo.patchValue({ divice: sSerie });
    this.setInfoDivice();
  }

  viewSupports(uiRealese: Guid){
    this._bottomSheet.open(SupportsComponent, { data: uiRealese })
  }
}
