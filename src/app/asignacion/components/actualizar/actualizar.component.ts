import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { checkError } from 'src/app/core/functions/checkError';
import { admEmpleados } from 'src/app/core/models/admEmpleados.model';
import { asgAsignaciones } from 'src/app/core/models/asgAsignaciones.model';
import { addicional } from 'src/app/core/modelviews/addicional.model';
import { dispositivos } from 'src/app/core/modelviews/dispositivos.model';
import { employedassigment, employedassigments } from 'src/app/core/modelviews/employedassigments.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { AssigmentsComponent } from 'src/app/shared/modals/assigments/assigments.component';
import { EmployedValid } from 'src/app/shared/utils/EmployedValid';
import { DatePipe } from '@angular/common';
import { Guid } from 'guid-typescript';
import { asgExternos } from 'src/app/core/models/asgExternos.modal';
import { assigment } from 'src/app/core/modelviews/assigment.model';
import { AddicionalsComponent } from '../../modals/addicionals/addicionals.component';
import { catAccesorios } from 'src/app/core/models/catAccesorios.model';
import { db } from 'src/app/core/database/saec';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss']
})

export class ActualizarComponent implements OnInit {

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

  frmEmployed: FormGroup;
  frmPutEmployed: FormGroup;
  frmExternal: FormGroup;
  frmAccesories: FormGroup;
  frmAssigment: FormGroup;
  Employeds: admEmpleados[] = [];
  Employed: admEmpleados = new admEmpleados();
  filterEmployeds!: Observable<admEmpleados[]>;
  asiggments: employedassigments = new employedassigments();
  isSelected = false;
  isExternal = false;
  divice: dispositivos = new dispositivos();
  asiggment: asgAsignaciones = new asgAsignaciones();
  addicionals: addicional[] = [];
  accesorios: catAccesorios[] = [];
  isAccesories = false;
  isEmployed = false;
  isLoadingResults = false;
  esExterno: Boolean = false;
  folioAsignacion: any;

  constructor(
    private formbuilder: FormBuilder,
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private titleservice: Title
  ) {
    this.frmEmployed = this.formbuilder.group({
      employed: ['', [Validators.required]]
    });
    this.frmPutEmployed = this.formbuilder.group({
      number: [Validators.required, Validators.min(1)],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      puesto: ['', [Validators.required]],
      place: ['', [Validators.required]],
      uen: ['', Validators.required]
    });
    this.frmExternal = this.formbuilder.group({
      uiResponsable: ['00000000-0000-0000-0000-000000000000'],
      uiAsignacion: ['00000000-0000-0000-0000-000000000000'],
      sNombre: ['', Validators.required],
      sCorreo: [''],
      sCompañia: [''],
      uiUbicacion: ['']
    });
    this.frmAccesories = this.formbuilder.group({
      uiAssigment: [],
      accesories: []
    });
    this.frmAssigment = this.formbuilder.group({
      sTicket: [''],
      sComment: ['']
    });
    this.divice.sTipo = "";
    this.divice.sMarca = "";
    this.divice.sModelo = "";
    this.divice.sSerie = "";
    this.divice.sPlaca = "";
    this.divice.sEstatus = "";
    this.divice.sSubEstatus = "";
    this.divice.uiUbicacion = "";
    this.divice.sResponsable = "";
  }

  ngOnInit(): void {
    this.titleservice.setTitle('Cargando...');
    this.saecService.GetAllNameEmail()
    .subscribe(result => {
      this.Employeds = result;
      this.titleservice.setTitle('Actualizar');
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.titleservice.setTitle('ERROR');
    });
    this.saecService.GetAccesories()
    .subscribe(result => {
      this.accesorios = result;
    })
    this.filterEmployeds = this.frmEmployed.controls.employed.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEmployeds(value))
    );
  }

  private _filterEmployeds(value: string): admEmpleados[] {
    const filterValue = value.toString().toUpperCase();
    return this.Employeds.filter(option => option.uiNumeroEmpleado.toString().toUpperCase().includes(filterValue));
  }

  displayEmployed(employed: admEmpleados): string {
    if(employed === null)
    {
      return '';
    }
    else{
      return employed ? employed.sNombreUsuario : '';
    }
  }

  searchEmpoyed() {
    if(this.frmEmployed.controls.employed.value == ""){
      this.Toast.fire({
        icon: 'warning',
        title: 'Llene el recuadro con el número de empleado correspondiente'
      });
    }else{
      this.saecService.GetEmployedByUi(this.frmEmployed.controls.employed.value)
    .subscribe(employed => {
      this.frmPutEmployed.patchValue({ number: employed.uiNumeroEmpleado });
      this.frmPutEmployed.patchValue({ name: employed.sNombreUsuario });
      this.frmPutEmployed.patchValue({ email: employed.sCorreoUsuario });
      this.frmPutEmployed.patchValue({ puesto: employed.sPuesto });
      this.frmPutEmployed.patchValue({ place: employed.uiUbicacion });
      this.frmPutEmployed.patchValue({ uen: employed.sUEN });
      this.isSelected = true;
      this.saecService.GetEmployedAssigments(employed.uiNumeroEmpleado.toString())
      .subscribe(result1 => {
        this.asiggments = result1;
        console.log(this.asiggments);
        const dialogRef = this.dialog.open(AssigmentsComponent, {
          maxWidth: '700px',
          width: '100%',
          data: this.asiggments
        });
    
        dialogRef.afterClosed().subscribe(result2 => {
          if(result2 !== undefined) {
            this.saecService.GetDiviceBySerie(result2)
            .subscribe(result3 => {
              this.divice = result3;
              
              this.titleservice.setTitle('Actualizar: ' + this.divice.sSerie);
              this.saecService.GetUIAsigment(this.divice.sSerie, this.frmPutEmployed.controls.number.value)
              .subscribe(result4 => {
                this.asiggment = result4;
                this.saecService.GetAddicionalsByAsiigment(this.asiggment.uiAsignacion)
                .subscribe(result5 => {
                  this.addicionals = result5;
                });
                this.saecService.GetAccesoriesByUI(this.asiggment.uiAsignacion)
                .subscribe(accesories => {
                  this.frmAccesories.patchValue( { uiAssigment: this.asiggment.uiAsignacion } )
                  this.frmAccesories.patchValue( { accesories: accesories } )
                }, error => {
                  checkError(error, this.router, this.snackBar);
                });
                this.saecService.GetExrnalByUI(this.asiggment.uiAsignacion)
                .subscribe(result6 => {
                  this.isExternal = true;
                  this.frmExternal.patchValue({
                    uiResponsable: result6.uiResponsable,
                    uiAsignacion: result6.uiAsignacion,
                    sNombre: result6.sNombre,
                    sCorreo: result6.sCorreo,
                    sCompañia: result6.sCompañia,
                    uiUbicacion: result6.uiUbicacion
                  });
                }, error=> {
                  this.isExternal = false;
                  this.frmExternal.patchValue({
                    uiAsignacion: this.asiggment.uiAsignacion
                  });
                });
              })
            }, error => {
              checkError(error, this.router, this.snackBar);
            })
          }
        });
  
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
    }, error => {

    });
  }
  }

  saveEmployed() {
    this.isEmployed = true;
    this.Employed = new admEmpleados();
    this.Employed.sEstatus = 'Activo';
    this.Employed.sCorreoUsuario = this.frmPutEmployed.controls.email.value;
    this.Employed.sNombreUsuario = this.frmPutEmployed.controls.name.value;
    this.Employed.sPuesto = this.frmPutEmployed.controls.puesto.value;
    this.Employed.sUEN = this.frmPutEmployed.controls.uen.value;
    this.Employed.bInterno = true;
    this.Employed.uiUbicacion = this.frmPutEmployed.controls.place.value;
    this.Employed.uiNumeroEmpleado = this.frmPutEmployed.controls.number.value;
    this.saecService.PutEmployed(this.Employed)
    .subscribe(result => {
      this.snackBar.open('Se actualizó la información del empleado', 'Aceptar', {
        duration: 5000
      });
      this.isEmployed = false;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isEmployed = false;
    });
  }

  ShowExternal(event: any) {
    this.isExternal = !this.isExternal;
  }

  SaveExternal() {
    if(this.frmExternal.controls.uiResponsable.value === '00000000-0000-0000-0000-000000000000') {
      this.saecService.PostExternal(this.frmExternal.value)
      .subscribe(result => {
        this.snackBar.open('Se agregó el externo: ' + result.sNombre, 'Aceptar', {
          duration: 10000
        });
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
    }

    else {
      this.saecService.PutExternal(this.frmExternal.value)
      .subscribe(result => {
        this.snackBar.open('Se actualizó el externo: ' + result.sNombre, 'Aceptar', {
          duration: 10000
        });
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
    }
  }

  DeleteExternal() {
    if(confirm(`¿Está seguro de eliminar el externo? Esta acción no se puede revertir.`)) {
      this.saecService.DeleteExternal(this.frmExternal.value)
      .subscribe(result=> {
        this.isExternal = !this.isExternal;
        this.frmExternal.patchValue({
          uiResponsable: '00000000-0000-0000-0000-000000000000',
          uiAsignacion: this.asiggment.uiAsignacion,
          sNombre: '',
          sCorreo: '',
          sCompañia: '',
          uiUbicacion: ''
        });
      }, error => {
        checkError(error,this.router,this.snackBar);
      });
    }
  }

  AssigmentAddcional() {
    const resultM = this.dialog.open(AddicionalsComponent, {
      data: this.asiggment.uiAsignacion,
      maxWidth: '400px',
      width: '100%'
    });

    resultM.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.addicionals.push(result);
      }
    });
  }

  LiberarDivice(sSerie: string, uiAddicional: number, iPosition: number) {
    if(confirm(`Está por liberar la Serie: ${sSerie}, esto se quedará registrado en el expediente del mismo ¿Está de acuerdo?`)) {
      this.saecService.RealeseAddicional(uiAddicional)
      .subscribe(result => {
        const datepipe: DatePipe = new DatePipe('en-US')
        let formattedDate = datepipe.transform(result.dtFechaLiberacion, 'dd-MM-yyyy HH:mm:ss')
        this.snackBar.open(`Se liberó la serie: ${sSerie}, el día: ${formattedDate}`, 'Aceptar', {verticalPosition: 'top'});
        this.addicionals.splice(iPosition, 1);
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
    }
  }

  SaveAccesories(){
    this.isLoadingResults = true;
    this.isAccesories = true;
    this.saecService.PostAccesories(this.frmAccesories.value)
    .subscribe(result => {
      this.snackBar.open('Los accesorios ahora son: ' + result.length, 'Aceptar', {
        duration: 7000
      });
      this.isAccesories = false;
      this.isLoadingResults = false;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isAccesories = false;
      this.isLoadingResults = false;
    });
  }

  ConfirmUpdate(uiAsiggment: Guid, e: Event) {
    e.preventDefault();
    Swal.fire({
      title: "Se aplicaran los cambios al Ticket y las Observaciones",
      text: "¿Está seguro de mandar la responvisa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        //this.saecService.PutAssgiment(uiAsiggment, this.frmAssigment.value)
        this.saecService.PutAssgiment(uiAsiggment, this.frmAssigment.value)
        .subscribe(result => {
          //this.snackBar.open(`Se envió la Responsiva.`, 'Aceptar', {verticalPosition: 'top'});
          this.Toast.fire({
            icon: 'success',
            title: 'Responsiva enviada'
          });
          window.open(`https://aplicacion.fanasa.com/SaecResponsivas/Documentos/CartaResponsivaDeEquipoDeComputo?parametroSAEC=${uiAsiggment}`, '_blank')
          setTimeout(() => {
            location.reload();
          }, 3000);
        }, error => {
          checkError(error, this.router, this.snackBar);
        });
      }
    });
  }


  regresaBusqueda(){
    this.isSelected = false;
  }
}
