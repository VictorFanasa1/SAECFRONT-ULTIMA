import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { admResponsables } from 'src/app/core/models/admResponsables.model';
import { admUbicaciones } from 'src/app/core/models/admUbicaciones.model';
import { catStatus } from 'src/app/core/models/catStatus.model';
import { bodega } from 'src/app/core/modelviews/bodega.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { PlacaComponent } from 'src/app/shared/modals/placa/placa.component';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.scss']
})
export class BodegaComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Tipo', 'Marca', 'Modelo', 'Serie', 'Placa', 'Sub', 'Contrato', 'FechaI', 'FechaF', 'Dias', 'FechaM'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<bodega> = new MatTableDataSource<bodega>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ubicaciones: admUbicaciones[] = [];
  filters: FormGroup;
  status: catStatus[] = [ { uiStatus: 0, sDescripcion: 'TODOS' }, { uiStatus: 1, sDescripcion: 'STOCK' }, { uiStatus: 5, sDescripcion: 'BAJA' } ]
  selectedRowIndex = -1;
  responsables: admResponsables[] = [];
  responsable = '';
  data: string[] = [];
  filterValues: any = {
    uiStatus: 0,
    uiUbicacion: ''
  }
  datasourcefilter: bodega[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private saecService: SaecService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleservice: Title
  ) {
    this.filters = this.formbuilder.group({
      uiStatus: [0],
      uiUbicacion: ['']
    });
  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.titleservice.setTitle('Cargando...');
    this.saecService.ObtainData()
    .subscribe(result => {
      this.data = result;
      this.titleservice.setTitle('Bodega');
      this.isLoadingResults = false;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.titleservice.setTitle('Error');
      this.isLoadingResults = false;
    });

    this.saecService.GetAllAlmacen()
    .subscribe( result => {
      this.ubicaciones = result;
      if(this.ubicaciones.length === 1) {
        this.filters.patchValue({ uiUbicacion: this.ubicaciones[0].uiClaveEmpresa })
      }
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.saecService.GetResponsables()
    .subscribe(result => {
      this.responsables = result;
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.saecService.GetBodega()
    .subscribe( result => {
      this.dataSource.data = result;
      this.isLoadingResults = false;
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.filters.controls.uiStatus.valueChanges
    .subscribe(
      status => {
        this.filterValues.uiStatus = status;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )

    this.filters.controls.uiUbicacion.valueChanges
    .subscribe(
      ubicaion => {
        this.filterValues.uiUbicacion = ubicaion;
        const objresponsable = this.responsables.find(x=>x.uiClaveEmpresa === ubicaion);
        if(objresponsable !== undefined) {
          this.responsable = objresponsable.sNombre;
        }
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )
  }

  private createFilter(): (contact: bodega, filter: string) => boolean {
    let filterFunction = function (contact: bodega, filter: any): boolean {
      let searchTerms = JSON.parse(filter);
        return contact.uiUbicacion.toString().indexOf(searchTerms.uiUbicacion) !== -1
        && (contact.uiStatus === searchTerms.uiStatus || searchTerms.uiStatus === 0);
    }
    return filterFunction;
  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }

  highlight(row: any) {
    if(this.selectedRowIndex !== row) {
      this.selectedRowIndex = row;
    }

    else {
      this.selectedRowIndex = -1;
    }
  }

  changePlaca(sPlaca: string) {
    const dialogRef = this.dialog.open(PlacaComponent, {
      width: '250px',
      data: sPlaca
    });
  }

  DeviceToAssigment(sSerie: string) {
    localStorage.setItem('diviceassig', sSerie);
    this.router.navigate(['/asignacion', 'asignar']);
  }

  downLoadBodega(): void {

    

  }

  // downLoadBodega(): void {
  //   // const substatus = parseInt(this.filters.controls.substatus.value);
  //   const substatus = this.filters.controls.substatus.value;
  //   console.log(substatus);
  //   const uiclave = this.filters.controls.uiclave.value;
  //   console.log(uiclave);
  //   const status = substatus === 1 ? 'STOCK' : 'BAJA';
  //   console.log(status);
  //   this.saecService.DownLoadBodega(uiclave, status, this.dataSource.filteredData)
  //   .subscribe(async result => {
  //     const base64Response = await fetch(`data:${result.sTypeContent};base64,${result.sFile}`);
  //     const blob = await base64Response.blob();
  //     const downloadURL = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = result.sFileName;
  //     link.click();
  //   }, error => {
  //     checkError(error, this.router, this.snackBar)
  //   });
  // }

  GoToExpediente(row: any) {
    this.router.navigate(
      ['consulta/expediente'],
      {
        queryParams: { sSerie: row.sSerie },
        queryParamsHandling: 'merge' }
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Dispositivos por pagina: ';
  }
}
