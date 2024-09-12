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
import { EditmodelosComponent } from '../../modals/editmodelos/editmodelos.component';
@Component({
  selector: 'app-modelos',
  templateUrl: './modelos.component.html',
  styleUrls: ['./modelos.component.scss']
})
export class ModelosComponent implements OnInit {
  frmModelos: FormGroup;

  displayedColumns: string[] = ['Id', 'Nombre', 'Activo', 'delete', 'edit'];
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
    this.frmModelos = this.builder.group({
      sNombre: ['', Validators.required],
      bActivo: [false]
    });
  }

  ngOnInit(): void {
      this.titleservice.setTitle('Modelos');
  }

  register(){
    this.service.PostModelos(this.frmModelos.value)
    .subscribe(result => {
      //console.log(result);
      this.snackBar.open('Se creo correctamente el accesorio: ' + result.sNombre, 'Aceptar', {
        duration: 10000,
        verticalPosition: 'top'
      });
      this.frmModelos.reset();
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

  delete(id: any){
   //console.log(valor);
   this.service.DeleteModelos(id)
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
    const dialogRef = this.dialog.open(EditmodelosComponent, {
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
    this.service.GetAllModelos()
      .subscribe(result => {
        this.dataSource.data = result;
      }, error => {
        checkError(error, this.router, this.snackBar);
      })
  }

  searchModelos(value: string) {
    this.dataSource.filter = value;
  }


}
