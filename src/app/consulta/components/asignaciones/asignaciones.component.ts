import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { db } from 'src/app/core/database/saec';
import { checkError } from 'src/app/core/functions/checkError';
import { admEmpleados } from 'src/app/core/models/admEmpleados.model';
import { admUbicaciones } from 'src/app/core/models/admUbicaciones.model';
import { catGeneral } from 'src/app/core/models/catGeneral.model';
import { assigments } from 'src/app/core/modelviews/assigments.model';
import { datauploaddoc } from 'src/app/core/modelviews/datauploaddoc.model';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { SaecService } from 'src/app/core/services/saec.service';
import { MovimientoComponent } from 'src/app/shared/modals/movimiento/movimiento.component';
import { UploaddocComponent } from 'src/app/shared/modals/uploaddoc/uploaddoc.component';

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.scss']
})
export class AsignacionesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Empleado', 'Nombre', 'Serie', 'Placa', 'Tipo', 'Marca', 'Modelo', 'Asignado', 'Inventariado', 'Ubicación', 'Responsiva'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<assigments> = new MatTableDataSource<assigments>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ubicaciones: admUbicaciones[] = [];
  frmFilters: FormGroup;
  types: catGeneral[] = [];
  brands: catGeneral[] = [];
  employeds: admEmpleados[] = [];
  data: string[] = [];
  filterValues: any = {
    bDocument: '',
    sPlace: '',
    sSerie: '',
    uiPlace: '',
    sPlaca: '',
    sType: '',
    sBrand: '',
    sEmployed: ''
  }

  constructor(
    public dialog: MatDialog,
    private service: SaecService,
    private builder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleservice: Title,
    private navservice: NavigationService
  ) {
    this.frmFilters = this.builder.group({
      bDocument: [''],
      sPlace: [''],
      sSerie: [''],
      uiPlace: [''],
      sPlaca: [''],
      sType: [''],
      sBrand: [''],
      sEmployed: ['']
    });
  }

  ngOnInit(): void {
    this.CargarData();
    this.service.ObtainData()
    .subscribe(result => {
      this.data = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadingResults = false;
    });

    this.service.GetAllAlmacen()
    .subscribe(result => {
      this.ubicaciones = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadingResults = false;
    });

    this.service.GetTipoByAF()
    .subscribe(result => {
      this.types = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadingResults = false;
    });

    this.service.GetAllBranchs()
    .subscribe(result => {
      this.brands = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadingResults = false;
    });

    this.frmFilters.controls.sSerie.valueChanges
    .subscribe(
      (sSerie: string) => {
        this.filterValues.sSerie = sSerie.toUpperCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      }
    )
    this.frmFilters.controls.uiPlace.valueChanges
    .subscribe(
      (uiPlace: string) => {
        this.filterValues.uiPlace = uiPlace.toUpperCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      }
    )
    this.frmFilters.controls.sPlace.valueChanges
    .subscribe(
      (sPlace: string) => {
        this.filterValues.sPlace = sPlace.toUpperCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      }
    )
    this.frmFilters.controls.bDocument.valueChanges
    .subscribe(
      (bDocument: string) => {
        this.filterValues.bDocument = bDocument.toUpperCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      }
    );
    this.frmFilters.controls.sPlaca.valueChanges
    .subscribe(
      (sPlaca: string) => {
        this.filterValues.sPlaca = sPlaca.toUpperCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      }
    );
    this.frmFilters.controls.sType.valueChanges
    .subscribe(
      (sType: string) => {
        this.filterValues.sType = sType.toUpperCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      }
    );
    this.frmFilters.controls.sBrand.valueChanges
    .subscribe(
      (sBrand: string) => {
        this.filterValues.sBrand = sBrand.toUpperCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      }
    );

    this.frmFilters.controls.sEmployed.valueChanges
    .subscribe(
      (sEmployed: string) => {
        this.filterValues.sEmployed = sEmployed.toUpperCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
        this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      }
    )
  }

  CargarData(): void {
    this.titleservice.setTitle('Cargando...');
    this.isLoadingResults = true;
    this.service.GetAllAsigments()
    .subscribe(result => {
      this.dataSource.data = result;
      this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      this.isLoadingResults = false;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.titleservice.setTitle('Error');
      this.isLoadingResults = false;
    });
    this.service.GetAllNameEmail()
    .subscribe(result => {
      this.employeds = result;
    });
  }

  private createFilter(): (contact: assigments, filter: string) => boolean {
    let filterFunction = function (contact: assigments, filter: any): boolean {
      let searchTerms = JSON.parse(filter);
        return contact.sSerie.toString().indexOf(searchTerms.sSerie) !== -1
        && contact.sPlace.toString().indexOf(searchTerms.sPlace) !== -1
        && contact.bDocument.toString().indexOf(searchTerms.bDocument) !== -1
        && contact.sPlaca.toString().indexOf(searchTerms.sPlaca) !== -1
        && contact.sType.toString().indexOf(searchTerms.sType) !== -1
        && contact.sBrand.toString().indexOf(searchTerms.sBrand) !== -1
        && contact.uiPlace.toString().indexOf(searchTerms.uiPlace) !== -1
        && contact.sEmployed.toString().indexOf(searchTerms.sEmployed) !== -1;
    }
    return filterFunction;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Asignaciones por pagina: ';
    this.dataSource.filterPredicate = this.createFilter();
  }

  ReSendEmail(uiAssigment: Guid): void {
    if(confirm(`¿Está seguro de reenviar el correo?`)) {
      this.titleservice.setTitle('Enviando correo...');
      this.service.ReSendEmail(uiAssigment)
      .subscribe(result =>{
        this.snackBar.open('Se envió el correo a: ' + result.owner, 'Aceptar', {
          duration: 7000
        });
        this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      }, error => {
        checkError(error, this.router, this.snackBar);
        this.isLoadingResults = false;
        this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
      });
    }
  }

  downLoadAssigments(): void {
    this.titleservice.setTitle('Descargando...');
    this.service.DownLoadAllAsigments(this.dataSource.filteredData)
    .subscribe(async result => {
      const base64Response = await fetch(`data:${result.sTypeContent};base64,${result.sFile}`);
      const blob = await base64Response.blob();
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = result.sFileName;
      link.click();
      this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.titleservice.setTitle('Asignaciones: '+ this.dataSource.filteredData.length);
    });
  }

  LiberarEquipo(row: assigments) {
    const dialogRef = this.dialog.open(MovimientoComponent, {
      maxWidth: '450px',
      hasBackdrop: false,
      data: {serie: row.sSerie, uiAsignacion: row.uiAssigment},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  CargarResponsiva(row: assigments, i: number) {
    let data: datauploaddoc = new datauploaddoc();
    data.sSerie = row.sSerie;
    data.uiOrigen = row.uiAssigment;
    data.sType = 'Responsiva';
    data.bPre = row.bDocument;

    const dialogRef = this.dialog.open(UploaddocComponent, {
      maxWidth: '750px',
      maxHeight: '700px',
      hasBackdrop: false,
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.dataSource.data[i].bDocument = result ? 'SI' : 'NO';
      }
    });
  }

  GoToExpediente(row: any) {
    this.router.navigate(
      ['consulta/expediente'],
      {
        queryParams: { sSerie: row.sSerie },
        queryParamsHandling: 'merge' }
      );
  }
}
