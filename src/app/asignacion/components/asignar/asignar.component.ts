import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { admUbicaciones } from 'src/app/core/models/admUbicaciones.model';
import { activofijo } from 'src/app/core/modelviews/activofijo.model';
import { map, startWith } from 'rxjs/operators';
import { SaecService } from 'src/app/core/services/saec.service';
import { catTipoAsignacion } from 'src/app/core/models/catTipoAsignacion.model';
import { admEmpleados } from 'src/app/core/models/admEmpleados.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catAccesorios } from 'src/app/core/models/catAccesorios.model';
import { checkError } from 'src/app/core/functions/checkError';
import { Router } from '@angular/router';
import { assigment } from 'src/app/core/modelviews/assigment.model';
import { support } from 'src/app/core/modelviews/support.model';
import { Title } from "@angular/platform-browser";
import { asgExternos } from 'src/app/core/models/asgExternos.modal';
import { newExternal } from 'src/app/core/modelviews/newExternal.model';
import Swal from 'sweetalert2';
import {admUbicacionesEmpleado} from './../../../core/models/admUbicacionesEmpleado'

@Component({
  selector: 'app-asignar',
  templateUrl: './asignar.component.html',
  styleUrls: ['./asignar.component.scss']
})
export class AsignarComponent implements OnInit {

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

  frmAsigment: FormGroup;
  frmExternal: FormGroup;
  frmActivo: FormGroup;
  frmAdicional: FormGroup;
  frmAccesories: FormGroup;
  frmSoporte: FormGroup;
  ubicaciones: admUbicaciones[] = [];
  activosfijos: activofijo[] = [];
  adicionals: activofijo[] = [];
  filteractivos!: Observable<activofijo[]>;
  filteradicionals!: Observable<activofijo[]>;
  filterubicaciones!: Observable<admUbicaciones[]>;
  accesories: catAccesorios[] = [];
  typesAsiggment: catTipoAsignacion[] = [];
  employed: admEmpleados = new admEmpleados();
  displayedColumns: string[] = ['Serie', 'Placa', 'Tipo', 'Marca', 'Modelo', 'Ubicacion', 'actions'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<activofijo> = new MatTableDataSource<activofijo>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  namefiles: string[] = [];
  newAssigment: assigment = new assigment();
  isLoadEmployed = false;
  isAssigning = false;
  isExternal = false;
  campoCorreoVacio: string = "";
  spinnerActivoFijo: Boolean = false;
  deshabilitarActivoFijo = false;
  serieNoEncontrado: number = 0;

  ubicacionesEmp: admUbicacionesEmpleado[] = [];
  filterubicacionesEmp!: Observable<admUbicacionesEmpleado[]>;
  myControlUbicaciones = new FormControl('');
  admUbicEmp: admUbicacionesEmpleado = new admUbicacionesEmpleado();

  constructor(
    private formbuilder: FormBuilder,
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleservice: Title
  ) {
    this.frmAsigment = this.formbuilder.group({
      employed: [null, [Validators.required]],
      place: ['', [Validators.required]],
      external: [false],
    });
    this.frmExternal = this.formbuilder.group({
      nombre: [''],
      correo: [''],
      compania: ['']
    });
    this.frmActivo = this.formbuilder.group({
      type: [null, [Validators.required, Validators.min(1)]],
      divice: [activofijo, Validators.required]
    });
    this.frmAdicional = this.formbuilder.group({
      divice: [null]
    });
    this.frmAccesories = this.formbuilder.group({
      accesories: [null]
    });
    this.frmSoporte = this.formbuilder.group({
      ticket: ['', Validators.required],
      observaciones: ['']
    });

    this.filterubicacionesEmp = new Observable<admUbicacionesEmpleado[]>();
  }

  ngOnInit(): void {
    this.titleservice.setTitle('Asignar');

    this.saecService.GetAllUbicacion()
    .subscribe( result => {
      this.ubicaciones = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.saecService.GetStockActivos()
    .subscribe(divices => {
      this.activosfijos = divices;
      console.log(divices);
      const divice = localStorage.getItem('diviceassig')?.toString();
      if(divice !== undefined) {
        localStorage.removeItem('diviceassig');
        let selectdivice = this.activosfijos.find(x => x.sSerie === divice);
        console.log("Serie es: " + divice);
        if(selectdivice !== undefined) {
          this.snackBar.open('Se está asignando la serie: ' + divice, 'Aceptar',{
            duration: 7000
          });
          this.frmActivo.patchValue({ divice: selectdivice });
        }
      }
      // else {
      //   alert("Mensaje de no se puede asignar equipo porque no está en Stock");
      // }
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.saecService.GetStockAdicionals()
    .subscribe(result => {
      this.adicionals = result;
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.saecService.GetTypesAsigments()
    .subscribe(types => {
      this.typesAsiggment = types;
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.saecService.GetAccesories()
    .subscribe(result => {
      this.accesories = result;
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.filteractivos = this.frmActivo.controls.divice.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filterubicaciones = this.frmAsigment.controls.place.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUbi(value))
    );

    this.filteradicionals = this.frmAdicional.controls.divice.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAdi(value))
    );

    this.getUbicacionesEmpleado();
    console.log("Las ubicaiones son:");
    console.log(this.ubicacionesEmp);

  }

  private _filterUbiEmp(value: string): admUbicacionesEmpleado[] {
    const filterValue = value.toString().toUpperCase();
    return this.ubicacionesEmp.filter(option => option.sNombreUbicacion.toString().toUpperCase().includes(filterValue));
  }
  
  displayUbiEmp(ubicacion: admUbicacionesEmpleado): string {
    return ubicacion ? ubicacion.sNombreUbicacion : '';
  }

  private _filter(value: string): activofijo[] {
    const filterValue = value.toString().toUpperCase();
    return this.activosfijos.filter(option => option.sSerie.toString().toUpperCase().includes(filterValue));
  }

  private _filterUbi(value: string): admUbicaciones[] {
    const filterValue = value.toString().toUpperCase();
    return this.ubicaciones.filter(option => option.sNombre.toString().toUpperCase().includes(filterValue));
  }

  private _filterAdi(value: string): activofijo[] {
    if(value !== null){
      const filterValue = value.toString().toUpperCase();
      return this.adicionals.filter(option => option.sSerie.toString().toUpperCase().includes(filterValue));
    }
    else {
      return this.adicionals;
    }
  }

  displayActivo(division: activofijo): string {
    console.log("entra en serie");
    console.log(division);
    if(division === null){
      console.log("entra en serie 2");
      this.Toast.fire({
        icon: 'error',
        title: 'Este número de serie no se encuentra en Stock'
      });
      return '';
    }else{
      console.log("entra en serie3");
      return division ? division.sSerie : '';
    }
  }

  displayUbi(ubicacion: admUbicaciones): string {
    return ubicacion ? ubicacion.sNombre : '';
  }

  private getUbicacionesEmpleado()
  {
    this.saecService.GetUbicacionesEmpleados().subscribe(result => {
      this.ubicacionesEmp = result;
      console.log("ubicaciones de servicio");
      console.log(this.ubicacionesEmp);

      this.filterubicacionesEmp = this.myControlUbicaciones.valueChanges.pipe(
        startWith(''),
        map(ubicacion => (ubicacion ? this._filterUbiEmp(ubicacion) : this.ubicacionesEmp.slice())),
      );

    });
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

  agregarCorreoDeCampoVacio(){
    if(this.employed.sCorreoUsuario == "")
      {
        this.employed.sCorreoUsuario = this.campoCorreoVacio;
      }
  }

  addAdicional() {
    var encontro = this.dataSource.data.find(x=> x.sSerie === this.frmAdicional.controls.divice.value.sSerie);
    if(encontro !== undefined){
      this.snackBar.open('Esta Serie ya se encuentra en la tabla.', 'Aceptrar', {
        duration: 5000
      });
      this.frmAdicional.reset();
    }

    else {
      this.dataSource.data.push(this.frmAdicional.controls.divice.value);
      this.dataSource._updateChangeSubscription();
      this.frmAdicional.reset();
    }
  }

  removeAdicional(index: number) {
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }

  searchEmployed(number: string) {
    this.isLoadEmployed = true;
    this.saecService.GetUserData(number)
    .subscribe(result => {  
      this.employed = result;
      this.isLoadEmployed = false;
      this.titleservice.setTitle('Asignando a ' + this.employed.sNombreUsuario);
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadEmployed = false;
    });
  }

  sendAssigment(event: Event): void {
    console.log("Entra a mandar asignación");
    this.isAssigning = true;
    this.newAssigment = new assigment();
    event.preventDefault();
    this.newAssigment.bExternal = this.frmAsigment.controls.external.value;
    this.newAssigment.external = new newExternal();
    this.newAssigment.external.sNombre = this.frmExternal.controls.nombre.value;
    this.newAssigment.external.sCorreo = this.frmExternal.controls.correo.value;
    this.newAssigment.external.sCompania = this.frmExternal.controls.compania.value;
    this.newAssigment.user = this.employed;
    console.log(this.employed);
    console.log(this.campoCorreoVacio);
    console.log("Ubica emple");
    console.log(this.admUbicEmp);
    this.employed.iUbicacion = this.admUbicEmp.uiIdUicacion;
    if(this.employed.sCorreoUsuario == "")
      {
        this.employed.sCorreoUsuario = this.campoCorreoVacio;
      }
    this.newAssigment.ubicacion = this.frmAsigment.controls.place.value.uiClaveEmpresa;
    this.newAssigment.activoFijo = this.frmActivo.controls.divice.value;
    this.newAssigment.type = this.frmActivo.controls.type.value;
    this.newAssigment.adicionals = this.dataSource.data;
    this.newAssigment.accesories = this.frmAccesories.controls.accesories.value;
    this.newAssigment.support = new support();
    this.newAssigment.support.sTicket = this.frmSoporte.controls.ticket.value;
    this.newAssigment.support.sObservaciones = this.frmSoporte.controls.observaciones.value;
    const evidenciaRH = document.getElementById('tracing-upload') as HTMLInputElement;
    const listaFilesRH = evidenciaRH.files;
    if (listaFilesRH !== null) {
      const element = listaFilesRH[0];
      if(listaFilesRH.length === 0) {
        this.Assigment();
      }

      else {
        this.AssigmentFile(element);
      }
    }

    else {
      this.Assigment();
    }
  }


  validandoSerieEnLista(){
    this.serieNoEncontrado = 0;
    this.deshabilitarActivoFijo = true;
    this.spinnerActivoFijo = true;
    setTimeout(() => {
      
      if(this.frmActivo.controls.divice.value.sPlaca=== undefined && this.frmActivo.controls.divice.value.sPlaca!== ""){
        this.Toast.fire({
          icon: 'error',
          title: 'Este número de serie no se encuentra en Stock'
        });
        this.deshabilitarActivoFijo = false;
        this.spinnerActivoFijo = false;
      }else{
        this.deshabilitarActivoFijo = false;
        this.spinnerActivoFijo = false;
      }
    }, 200);
  }
  

  private Assigment() {
    this.saecService.PostAssigment(this.newAssigment)
    .subscribe(result => {
      //window.open(`http://portales.gf.grupofarmacos.net:5437/Asignaciones/ImpresionResponsiva/${result.uiAsignacion}`, '_blank')
      window.open(`https://aplicacion.fanasa.com/SaecResponsivas/Documentos/CartaResponsivaDeEquipoDeComputo?parametroSAEC=${result.uiAsignacion}`, '_blank')
      setTimeout(() => {
        location.reload();
      }
      , 5000);
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isAssigning = false;
    });
  }

  private AssigmentFile(element: File) {
    this.saecService.PostAssigment(this.newAssigment)
    .subscribe(result => {
      this.saecService.PostSupport(element, result.uiAsignacion)
      .subscribe(result => {
        this.isAssigning = false;
      }, error => {
        this.isAssigning = false;
        checkError(error, this.router, this.snackBar);
      });
      window.open(`https://aplicacion.fanasa.com/SaecResponsivas/Documentos/CartaResponsivaDeEquipoDeComputo?parametroSAEC=${result.uiAsignacion}`, '_blank')
      //window.open(`http://portales.gf.grupofarmacos.net:5437/Asignaciones/ImpresionResponsiva/${result.uiAsignacion}`, '_blank')
      setTimeout(() => {
        location.reload();
      }
      , 5000);
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isAssigning = false;
    });
  }
}

