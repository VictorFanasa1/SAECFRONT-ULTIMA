import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { SaecService } from 'src/app/core/services/saec.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { catComercialFacturas } from 'src/app/core/models/catComercialFacturas.model';
import { invoiceRem } from 'src/app/core/modelviews/invoiceRem.model';
import { NewdevicesComponent } from '../../modals/newdevices/newdevices.component';
import { Guid } from 'guid-typescript';
import { ViewdevicesComponent } from '../../modals/viewdevices/viewdevices.component';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.component.html',
  styleUrls: ['./alta.component.scss']
})
export class AltaComponent implements OnInit {

  ejecutando = false;
  ocerror = '';
  namefiles1: string[] = [];
  namefiles2: string[] = [];
  typearr: any[] = [];
  ttlPz = 0;
  ttlPrice = 0;
  mostrarComercial = false;
  mostrarProv = false;
  mostrarArr = false;
  jsonData = []

  filteredOpInvoice: Observable<catComercialFacturas[]>;
  controlInvoice = new FormControl();


  catalogoInvoice: catComercialFacturas[] = [];
  opcionInvoice: string = "";
  arregloInvoice: string[] = [];


  displays: string[] = ['Folio', 'Equipo', 'Modelo', 'Cantidad', 'Empleado', 'Ubicacion', 'actions'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<invoiceRem> = new MatTableDataSource<invoiceRem>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;


  constructor(
    public builder: FormBuilder,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {

    this.filteredOpInvoice = new Observable<catComercialFacturas[]>();

  }

  ngOnInit(): void {
    this.getFacturas();
    this.service.GetTypeArr()
    .subscribe(result => {
     this.typearr = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
  }

  private _filterFactura(value: string): catComercialFacturas[] {
    const filterValue = value.toLowerCase();
      return this.catalogoInvoice.filter(option => option.sFactura.toString().toLowerCase().includes(filterValue));
  }



  private getFacturas()
  {
    this.service.GetInvoices()
    .subscribe(invoice=>{
      this.catalogoInvoice = invoice;
      this.filteredOpInvoice = this.controlInvoice.valueChanges.pipe(
        startWith(''),
        map(inv => (inv ? this._filterFactura(inv) : this.catalogoInvoice.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }



  // upLoadFilesProv(): void {
  //   this.namefiles1 = [];
  //   const evidenciaRH1 = document.getElementById('tracing-upload-1') as HTMLInputElement;
  //   const listaFilesRH1 = evidenciaRH1.files;
  //   if (listaFilesRH1 !== null) {
  //     for(var i = 0; i < listaFilesRH1.length; i++){
  //       this.namefiles1.push(listaFilesRH1[i].name);
  //     }
  //   }
  // }


  SearchData() {
    let data = this.catalogoInvoice.find(x => x.sFactura === this.opcionInvoice);
    if(data !== undefined) {
      this.service.GetInvoiceRemision(data.sFactura)
      .subscribe((result : invoiceRem[]) => {
        this.dataSource.data = result;
        console.table(this.dataSource.data);
        this.mostrarComercial = true;
        this.isLoadingResults = false;
      }, error => {
        checkError(error, this.router, this.snackBar);
        this.isLoadingResults = false;
      });
    }
 }

 Divices(empleado: number, remision:Guid, tipo: number) {
  switch(tipo){
         case 1:
          const dialogRefMod = this.dialog.open(NewdevicesComponent, {
            width: '100%',
            height: '60vh',
            data: {title: "Alta de Dispositivos", sempleado: empleado, uiremision: remision }
          });
          dialogRefMod.afterClosed().subscribe(result => {
            this.getFacturas();
          });
         break;
         case 2:
          const dialogRefView = this.dialog.open(ViewdevicesComponent, {
            width: '100%',
            height: '60vh',
            data: {title: "Consulta de Dispositivos", uiremision: remision }
          });
          dialogRefView.afterClosed().subscribe(result => {
            //this.getFacturas();
          });
         break;
  }
}



}
