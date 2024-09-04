import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { checkError } from 'src/app/core/functions/checkError';
import { comercial } from 'src/app/core/modelviews/comercial.model';
import { factura } from 'src/app/core/modelviews/factura.model';
import { remision } from 'src/app/core/modelviews/remision.model';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  uiRemision: any;
  Remision: remision = new remision();
  Factura: factura = new factura();
  Comercial: comercial = new comercial();

  constructor(
    private comService: CommunicationService,
    private saecService: SaecService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.comService.subjectuiDivice.subscribe(result => {
      this.uiRemision = result;
      this.saecService.GetRemisionByUI(this.uiRemision)
      .subscribe(result => {
        this.Remision = result;
        this.saecService.GetFacturaByUI(this.Remision.uiFactura, this.uiRemision)
        .subscribe(result => {
          this.Factura = result;
          this.saecService.GetComercialByUI(result.uiComercial)
          .subscribe(result => {
            this.Comercial = result;
          }, error => {
            checkError(error, this.router, this.snackbar);
          });
        }, error => {
          checkError(error, this.router, this.snackbar);
        });
      }, error => {
        checkError(error, this.router, this.snackbar);
      });
    });
  }
}
