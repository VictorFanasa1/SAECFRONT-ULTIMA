import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmpleadosComponent } from 'src/app/administracion/components/empleados/empleados.component';
import { checkError } from 'src/app/core/functions/checkError';
import { admEmpleados } from 'src/app/core/models/admEmpleados.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { Title } from "@angular/platform-browser";
import Swal from 'sweetalert2';
import {admUbicacionesEmpleado} from './../../../core/models/admUbicacionesEmpleado'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-employeds',
  templateUrl: './employeds.component.html',
  styleUrls: ['./employeds.component.scss']
})
export class EmployedsComponent implements OnInit {

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

  employed: FormGroup;
  frmSearch: FormGroup;
  employeds: admEmpleados[] = [];
  ubicaciones: Array<any> = [];
  isLoadingResults = false;
  camposBloqueados = true;
  is_edit: boolean = true; 

  filterubicaciones!: Observable<admUbicacionesEmpleado[]>;
  internoExterno: FormGroup = new FormGroup({
    eleccion: new FormControl()
  });

  constructor(
    private builder: FormBuilder,
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private tittleservice: Title,
    @Inject(MAT_DIALOG_DATA) public dataInformation: {opcion: number},
    public dialogRef: MatDialogRef<EmpleadosComponent>) {
      this.employed = this.builder.group({
        numero: new FormControl({value: 0, disabled: true}, Validators.required),
        nombre: new FormControl({value: '', disabled: true}, Validators.required),
        correo: new FormControl({value: '', disabled: true}, Validators.required),
        puesto: new FormControl({value: '', disabled: true}, Validators.required),
        uen: new FormControl({value: '', disabled: true}, Validators.required),
        ubicacion: new FormControl({value: '', disabled: true}, Validators.required),
      });
      this.frmSearch = this.builder.group({
        data: ['', Validators.required]
      });

      this.filterubicaciones = this.employed.controls.ubicacion.valueChanges.pipe(
        startWith(''),
        map(value => this._filterUbi(value))
      );
    };

  ngOnInit(): void {
    this.saecService.GetUbicacionesEmpleados().subscribe(result => {
      this.ubicaciones = result;
    });
  }

  private _filterUbi(value: string): admUbicacionesEmpleado[] {
    const filterValue = value.toString().toUpperCase();
    return this.ubicaciones.filter(option => option.sNombreUbicacion.toString().toUpperCase().includes(filterValue));
  }

  
  displayUbi(ubicacion: admUbicacionesEmpleado): string {
    return ubicacion ? ubicacion.sNombreUbicacion : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  SearchAsiggments() {
    this.tittleservice.setTitle('Cargando...');
    this.isLoadingResults = true;
    this.saecService.GetAllNameEmailHCM(this.frmSearch.controls.data.value).subscribe(result => {
      this.employed.patchValue({ numero: result.uiNumeroEmpleado });
      this.employed.patchValue({ nombre: result.sNombreUsuario });
      this.employed.patchValue({ correo: result.sCorreoUsuario });
      this.employed.patchValue({ puesto: result.sPuesto });
      this.employed.patchValue({ ubicacion: result.uiUbicacion });
      this.employed.patchValue({ uen: result.sUEN });
      this.employed.enable();
      this.isLoadingResults = false;
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

  submit(): void{
    if(this.employed.controls.ubicacion.value == "" || this.internoExterno.value['eleccion'] == null){
      this.Toast.fire({
        icon: 'warning',
        title: 'Datos incompletos (Ubicación - Usuario Interno o Externo)'
      });

    }else{
      Swal.fire({
        title: "¿Está seguro(a) de dar de alta a este Usuario? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"
      }).then((result) => {
        if (result.isConfirmed) {
    
          let employed: admEmpleados = new admEmpleados();
          employed.sNombreUsuario = this.employed.controls.nombre.value;
          employed.uiNumeroEmpleado = this.employed.controls.numero.value;
          employed.sCorreoUsuario = this.employed.controls.correo.value;
          employed.sPuesto = this.employed.controls.puesto.value;
          employed.sUEN = this.employed.controls.uen.value;
          employed.uiUbicacion = this.employed.controls.ubicacion.value.sNombreUbicacion;
          employed.bInterno = true;
          employed.sEstatus = 'ACTIVO';
          employed.bStatus = true;
          employed.iUbicacion = this.employed.controls.ubicacion.value.uiIdUicacion;
          employed.bInterno = this.internoExterno.value['eleccion'];
          console.log("entra a empleado");
          console.log(employed);
          console.log(this.dataInformation.opcion == 1);  
          if(this.dataInformation.opcion == 1){
            this.saecService.PostEmployedNew(employed).subscribe(result => {
              console.log(result);
              this.Toast.fire({
                icon: 'success',
                title: 'Usuario creado exitosamente'
              });
              this.dialogRef.close(result);
              setTimeout(() => {
                this.router.navigate(['/administracion/empleados']);
              }, 3000);
            }, error => {
              checkError(error, this.router, this.snackBar)
            });
          }else{
          this.saecService.PostEmployed(employed).subscribe(result => {
            this.Toast.fire({
              icon: 'success',
              title: 'Usuario creado exitosamente'
            });
            this.dialogRef.close(result);
            setTimeout(() => {
              this.router.navigate(['/administracion/empleados']);
            }, 3000);
          }, error => {
            checkError(error, this.router, this.snackBar)
          });
        }
      
      }
    });
  }
  }
}

