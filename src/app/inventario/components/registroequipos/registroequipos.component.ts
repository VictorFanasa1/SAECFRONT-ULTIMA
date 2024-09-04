import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { admRegistrarDispositivos } from 'src/app/core/models/admRegistrarDispositivos.model';
import { bodega } from 'src/app/core/modelviews/bodega.model';
import { solicitudes } from 'src/app/core/modelviews/solicitudes.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-registroequipos',
  templateUrl: './registroequipos.component.html',
  styleUrls: ['./registroequipos.component.scss']
})
export class RegistroequiposComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Usuario', 'Empleado', 'Serie', 'Serial', 'Placa', 'Tipo', 'Marca', 'Modelo', 'Fecha', 'CHECK'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<solicitudes> = new MatTableDataSource<solicitudes >();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleservice: Title
    ) { }

  ngOnInit(): void {
    this.titleservice.setTitle('Solicitudes');
    this.saecService.GetSolicitudes()
    .subscribe(result => {
      console.log(result);
      this.dataSource.data = result;
    });
  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }

  checkrecord(Record: admRegistrarDispositivos): void {
    Record.bRevisado = true;
    const uiRecord = Record.uiRecord;
    this.saecService.PutSolicitud(Record, uiRecord)
    .subscribe(result => {
      console.log('Se cambio el status');
      this.saecService.GetSolicitudes()
      .subscribe(result => {
        this.dataSource.data = result;
        this.dataSource._updateChangeSubscription();
      });
    }, error => {
      checkError(error, this.router, this.snackBar)
    });
  };

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
