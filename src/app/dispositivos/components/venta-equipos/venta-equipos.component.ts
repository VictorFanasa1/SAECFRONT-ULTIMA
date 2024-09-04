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
  selector: 'app-venta-equipos',
  templateUrl: './venta-equipos.component.html',
  styleUrls: ['./venta-equipos.component.scss']
})
export class VentaEquiposComponent implements OnInit {

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
  //frmExternal: FormGroup;
  frmActivo: FormGroup;
  frmAdicional: FormGroup;
  frmAccesories: FormGroup;
  frmSoporte: FormGroup;
  ubicaciones: admUbicaciones[] = [];
  activosfijos: activofijo[] = [];
  adicionals: activofijo[] = [];
  filteractivos!: Observable<activofijo[]>;
  filteradicionals!: Observable<activofijo[]>;
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

  myControlUbicaciones = new FormControl('');
  admUbicEmp: admUbicacionesEmpleado = new admUbicacionesEmpleado();

  mostrarEmployed: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleservice: Title
  ) {
    this.frmAsigment = this.formbuilder.group({
      employed: [null, [Validators.required]],
    });
    this.frmActivo = this.formbuilder.group({
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

  }

  ngOnInit(): void {
    this.titleservice.setTitle('Venta');

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
      console.log("Los adicionales on:");
      console.log( this.adicionals);
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

    this.filteradicionals = this.frmAdicional.controls.divice.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAdi(value))
    );

    console.log("Las ubicaiones son:");

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
      console.log("valu de adi:" + value);
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
    this.saecService.GetEmployedByUi(number)
    .subscribe(result => {  
      this.employed = result;
      this.isLoadEmployed = false;
      this.titleservice.setTitle('Venta a ' + this.employed.sNombreUsuario);
      this.mostrarEmployed = true;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadEmployed = false;
    });

  }

  sendAssigment(event: Event): void {
    console.log("Entra a mandar venta");
    this.isAssigning = true;
    this.newAssigment = new assigment();
    event.preventDefault();
    // this.newAssigment.bExternal = this.frmAsigment.controls.external.value;
    // this.newAssigment.external = new newExternal();
    this.newAssigment.user = this.employed;
    console.log(this.employed);
    console.log("Ubica emple");
    console.log("trae device");
    // this.employed.iUbicacion = this.admUbicEmp.uiIdUicacion;
    // this.newAssigment.ubicacion = this.frmAsigment.controls.place.value.uiClaveEmpresa;
    console.log(this.frmActivo.controls.divice.value);
    this.newAssigment.activoFijo = this.frmActivo.controls.divice.value;
    //this.newAssigment.type = this.frmActivo.controls.type.value;
    this.newAssigment.adicionals = this.dataSource.data;
    this.newAssigment.accesories = this.frmAccesories.controls.accesories.value;
    this.newAssigment.support = new support();
    // this.newAssigment.support.sTicket = this.frmSoporte.controls.ticket.value;
    // this.newAssigment.support.sObservaciones = this.frmSoporte.controls.observaciones.value;
    console.log("esto mando a venta");
    console.log(this.newAssigment);
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
    this.saecService.PostSaleDevice(this.newAssigment)
    .subscribe(result => {
      //window.open(`http://portales.gf.grupofarmacos.net:5437/Asignaciones/ImpresionResponsiva/${result.uiAsignacion}`, '_blank')
      window.open(`https://aplicacion.fanasa.com/SaecResponsivas/Documentos/CartaResponsivaVentaDeQuipo?parametroSAEC=${result.uiAsigSaleDevice}`, '_blank')
      setTimeout(() => {
        this.snackBar.open("Se realizó la Venta del Equipo", "Aceptar", {
          duration: 5000,
        });
        location.reload();
      }
      , 8000);
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isAssigning = false;
    });
  }

  private AssigmentFile(element: File) {
    this.saecService.PostSaleDevice(this.newAssigment)
    .subscribe(result => {
      this.saecService.PostSupport(element, result.uiAsigSaleDevice)
      .subscribe(result => {
        this.isAssigning = false;
      }, error => {
        this.isAssigning = false;
        checkError(error, this.router, this.snackBar);
      });
      window.open(`https://aplicacion.fanasa.com/SaecResponsivas/Documentos/CartaResponsivaVentaDeQuipo?parametroSAEC=${result.uiAsigSaleDevice}`, '_blank')
      //window.open(`http://portales.gf.grupofarmacos.net:5437/Asignaciones/ImpresionResponsiva/${result.uiAsignacion}`, '_blank')
      setTimeout(() => {
        this.snackBar.open("Se realizó la Venta del Equipo", "Aceptar", {
          duration: 5000,
        });
        location.reload();
      }
      , 8000);
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isAssigning = false;
    });
  }
}
