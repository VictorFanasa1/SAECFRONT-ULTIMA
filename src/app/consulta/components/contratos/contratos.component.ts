import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {

  displayedColumns: string[] = ['Empleado', 'Nombre', 'Serie', 'Asignado', 'Inventariado', 'Ubicación'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private service: SaecService
  ) { }

  ngOnInit(): void {
  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }

  downLoadAssigments(): void {
    this.service.DownLoadAllAsigments(this.dataSource.data)
    .subscribe(async result => {
      const base64Response = await fetch(`data:${result.sTypeContent};base64,${result.sFile}`);
      const blob = await base64Response.blob();
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = result.sFileName;
      link.click();
    }, error => {
      checkError(error, this.router, this.snackBar)
    });
  }
}
