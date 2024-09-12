import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { catAccesorios } from 'src/app/core/models/catAccesorios.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { EditaccesoriosComponent } from '../../modals/editaccesorios/editaccesorios.component';

@Component({
  selector: 'app-accesorios',
  templateUrl: './accesorios.component.html',
  styleUrls: ['./accesorios.component.scss']
})
export class AccesoriosComponent implements OnInit {

  frmAccesorios: FormGroup;

  displayedColumns: string[] = ['Id', 'Nombre', 'Activo', 'delete', 'edit'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<catAccesorios> = new MatTableDataSource<catAccesorios>();
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
    this.frmAccesorios = this.builder.group({
      sNombre: ['', Validators.required],
      bActivo: [false]
    });
  }

  ngOnInit(): void {
      this.titleservice.setTitle('Accesorios');
  }

  register(){
    this.service.PostAccesorios(this.frmAccesorios.value)
    .subscribe(result => {
      //console.log(result);
      this.snackBar.open('Se creo correctamente el accesorio: ' + result.sNombre, 'Aceptar', {
        duration: 10000,
        verticalPosition: 'top'
      });
      this.frmAccesorios.reset();
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

  delete(id: any){
   //console.log(valor);
   this.service.DeleteAccesorios(id)
   .subscribe(result => {
     this.snackBar.open('Se elimino correctamente el registro del accesorio', 'Aceptar', {
       duration: 10000,
       verticalPosition: 'bottom'
     });
     this.show();
   }, error => {
     checkError(error, this.router, this.snackBar);
   })
  }

  edit(accesorios: any){
    const dialogRef = this.dialog.open(EditaccesoriosComponent, {
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
    this.service.GetAllAccesories()
      .subscribe(result => {
        this.dataSource.data = result;
      }, error => {
        checkError(error, this.router, this.snackBar);
      })
  }

  searchAccesories(value: string) {
    this.dataSource.filter = value;
  }

}
