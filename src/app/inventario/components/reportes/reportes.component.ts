import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { error } from 'selenium-webdriver';
import { checkError } from 'src/app/core/functions/checkError';
import { admReporteEquipos } from 'src/app/core/models/admReporteEquipos.model';
import { bodega } from 'src/app/core/modelviews/bodega.model';
import { reportes } from 'src/app/core/modelviews/reportes.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Empleado', 'Serie', 'Ubicacion', 'Titulo', 'Mensaje', 'Fecha', 'CHECK'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<reportes> = new MatTableDataSource<reportes>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleservice: Title
    ) { }

  ngOnInit(): void {
    this.titleservice.setTitle('Log Reportes');
    this.saecService.GetReportes()
    .subscribe(result => {
      this.dataSource.data = result;
    });
  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }

  checkreport(report: admReporteEquipos): void {
    report.bRevisado = true;
    const uiRecord = report.uiRecord;
    this.saecService.PutReporte(report, uiRecord)
    .subscribe(result => {
      this.saecService.GetReportes()
      .subscribe(result => {
        this.dataSource.data = result;
        this.dataSource._updateChangeSubscription();
      });
    }, error => {
      checkError(error, this.router, this.snackBar)
    });
  }

  DownLoad(){
    this.saecService.DownLoadLogError()
    .subscribe(result => {
      const downloadURLSQL = window.URL.createObjectURL(result);
      const linkSQL = document.createElement('a');
      linkSQL.href = downloadURLSQL;
      linkSQL.download = `LogErrores_${this.dataSource.data.length}.csv`;
      linkSQL.click();
    }, error => {
      this.isLoadingResults = false;
      checkError(error, this.router, this.snackBar);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
