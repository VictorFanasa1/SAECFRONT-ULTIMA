import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { checkError } from 'src/app/core/functions/checkError';
import { catTiposComercial } from 'src/app/core/models/catTiposComercial.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { EditordenComponent } from '../../modals/editorden/editorden.component';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {

  frmOrden: FormGroup;
  typeslease: catTiposComercial[] = [];
  displayedColumns: string[] = ['Folio', 'Tipo', 'UEN', 'OldUEN', 'Alta', 'Orden', 'actions'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  namefiles: string[] = [];

  constructor(
    private builder: FormBuilder,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.frmOrden = this.builder.group({
      dtFechaAlta: [new Date()],
      sFolioOrdenCompra: ['', Validators.required],
      dtFechaOrden: ['', Validators.required],
      uiTipoAdquisicion: [0, Validators.required],
      sUEN: ['', Validators.required],
      uiComercial: ['00000000-0000-0000-0000-000000000000']
    });
  }

  ngOnInit(): void {
    this.service.GetAllTypesComercial()
    .subscribe(result => {
      this.typeslease = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.service.GetAllOrdenes()
    .subscribe(result => {
      this.dataSource.data = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }

  upLoadFiles(): void {
    this.namefiles = [];
    const evidenciaRH = document.getElementById('tracing-upload') as HTMLInputElement;
    const listaFilesRH = evidenciaRH.files;
    if (listaFilesRH !== null) {
      for(var i = 0; i < listaFilesRH.length; i++){
        this.namefiles.push(listaFilesRH[i].name);
      }
    }
  }

  PostComercial() {
    this.service.PostComercial(this.frmOrden.value)
    .subscribe(result => {
      this.frmOrden.reset();
      this.frmOrden.patchValue({
        dtFechaAlta: new Date(),
        uiComercial: '00000000-0000-0000-0000-000000000000'
      });
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

  DownLoadFile(uiOrigen: Guid) {
    this.service.DownLoadFile(uiOrigen)
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

  EditOrden(data: any) {
    const dialogRef = this.dialog.open(EditordenComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
