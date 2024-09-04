import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { dispositivos } from 'src/app/core/modelviews/dispositivos.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { EditDeviceComponent } from 'src/app/shared/modals/edit-device/edit-device.component';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss']
})
export class EquiposComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Tipo', 'Marca', 'Modelo', 'Serie', 'Placa', 'Estatus', 'SubEstatus', 'Remision', 'Ubicacion'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<dispositivos> = new MatTableDataSource<dispositivos>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private service: SaecService,
    private dialog: MatDialog,
    private titleservice: Title
  ) { }

  ngOnInit(): void {
    this.titleservice.setTitle('Cargando...');
    this.isLoadingResults = true;
    this.service.GetAllDivices()
    .subscribe(result =>{
      this.dataSource.data = result;
      this.titleservice.setTitle('Todos los Equipos');
      this.isLoadingResults = false;
    }, error => {
      this.isLoadingResults = false;
      checkError(error, this.router, this.snackBar);
      this.titleservice.setTitle('Error');
    });
  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }

  DeviceToAssigment(sSerie: string) {
    localStorage.setItem('diviceassig', sSerie);
    this.router.navigate(['/asignacion', 'asignar']);
  }

  editDevice(device: dispositivos) {
    const dialogRef = this.dialog.open(EditDeviceComponent, {
      width: '400px',
      height: '630px',
      data: device
    });
  }

  upLoadPlacas() {

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
