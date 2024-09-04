import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmpleadosComponent } from 'src/app/administracion/components/empleados/empleados.component';
import { checkError } from 'src/app/core/functions/checkError';
import { admEmpleados } from 'src/app/core/models/admEmpleados.model';
import { SaecService } from 'src/app/core/services/saec.service';
import Swal from 'sweetalert2';
import {admUbicacionesEmpleado} from './../../../core/models/admUbicacionesEmpleado'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-employedupload',
  templateUrl: './employedupload.component.html',
  styleUrls: ['./employedupload.component.scss']
})
export class EmployeduploadComponent implements OnInit {

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
  deshabilitarCampos: Boolean = false;
  internoExterno: FormGroup = new FormGroup({
    eleccion: new FormControl()
  });
  ubicaciones: Array<any> = [];

  filterubicaciones: Observable<admUbicacionesEmpleado[]>;
  myControlUbicacion = new FormControl('');

  empleadoModificar: admEmpleados = new admEmpleados();

  catalogoUbicaciones: admUbicacionesEmpleado[] = [];
  opcionUbicacion: string = "";
  arregloUbicacion: string[] = [];
  nombreEmpleadoUpdate: string = "";
  isLoadingResults = false;

  constructor(
    private builder: FormBuilder,
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    //@Inject(MAT_DIALOG_DATA) public dataInformation: {id: number, nombre: string, correo: string, puesto: string, ubicacion: string, uen: string, esInt: boolean},
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EmployeduploadComponent>) {
      
      this.employed = this.builder.group({
        numero: ['', [Validators.required]],
        nombre: ['',Validators.required],
        correo: ['', [Validators.required]],
        puesto: ['',Validators.required],
        uen: ['',Validators.required],
        ubicacion: ['', Validators.required],
      });

      this.frmSearch = this.builder.group({
        data: ['', Validators.required]
      });

      this.filterubicaciones = new Observable<admUbicacionesEmpleado[]>();
    };

  ngOnInit(): void {
    // this.employed.patchValue({ numero: this.dataInformation.uiNumeroEmpleado });
    // this.employed.patchValue({ nombre: this.dataInformation.sNombreUsuario });
    // this.employed.patchValue({ correo: this.dataInformation.sCorreoUsuario });
    // this.employed.patchValue({ puesto: this.dataInformation.sPuesto });
    // this.employed.patchValue({ ubicacion: this.dataInformation.iUbicacion });
    // this.employed.patchValue({ uen: this.dataInformation.sUEN });
    // this.employed.patchValue({ esInterno: this.dataInformation.bInterno });
    // this.internoExterno.get('eleccion')?.setValue(this.employed.value.esInterno);
    this.isLoadingResults = true;
    this.saecService.GetAllEmployed(this.data.empleado).
    subscribe(emp=>{
      this.empleadoModificar = emp;
      console.log(this,this.empleadoModificar);
     this.employed = this.builder.group({
        numero: [this.empleadoModificar.uiNumeroEmpleado,Validators.required],
        nombre: [this.empleadoModificar.sNombreUsuario,Validators.required],
        correo: [this.empleadoModificar.sCorreoUsuario,Validators.required],
        puesto: [this.empleadoModificar.sPuesto,Validators.required],
        uen: [this.empleadoModificar.sUEN,Validators.required],
        ubicacion: [this.empleadoModificar.iUbicacion,Validators.required],
      });
      this.internoExterno.get('eleccion')?.setValue(this.empleadoModificar.bInterno);
      this.GetUbicacionEmpleadoUpdate(this.empleadoModificar.iUbicacion);
      this.isLoadingResults = false;
      //this.opcionUbicacion = this.empleadoModificar.uiIdUicacion + "-" + this.empleadoModificar.sNombreUbicacion;
    });

    console.log(this.data);
    this.GetUbicacionesEmpleados();
    this.nombreEmpleadoUpdate = this.data.nomEmpleado;
  }

  private GetUbicacionesEmpleados()
  {
    this.saecService.GetUbicacionesEmpleados()
    .subscribe(ubicacioness=>{
      this.catalogoUbicaciones = ubicacioness; 
      
      this.filterubicaciones = this.myControlUbicacion.valueChanges.pipe(
        startWith(''),
        map(inmueble => (inmueble ? this._filterUbi(inmueble) : this.catalogoUbicaciones.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
    });
  }

  private GetUbicacionEmpleadoUpdate(uiIdUicacion: number)
  {
    this.saecService.GetUbicacionEmpleado(uiIdUicacion)
    .subscribe(ubicacion=>{
      this.opcionUbicacion = ubicacion.uiIdUicacion + "-" + ubicacion.sNombreUbicacion;
    });
  }

  private _filterUbi(value: string): admUbicacionesEmpleado[] {
    const filterValue = value.toLowerCase();

    return this.catalogoUbicaciones.filter(option => option.sNombreUbicacion.toLowerCase().includes(filterValue));
  }

  displayUbi(ubicacion: admUbicacionesEmpleado): string {
    return ubicacion ? ubicacion.sNombreUbicacion : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(): void{
    if(this.internoExterno.value['eleccion'] == null){
      this.Toast.fire({
        icon: 'error',
        title: 'Debe elegir si es externo o interno'
      });
    }else{
      Swal.fire({
        title: "¿Está seguro(a) de modificar este registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"
      }).then((result) => {
        if (result.isConfirmed) {
          this.arregloUbicacion = this.opcionUbicacion.split('-');
          let Employed = new admEmpleados();

          Employed.uiNumeroEmpleado = this.employed.value.numero;
          Employed.sNombreUsuario = this.employed.value.nombre;
          Employed.sCorreoUsuario = this.employed.value.correo;
          Employed.sPuesto = this.employed.value.puesto;
          Employed.sUEN = this.employed.value.uen;
          Employed.bInterno = this.internoExterno.value['eleccion'];
          Employed.iUbicacion = Number.parseInt(this.arregloUbicacion[0]);

          this.saecService.PutEmployedNew(Employed).subscribe(res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Usuario modificado exitosamente'
            });
            this.dialogRef.close(res);
          });  
        }
      });
    }
  }

  borrarSeleccionUbicacion()
  {
    this.opcionUbicacion = "";
  }

}
