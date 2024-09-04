import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { invoiceHeader } from 'src/app/core/modelviews/invoiceHeader.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { UploadcomercialComponent } from 'src/app/shared/modals/uploadcomercial/uploadcomercial.component';
import {MatSort, Sort} from '@angular/material/sort';
import { NewinvoiceComponent } from '../../modals/newinvoice/newinvoice.component';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit, AfterViewInit {

  displays: string[] = ['Factura', 'Contrato', 'OC', 'iPiezas', 'mTotal', 'dtFactura', 'actions'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<invoiceHeader> = new MatTableDataSource<invoiceHeader>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('empTbSort') empTbSort = new MatSort();
  frmFilter: FormGroup;
  ocs: any[] = [];
  contratos: string[] = [];
  ttlpz: number = 0;
  ttlprice: number = 0;
  filterValues: any = {
    sFactura: '',
    sContrato: '',
    sOC: '',
    bDocumento: ''
  }

  constructor(
    private service: SaecService,
    private dialog: MatDialog,
    private router: Router,
    private builder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.frmFilter = this.builder.group({
      sFactura: [''],
      sContrato: [''],
      sOC: [''],
      bDocumento: ['']
    });
  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.service.GetAllInvoices()
    .subscribe((result: invoiceHeader[]) => {
      this.dataSource.data = result;
      this.ttlpz = this.dataSource.data.reduce((acc, fact) => acc + fact.iPiezas, 0)
      this.ttlprice = this.dataSource.data.reduce((acc, fact) => acc + fact.mTotal, 0);
      this.isLoadingResults = false;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadingResults = false;
    });

    this.service.GetAllSOC()
    .subscribe(ocs => {
      this.ocs = ocs;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.service.GetAllsContrato()
    .subscribe(contratos => {
      this.contratos = contratos;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.frmFilter.valueChanges
    .subscribe((filtros) => {
      this.AssigmentFilter(filtros);
    });
  }

  private ValueTTL() {
    this.ttlpz = this.dataSource.filteredData.reduce((acc, fact) => acc + fact.iPiezas, 0)
    this.ttlprice = this.dataSource.filteredData.reduce((acc, fact) => acc + fact.mTotal, 0);
  }

  private AssigmentFilter(data: any) {
    this.filterValues.sFactura = data.sFactura.toUpperCase();
    this.filterValues.sContrato = data.sContrato.toUpperCase();
    this.filterValues.sOC = data.sOC.toUpperCase();
    this.filterValues.bDocumento = data.bDocumento.toUpperCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
    this.ValueTTL();
  }

  OpenDialog(row: invoiceHeader, i: number) {
    let ref = this.dialog.open(UploadcomercialComponent, {
      maxHeight: '500px',
      maxWidth: '500px',
      data: { uiOrigin: row.uiFactura, sType: 'Factura', sDocument: row.sFactura, bPre: row.bDocument === 'SI' ? true : false }
    });

    
    ref.beforeClosed().subscribe((result: Boolean) => {
      if(result !== undefined) {
        if(result) {
          this.dataSource.data[i].bDocument = 'SI';
          this.snackBar.open('Se cargó el documento de la Factura: ' + row.sFactura, 'Aceptar', {
            duration: 10000,
            verticalPosition: 'top'
          });
          setTimeout(() => {
            this.dataSource._updateChangeSubscription();
          }, 250);
        }
      }
    });
  }

  private createFilter(): (contact: invoiceHeader, filter: string) => boolean {
    let filterFunction = function (contact: invoiceHeader, filter: any): boolean {
      let searchTerms = JSON.parse(filter);
        return contact.sFactura.toString().indexOf(searchTerms.sFactura) !== -1
        && contact.sContrato.toString().indexOf(searchTerms.sContrato) !== -1
        && contact.sOC.toString().indexOf(searchTerms.sOC) !== -1
        && contact.bDocument.toString().indexOf(searchTerms.bDocumento) !== -1;
    }

    return filterFunction;
  }

  AddInvoice() {
    this.dialog.open(NewinvoiceComponent, {
      width: '100%',
      height: '80vh',
      data: this.ocs
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.sort = this.empTbSort;
  }
}
