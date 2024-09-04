import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { admEmpleados } from 'src/app/core/models/admEmpleados.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { Title } from "@angular/platform-browser";
import { EmployedsComponent } from 'src/app/shared/modals/employeds/employeds.component';
import { EmployeduploadComponent } from 'src/app/shared/modals/employedupload/employedupload.component';
import { db } from 'src/app/core/database/saec';
import Swal from 'sweetalert2';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})

export class EmpleadosComponent implements OnInit, AfterViewInit {

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  displayedColumns: string[] = ['Numero', 'Nombre', 'Correo', 'Puesto', 'Ubicacion', 'UEN', 'esInterno', 'actions'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<admEmpleados> = new MatTableDataSource<admEmpleados>();
  empleadoModificar: admEmpleados = new admEmpleados();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private service: SaecService,
    private dialog: MatDialog,
    private tittleservice: Title
  ) { }

  ngOnInit(): void {
    this.tittleservice.setTitle('Cargando...');
    this.isLoadingResults = true;
    this.getEmployees();  

  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }

  getEmployees(){
    this.service.GetAllEmployeds().subscribe(respuesta => {
      this.dataSource.data = respuesta;
      this.isLoadingResults = false;
      this.tittleservice.setTitle('Empleados: ' + respuesta.length);
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  newEmployed() {

    const dialogRef = this.dialog.open(EmployedsComponent, {
      data: {
        opcion: 1
      },
      width:'80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      // if(result !== undefined) {
      //   this.dataSource.data.push(result);
      // }
      this.getEmployees(); 
    });
  }

  modifyRow(idEmp: number, sNombreUsuario: string){
 
    const dialogRef = this.dialog.open(EmployeduploadComponent, {
      data: { 
        empleado: idEmp,
        nomEmpleado: sNombreUsuario
      },
      width:'70%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getEmployees();  
      // setTimeout(() => {
      //   this.router.navigate(['/administracion/empleados']);
      // }, 3000);
    });
  }

  deleteRow(valor: number, nombre: string){
    Swal.fire({
      title: "¿Está seguro(a) de eliminar del registro a " + nombre + "? ",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteEmployed(valor).subscribe(respuestaBorrado => {
          this.router.navigate(['/administracion/empleados']);
          setTimeout(() => {
            this.Toast.fire({
              icon: 'success',
              title: 'Usuario eliminado exitosamente'
            });
            this.getEmployees();
            // this.router.navigate(['/administracion/empleados']);
          }, 3000);
        })
      }
    });
  }

}

