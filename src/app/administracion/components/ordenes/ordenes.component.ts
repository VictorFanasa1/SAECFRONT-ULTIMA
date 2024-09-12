import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MatChipList } from '@angular/material/chips';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {

  frmOrden: FormGroup;
  ejecutando = false;
  typeslease: catTiposComercial[] = [];
  displayedColumns: string[] = ['Folio', 'Tipo', 'UEN', 'Alta', 'Orden', 'actions'];
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
    this.show();
    this.service.GetAllTypesComercial()
    .subscribe(result => {
      this.typeslease = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
  }

  show(){
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
    this.ejecutando = true;
      const layoutclaim = document.getElementById('tracing-upload') as HTMLInputElement;
      const listlayout = layoutclaim.files;
      if (listlayout !== null) {
        if(listlayout.length !== 0){
          this.service.PostComercialOrden(this.frmOrden.value)
          .subscribe(result => {
            //console.log(result);
            if(result != null){
              this.frmOrden.reset();
              this.frmOrden.patchValue({
                dtFechaAlta: new Date(),
                uiComercial: '00000000-0000-0000-0000-000000000000'
              });
              this.snackBar.open('Se creo la orden de compra con el folio: ' + result.sFolioOrdenCompra, 'Aceptar');
              for (let index = 0; index < listlayout.length; index++) {
                this.service.PostDocumentOrden(listlayout[index], result.uiComercial)
                .subscribe(result =>{
                  this.show();
                  console.log('Se cargo la orden de compra');
                }, error => {
                  console.log(error);
                });
              }
            }else{
              this.ejecutando = false;
              this.snackBar.open('El folio de orden de compra ya existe.', 'Aceptar');
            }
          }, error => {
            checkError(error, this.router, this.snackBar);
          })
      }
      else{
        this.ejecutando = false;
        this.snackBar.open('Favor de cargar el archivo de la orden de compra.', 'Aceptar');
      }
    }
    else {
      this.ejecutando = false;
      this.snackBar.open('Favor de cargar el archivo de la orden de compra.', 'Aceptar');
    }
  }

  DownLoadFile(uiComercial: Guid) {
    console.log(uiComercial)
    this.service.DownLoadFileComercial(uiComercial)
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
      this.show();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
