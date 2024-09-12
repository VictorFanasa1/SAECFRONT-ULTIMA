import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { catProveedores } from 'src/app/core/models/catProveedores.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { EditproveedoresComponent } from '../../modals/editproveedores/editproveedores.component';
import { catProveedoresAux } from 'src/app/core/models/catProveedoresAux.model';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
  frmProveedores: FormGroup;
  proveedores: catProveedoresAux[] = [];

  displayedColumns: string[] = ['Id', 'Nombre', 'Tipo', 'Razon', 'Activo', 'delete', 'edit'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<catProveedores> = new MatTableDataSource<catProveedores>();
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
    this.frmProveedores = this.builder.group({
      sNombre: ['', Validators.required],
      sRazonSocial: ['', Validators.required],
      bActivo: [false]
    });
  }

  ngOnInit(): void {
      this.titleservice.setTitle('Proveedores');
      this.service.GetTypeProveedores()
      .subscribe(result => {
        this.proveedores = result;
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
  }

  register(){
    this.service.PostModelos(this.frmProveedores.value)
    .subscribe(result => {
      //console.log(result);
      this.snackBar.open('Se creo correctamente el accesorio: ' + result.sNombre, 'Aceptar', {
        duration: 10000,
        verticalPosition: 'top'
      });
      this.frmProveedores.reset();
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

  delete(id: any){
   //console.log(valor);
   this.service.DeleteProveedores(id)
   .subscribe(result => {
     this.snackBar.open('Se elimino correctamente el registro del modelo', 'Aceptar', {
       duration: 10000,
       verticalPosition: 'bottom'
     });
     this.show();
   }, error => {
     checkError(error, this.router, this.snackBar);
   })
  }

  edit(accesorios: any){
    const dialogRef = this.dialog.open(EditproveedoresComponent, {
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
    this.service.GetAllProveedores()
      .subscribe(result => {
        //console.log(result);
        this.dataSource.data = result;
      }, error => {
        checkError(error, this.router, this.snackBar);
      })
  }

  searchProveedores(value: string) {
    this.dataSource.filter = value;
  }


}
