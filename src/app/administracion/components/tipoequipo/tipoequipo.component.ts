import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { catGeneral } from 'src/app/core/models/catGeneral.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { EditequipoComponent } from '../../modals/editequipo/editequipo.component';
@Component({
  selector: 'app-tipoequipo',
  templateUrl: './tipoequipo.component.html',
  styleUrls: ['./tipoequipo.component.scss']
})
export class TipoequipoComponent implements OnInit {

  frmTipoEquipos: FormGroup;

  displayedColumns: string[] = ['Id', 'Nombre', 'Activo', 'Fijo', 'delete', 'edit'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<catGeneral> = new MatTableDataSource<catGeneral>();
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
    this.frmTipoEquipos = this.builder.group({
      sNombre: ['', Validators.required],
      bActivo: [false],
      bActivoFijo: [false]
    });
  }

  ngOnInit(): void {
      this.titleservice.setTitle('Tipo de Equipo');
  }

  register(){
    this.service.PostTipoEquipo(this.frmTipoEquipos.value)
    .subscribe(result => {
      //console.log(result);
      this.snackBar.open('Se creo correctamente el equipo: ' + result.sNombre, 'Aceptar', {
        duration: 10000,
        verticalPosition: 'top'
      });
      this.frmTipoEquipos.reset();
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

  delete(id: any){
   //console.log(valor);
   this.service.DeleteTipoEquipo(id)
   .subscribe(result => {
     this.snackBar.open('Se elimino correctamente el registro del equipo', 'Aceptar', {
       duration: 10000,
       verticalPosition: 'bottom'
     });
     this.show();
   }, error => {
     checkError(error, this.router, this.snackBar);
   })
  }

  edit(accesorios: any){
    const dialogRef = this.dialog.open(EditequipoComponent, {
      data: accesorios,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.dataSource.data.push(result);
        this.dataSource._updateChangeSubscription();
        this.show();
      }
    });
  }

  show(){
    this.service.GetAllTipoEquipo()
      .subscribe(result => {
        this.dataSource.data = result;
      }, error => {
        checkError(error, this.router, this.snackBar);
      })
  }

  searchTipoEquipo(value: string) {
    this.dataSource.filter = value;
  }


}
