import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { admEmpleados } from 'src/app/core/models/admEmpleados.model';
import { employedassigment } from 'src/app/core/modelviews/employedassigments.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { MovimientoComponent } from '../../../shared/modals/movimiento/movimiento.component';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})
export class MovimientosComponent implements OnInit {

  frmSearch: FormGroup;
  employeds: admEmpleados[] = [];
  displayedColumns: string[] = ['Serie', 'Tipo', 'Marca', 'Modelo', 'Estatus', 'actions'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<employedassigment> = new MatTableDataSource<employedassigment>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private builder: FormBuilder,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleservice: Title
  ) {
    this.frmSearch = this.builder.group({
      data: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.titleservice.setTitle('Cargando...');
    this.service.GetAllNameEmail()
    .subscribe(result => {
      this.employeds = result;
      this.titleservice.setTitle('Movimientos');
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
  }

  SearchAsiggments() {
    console.log(this.frmSearch.controls.data.value);
    this.service.GetAsiggmentsByUser(this.frmSearch.controls.data.value)
    .subscribe(result => {
      this.dataSource.data = result;
      this.titleservice.setTitle('Movimientos: ' + this.frmSearch.controls.data.value);
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

  LiberarEquipo(row: any) {
    const dialogRef = this.dialog.open(MovimientoComponent, {
      maxWidth: '450px',
      hasBackdrop: false,
      data: {serie: row.sSerie, uiAsignacion: row.uiAsiggment},
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }
  descargarResponsiva(idAss: number){
    window.open(`https://aplicacion.fanasa.com/SaecResponsivas/Documentos/CartaResponsivaDeEquipoDeComputo?parametroSAEC=${idAss}`, '_blank')
  }
}
