import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { catComercial } from 'src/app/core/models/catComercial.model';
import { map, startWith } from 'rxjs/operators';
import { remision } from 'src/app/core/modelviews/remision.model';
import { NewremisionComponent } from '../../modals/newremision/newremision/newremision.component';

@Component({
  selector: 'app-remision',
  templateUrl: './remision.component.html',
  styleUrls: ['./remision.component.scss']
})
export class RemisionComponent implements OnInit {
  displays: string[] = ['OC', 'Factura', 'Remision', 'dtRemision', 'iCantidad', 'Responsable', 'Ubicacion', 'actions'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<remision> = new MatTableDataSource<remision>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('empTbSort') empTbSort = new MatSort();
  frmFilter: FormGroup;
  ocs: any[] = [];
  invoice: any[] = [];
  remision: any[] = [];
  ttlpz: number = 0;
  ttlprice: number = 0;
  filterValues: any = {
    sRemision: '',
    sFactura: '',
    sOC: ''
  }

  filteredOpInvoice: Observable<invoiceHeader[]>;
  controlInvoice  = new FormControl('');

  catalogoInvoice: invoiceHeader[] = [];
  opcionInvoice: string = "";
  arregloInvoice: string[] = [];


  filteredOpOrden: Observable<catComercial[]>;
  controlOrden  = new FormControl('');

  catalogoOrdenC: catComercial[] = [];
  opcionOrden: string = "";
  arregloOrdenC: string[] = [];


  constructor(
    private service: SaecService,
    private dialog: MatDialog,
    private router: Router,
    private builder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.frmFilter = this.builder.group({
      sRemision: [''],
      sFactura: [''],
      sOC: ['']
    });

    this.filteredOpOrden = new Observable<catComercial[]>();
    this.filteredOpInvoice = new Observable<invoiceHeader[]>();

  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.show();

    this.getOrdenes();
    this.getInvoices();

    this.frmFilter.valueChanges
    .subscribe((filtros) => {
      this.AssigmentFilter(filtros);
    });
  }

  private _filterOrden(value: string): catComercial[] {
    const filterValue = value.toLowerCase();
      return this.catalogoOrdenC.filter(optorden => optorden.sFolioOrdenCompra.toString().toLowerCase().includes(filterValue));
  }

  private _filterInvoice(value: string): invoiceHeader[] {
    const filterValue = value.toLowerCase();
      return this.catalogoInvoice.filter(opinvoice => opinvoice.sFactura.toString().toLowerCase().includes(filterValue));
  }

  private getOrdenes()
  {
    this.service.GetAllOrdenes()
    .subscribe(orden=>{
      this.catalogoOrdenC = orden;
      this.filteredOpOrden = this.controlOrden.valueChanges.pipe(
        startWith(''),
        map(ord => (ord ? this._filterOrden(ord) : this.catalogoOrdenC.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }

  private getInvoices()
  {
    this.service.GetAllInvoices(2)
    .subscribe(invoice=>{
      this.catalogoInvoice = invoice;
      this.filteredOpInvoice = this.controlInvoice.valueChanges.pipe(
        startWith(''),
        map(ord => (ord ? this._filterInvoice(ord) : this.catalogoInvoice.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }

  show(){
    this.service.GetAllRemisiones()
    .subscribe((result: remision[]) => {
      //console.table(result);
      this.dataSource.data = result;
      this.ocs = result;
      this.ttlpz = this.dataSource.data.reduce((acc, fact) => acc + (fact.iCantidad || 0), 0)
      this.isLoadingResults = false;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadingResults = false;
    });

  }

  private AssigmentFilter(data: any) {
    this.filterValues.sRemision = data.sRemision.toUpperCase();
    this.filterValues.sFactura = data.sFactura.toUpperCase();
    this.filterValues.sOC = data.sOC.toUpperCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
    this.ValueTTL();
  }

  private ValueTTL() {
    this.ttlpz = this.dataSource.filteredData.reduce((acc, fact) => acc + (fact.iCantidad || 0), 0)
  }


  private createFilter(): (contact: remision, filter: string) => boolean {
    let filterFunction = function (contact: remision, filter: any): boolean {
      let searchTerms = JSON.parse(filter);
        return contact.sRemision.toString().indexOf(searchTerms.sRemision) !== -1
        && contact.sFactura.toString().indexOf(searchTerms.sFactura) !== -1
        && contact.sOC.toString().indexOf(searchTerms.sOC) !== -1;
    }
    return filterFunction;
  }

  AddRemision() {
    const dialogRef = this.dialog.open(NewremisionComponent, {
      width: '100%',
      height: '80vh',
      data: {remision: this.ocs, ordenes: this.catalogoOrdenC, title: "Agregar Remisión", var: 1}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.show();
      this.getOrdenes();
      this.getInvoices();
    });
  }

  EditRemision(data: any) {
    this.service.GetRemisionByIU(data)
    .subscribe(remision => {
    this.remision = remision;
    //console.table(this.remision)
    const dialogRef = this.dialog.open(NewremisionComponent, {
      width: '100%',
      height: '40vh',
      data: {remision: this.remision, ordenes: "", title: "Modificar Remisión", var: 2}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.show();
      this.getOrdenes();
      this.getInvoices();
    });
  }, error => {
    checkError(error, this.router, this.snackBar);
  });
  }

  // ShowInvoice(data: any) {
  //   this.service.GetInvoicesByUI(data)
  //   .subscribe(invoice => {
  //   //console.log(invoice)
  //   this.invoice = invoice;
  //   const dialogRef = this.dialog.open(ShowdetailsinvoiceComponent, {
  //     width: '100%',
  //     height: '40vh',
  //     data: {invoice: this.invoice, title: "Ver Equipos de la Factura"}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.show();
  //   });
  // }, error => {
  //   checkError(error, this.router, this.snackBar);
  // });
  // }

  DownLoadFile(value:Guid, uiTipo: number) {
    console.log(value);
    this.service.DownLoadFileComercialFactura(value, uiTipo)
    .subscribe(async result => {
      //console.log(result);
      const base64Response = await fetch(`data:${result.sType};base64,${result.btmFile}`);
      const blob = await base64Response.blob();
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = result.sFile;
      link.click();
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.sort = this.empTbSort;
  }

}
