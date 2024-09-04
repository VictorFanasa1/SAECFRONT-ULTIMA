import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { vwReporteInventario } from 'src/app/core/models/vwReporteInventario.model';
import { SaecService } from 'src/app/core/services/saec.service';
import {InventoryAsgEmployedFinally} from 'src/app/core/modelviews/InventoryAsgEmployedFinally'
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['NoEmpleado','Empleado','Ubicacion', 'Equipo', 'Serie', 'Inventariado', 'Responsable'];
  isLoadingResults = false;
  //dataSource: MatTableDataSource<vwReporteInventario> = new MatTableDataSource<vwReporteInventario>();
  dataSource: MatTableDataSource<InventoryAsgEmployedFinally> = new MatTableDataSource<InventoryAsgEmployedFinally>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleservice: Title
  ) { }

  ngOnInit(): void {
    // this.titleservice.setTitle('Reporte Inventario');
    // this.isLoadingResults = true;
    // this.saecService.GetReportInventory()
    // .subscribe(report => {
    //   this.isLoadingResults = false;
    //   console.log(report);
    //   this.dataSource.data = report;
    // }, error => {
    //   this.isLoadingResults = false;
    //   checkError(error, this.router, this.snackBar);
    // });
    this.GetInventoryAsgEmployed();
  }

  private GetInventoryAsgEmployed()
  {
    this.titleservice.setTitle('Reporte Inventario');
    this.isLoadingResults = true;
    this.saecService.GetInventoryAsgEmployed()
    .subscribe(report => {
      this.isLoadingResults = false;
      console.log(report);
      this.dataSource.data = report;
    }, error => {
      this.isLoadingResults = false;
      checkError(error, this.router, this.snackBar);
    });
  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }

  DownLoad() {
    this.saecService.DownLoadReportInventoryAsgEmployed(this.dataSource.data)
    .subscribe(result => {
      const downloadURLSQL = window.URL.createObjectURL(result);
      const linkSQL = document.createElement('a');
      linkSQL.href = downloadURLSQL;
      let fecha = new Date();
      //linkSQL.download = `Report_${this.dataSource.data.length}.csv`;
      const format = 'dd-MM-yyyy';
      const locale = 'en-US';
      const tiempoNow = String(formatDate(fecha,format,locale));

      linkSQL.download = `Report_Inventario_${tiempoNow.toString()}.csv`;
      linkSQL.click();
    }, error => {
      this.isLoadingResults = false;
      checkError(error, this.router, this.snackBar);
    });
  } 

  
  DownLoadAdicionales() {
    // this.saecService.DownLoadReportInventoryAdicionalsAsgEmployed()
    // .subscribe(result => {
    //   console.log("Adicionales de report");
    //   console.log(result);
    //   const downloadURLSQL = window.URL.createObjectURL(result);
    //   const linkSQL = document.createElement('a');
    //   linkSQL.href = downloadURLSQL;
    //   let fecha = new Date();
    //   //linkSQL.download = `Report_${this.dataSource.data.length}.csv`;
    //   const format = 'dd-MM-yyyy';
    //   const locale = 'en-US';
    //   const tiempoNow = String(formatDate(fecha,format,locale));

    //   linkSQL.download = `Report_Inventario_Adicionales_${tiempoNow.toString()}.csv`;
    //   linkSQL.click();
    // }, error => {
    //   this.isLoadingResults = false;
    //   checkError(error, this.router, this.snackBar);
    // });

    this.saecService.DownLoadReportInventoryAdicionalsAsgEmployed()
    .subscribe(async result => {
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
