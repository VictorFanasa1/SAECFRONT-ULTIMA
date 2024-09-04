import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { checkError } from 'src/app/core/functions/checkError';
import { asgEntregaLiberacion } from 'src/app/core/models/asgEntregaLiberacion.model';
import { asgMotivoLiberacion } from 'src/app/core/models/asgMotivoLiberacion.model';
import { catStatus } from 'src/app/core/models/catStatus.model';
import { catSubStatus } from 'src/app/core/models/catSubStatus.model';
import { addicional } from 'src/app/core/modelviews/addicional.model';
import { dispositivos } from 'src/app/core/modelviews/dispositivos.model';
import { SaecService } from 'src/app/core/services/saec.service';
import Swal from 'sweetalert2';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-liberar',
  templateUrl: './liberar.component.html',
  styleUrls: ['./liberar.component.scss'],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(2000, style({opacity: 1}))
      ]) 
    ])
  ]
})

export class LiberarComponent implements OnInit {

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

  uiAsiggment: Guid = Guid.createEmpty();
  inRealeseFijo = false;
  divice: dispositivos = new dispositivos();
  arAddicional: addicional[] = [];
  ProgressFijo = 0;
  mensaje = '';
  status: catStatus[] = [];
  substatus: catSubStatus[] = [];
  filterSubStatus: catSubStatus[] = [];
  entregas: asgEntregaLiberacion[] = [];
  motivos: asgMotivoLiberacion[] = [];
  namefiles: string[] = [];
  inProcess = false;

  frmLiberacion: FormGroup;

  constructor(
    private builder: FormBuilder,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private titleservice: Title
  ) {
    this.frmLiberacion = this.builder.group({
      uiAsiggment: [null, Validators.required],
      uiMotivo: [null,Validators.required],
      uiEntrega:[null,Validators.required],
      uiStatus: [null, Validators.required],
      uiSubStatus: [null, Validators.required],
      addicionals: builder.array([])
    });
  }

  ngOnInit(): void {
    this.titleservice.setTitle('Cargando...');
    this.route.queryParams
    .subscribe(params => {
      if(params.uiAsiggment !== undefined) {
        this.uiAsiggment = params.uiAsiggment;
      }
    });

    this.service.GetAllStatus()
    .subscribe(result => {
      result.splice(1,1);
      this.status = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.service.GetAllSubStatus()
    .subscribe(result => {
      result.splice(1,1);
      this.substatus = result;
      this.filterSubStatus = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.service.GetEntregas()
    .subscribe(result => {
      this.entregas = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.service.GetMotivos()
    .subscribe(result => {
      this.motivos = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });

    this.service.GetAsiggmentByUI(this.uiAsiggment)
    .subscribe(asg =>{
      this.frmLiberacion.patchValue({ uiAsiggment: asg.uiAsignacion });
      this.service.GetDiviceByUI(asg.uiRegistroEquipo)
      .subscribe(divice => {
        this.divice = divice;
        this.titleservice.setTitle('Liberando: ' + this.divice.sSerie);
      });

      this.service.GetAddicionalsByAsiigment(this.uiAsiggment)
      .subscribe(result => {
        result.map(addi => {
          this.AddAddicional(addi);
        })
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
    }, error => {
      checkError(error, this.router, this.snackBar);
    })

    this.frmLiberacion.controls.uiStatus.valueChanges
    .subscribe((result: number) => {
      if(result === 5) {
        this.filterSubStatus = this.substatus.filter(x => x.uiSubStatus >= 5);
      }

      if(result === 0){
        this.filterSubStatus = this.substatus;
      }

      if(result !== 0 && result !== 5) {
        this.filterSubStatus = this.substatus.filter(x => x.uiSubStatus === result);
        this.frmLiberacion.patchValue({ uiSubStatus : result });
      }

      for(let i = 0; i < this.addicionals.length; i++) {
        this.addicionals.controls[i].patchValue({ uiStatus: result });
      }
    });

    this.frmLiberacion.controls.uiSubStatus.valueChanges
    .subscribe(result => {
      for(let i = 0; i < this.addicionals.length; i++) {
        this.addicionals.controls[i].patchValue({ uiSubStatus: result });
      }
    })
  }

  get addicionals(): FormArray {
    return this.frmLiberacion.controls["addicionals"] as FormArray;
  }

  AddAddicional(addi: addicional) {
    const newaddi = this.builder.group({
      uiAddicional: [null, Validators.required],
      sType: [null, Validators.required],
      sBranch: [null, Validators.required],
      sModel: [null, Validators.required],
      sSerie: [null, Validators.required],
      sPlaca: [null],
      dtAssigment: [null, Validators.required],
      uiStatus: [1, Validators.required],
      uiSubStatus: [1, Validators.required],
    });

    newaddi.patchValue({ uiAddicional: addi.uiAddicional });
    newaddi.patchValue({ sType: addi.sType });
    newaddi.patchValue({ sBranch: addi.sBranch });
    newaddi.patchValue({ sModel: addi.sModel });
    newaddi.patchValue({ sSerie: addi.sSerie });
    newaddi.patchValue({ sPlaca: addi.sPlaca });
    newaddi.patchValue({ dtAssigment: addi.dtAssigment });

    newaddi.controls.uiStatus.valueChanges
    .subscribe((result: number) => {
      if(result !== 0 && result !== 5) {
        newaddi.patchValue({ uiSubStatus : result });
      }
    });

    this.addicionals.push(newaddi);
  }

  upLoadFiles(): void {
    this.namefiles = [];
    const evidenciaRH = document.getElementById('tracing-upload') as HTMLInputElement;
    const listaFilesRH = evidenciaRH.files;
    console.log("*************");
    console.log(evidenciaRH);
    console.log("*************");

    console.log("%%%%%%%%%%%%");
    console.log(listaFilesRH);
    console.log("%%%%%%%%%%%%");
    if (listaFilesRH !== null) {
      for(var i = 0; i < listaFilesRH.length; i++){
        this.namefiles.push(listaFilesRH[i].name);
      }
    }
  }

  Realese() {
    if(this.frmLiberacion.value["uiEntrega"] == null){
      this.Toast.fire({
        icon: 'warning',
        title: 'Falta elegir el tipo de entrega'
      });
    }else if(this.frmLiberacion.value["uiMotivo"] == null){
      this.Toast.fire({
        icon: 'warning',
        title: 'Falta elegir el motivo'
      });
    }else if(this.frmLiberacion.value["uiStatus"] == null){
      this.Toast.fire({
        icon: 'warning',
        title: 'Falta elegir el Status'
      });
    }else{
      this.inProcess = true;
      const evidenciaRH = document.getElementById('tracing-upload') as HTMLInputElement;
      const listaFilesRH = evidenciaRH.files;
      if (listaFilesRH !== null) {
        const element = listaFilesRH[0];
        if(listaFilesRH.length === 0) {
          this.Toast.fire({
            icon: 'warning',
            title: 'Debe agregar Soporte'
          });
          this.inProcess = false;
        } else {
          this.ReleseFile(element);
        }
      }
  
      else {
        this.inProcess = false;
        this.Toast.fire({
          icon: 'error',
          title: 'No se pudo evaluar la evidencia cargada'
        });
      }
    }
  }

  returnMoves(){
    this.router.navigate(['/movimientos']);
  }

  private Relese() {
    this.service.PostRealese(this.frmLiberacion.value)
    .subscribe(liberacion => {
      this.Toast.fire({
        icon: 'success',
        title: 'Equipo liberado'
      });
      setTimeout(() => {
        this.router.navigate(['/administracion/movimientos']);
      }, 3000);
    }, error => {
      this.inProcess = false;
      checkError(error, this.router, this.snackBar);
    });
  }

  private ReleseFile(element: File) {
    Swal.fire({
      title: "Está por liberar el equipo",
      text: "¿Desea continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.PostRealese(this.frmLiberacion.value)
        .subscribe(liberacion => {
          this.service.PostSupport(element, liberacion.uiLiberacion)
          .subscribe(result => {
            this.inProcess = false;
          }, error => {
            this.inProcess = false;
            checkError(error, this.router, this.snackBar);
          }, () => {
            this.Toast.fire({
              icon: 'success',
              title: 'Equipo liberado'
            });
            setTimeout(() => {
              this.router.navigate(['/administracion/movimientos']);
            }, 3000);
          });
        }, error => {
          this.inProcess = false;
          checkError(error, this.router, this.snackBar);
        });
      }else{
        this.inProcess = false;
      }
    });
    
  }
}
