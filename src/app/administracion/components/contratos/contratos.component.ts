import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { comercial } from 'src/app/core/modelviews/comercial.model';
import { catComercialProveedores } from 'src/app/core/models/catComercialProveedores.model';
import { catComercialArrendadores } from 'src/app/core/models/catComercialArrendadores.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { catComercial } from 'src/app/core/models/catComercial.model';
import { catProveedores } from 'src/app/core/models/catProveedores.model';
@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {

  frmContractProv: FormGroup;
  frmContractArr: FormGroup;
  ejecutando = false;
  ocerror = '';
  namefiles1: string[] = [];
  namefiles2: string[] = [];
  datacomercial: comercial = new comercial();
  datacomercialProv: catComercialProveedores = new catComercialProveedores();
  datacomercialArr: catComercialArrendadores = new catComercialArrendadores();
  typearr: any[] = [];
  ttlPz = 0;
  ttlPrice = 0;
  mostrarComercial = false;
  mostrarProv = false;
  mostrarArr = false;


  filteredOpOrden: Observable<catComercial[]>;
  controlOrden = new FormControl();

  filteredOpCprov: Observable<catComercialProveedores[]>;
  controlCprov = new FormControl();

  filteredOpCarr: Observable<catComercialArrendadores[]>;
  controlCarr = new FormControl();

  filteredOprov: Observable<catProveedores[]>;
  controlProv = new FormControl('', Validators.required);

  filteredOparr: Observable<catProveedores[]>;
  controlArr = new FormControl('', Validators.required);

  catalogoOrdenC: catComercial[] = [];
  opcionOrden: string = "";
  arregloOrdenC: string[] = [];

  catalogoCprov: catComercialProveedores[] = [];
  opcionCProv: any = "";
  arregloCProv: string[] = [];

  catalogoCarr: catComercialArrendadores[] = [];
  opcionCarr: any = "";
  arregloCArr: string[] = [];

  catalogoProv: catProveedores[] = [];
  opcionProv: string = "";
  arregloProv: string[] = [];

  catalogoArr: catProveedores[] = [];
  opcionArr: string = "";
  arregloArr: string[] = [];

  constructor(
    public builder: FormBuilder,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    this.filteredOpOrden = new Observable<catComercial[]>();
    this.filteredOpCprov = new Observable<catComercialProveedores[]>();
    this.filteredOpCarr = new Observable<catComercialArrendadores[]>();
    this.filteredOprov = new Observable<catProveedores[]>();
    this.filteredOparr = new Observable<catProveedores[]>();

    this.frmContractProv = this.builder.group({
      uiProveedor: this.controlProv,
      sContrato: ['', Validators.required],
      iFileProv: ['', Validators.required],
      uiComercial: ['00000000-0000-0000-0000-000000000000']
    })
    this.frmContractArr = this.builder.group({
      uiProveedor: this.controlArr,
      sContrato: ['', Validators.required],
      iVencimiento: ['', Validators.required],
      dtInicio: [null, Validators.required],
      dtFin: [null, Validators.required],
      uiTipoArrendamiento: ['', Validators.required],
      sArrendamiento: ['', Validators.required],
      iFileArr: ['', Validators.required],
      uiComercial: ['00000000-0000-0000-0000-000000000000']
      })
  }

  ngOnInit(): void {
    this.getOrdenes();
    this.getCProv();
    this.getCArr();
    this.getProv();
    this.getArr();
    this.service.GetTypeArr()
    .subscribe(result => {
     this.typearr = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
  }

  private _filterOrden(value: string): catComercial[] {
    const filterValue = value.toLowerCase();
      return this.catalogoOrdenC.filter(option => option.sFolioOrdenCompra.toString().toLowerCase().includes(filterValue));
  }

  private _filterCProv(value: string): catComercialProveedores[] {
    const filterValue = value.toLowerCase();
      return this.catalogoCprov.filter(option => option.sContrato.toString().toLowerCase().includes(filterValue));
  }

  private _filterCArr(value: string): catComercialArrendadores[] {
    const filterValue = value.toLowerCase();
      return this.catalogoCarr.filter(option => option.sContrato.toString().toLowerCase().includes(filterValue));
  }

  private _filterProv(value: string): catProveedores[] {
    const filterValue = value.toLowerCase();
      return this.catalogoProv.filter(option => option.sNombre.toString().toLowerCase().includes(filterValue));
  }

  private _filterArr(value: string): catProveedores[] {
    const filterValue = value.toLowerCase();
      return this.catalogoArr.filter(option => option.sNombre.toString().toLowerCase().includes(filterValue));
  }


  private getOrdenes()
  {
    this.service.GetAllOrdenes()
    .subscribe(orden=>{
      this.catalogoOrdenC = orden; 
      this.filteredOpOrden = this.controlOrden.valueChanges.pipe(
        startWith(''),
        map(ord => (ord ? this._filterOrden(ord) : this.catalogoOrdenC.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }

  private getCProv()
  {
    this.service.GetComercialAllContratoProv()
    .subscribe(cp=>{
      this.catalogoCprov = cp; 
      this.filteredOpCprov= this.controlCprov.valueChanges.pipe(
        startWith(''),
        map(ord => (ord ? this._filterCProv(ord) : this.catalogoCprov.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }

  private getCArr()
  {
    this.service.GetComercialAllContratoArr()
    .subscribe(carr=>{
      this.catalogoCarr = carr; 
      this.filteredOpCarr = this.controlCarr.valueChanges.pipe(
        startWith(''),
        map(ord => (ord ? this._filterCArr(ord) : this.catalogoCarr.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }

  private getProv()
  {
    this.service.GetAllTypeProv()
    .subscribe(prov=>{
      this.catalogoProv = prov; 
      this.filteredOprov = this.controlProv.valueChanges.pipe(
        startWith(''),
        map(prov => (prov ? this._filterProv(prov) : this.catalogoProv.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }

  private getArr()
  {
    this.service.GetAllTypeArr()
    .subscribe(arr=>{
      this.catalogoArr = arr; 
      this.filteredOparr = this.controlArr.valueChanges.pipe(
        startWith(''),
        map(ord => (ord ? this._filterArr(ord) : this.catalogoArr.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }


  upLoadFilesProv(): void {
    this.namefiles1 = [];
    const evidenciaRH1 = document.getElementById('tracing-upload-1') as HTMLInputElement;
    const listaFilesRH1 = evidenciaRH1.files;
    if (listaFilesRH1 !== null) {
      for(var i = 0; i < listaFilesRH1.length; i++){
        this.namefiles1.push(listaFilesRH1[i].name);
      }
    }
  }

  upLoadFilesArr(): void {
    this.namefiles2 = [];
    const evidenciaRH2 = document.getElementById('tracing-upload-2') as HTMLInputElement;
    const listaFilesRH2 = evidenciaRH2.files;
    if (listaFilesRH2 !== null) {
      for(var i = 0; i < listaFilesRH2.length; i++){
        this.namefiles2.push(listaFilesRH2[i].name);
      }
    }
  }


  SearchData() {
    let data = this.catalogoOrdenC.find(x => x.sFolioOrdenCompra === this.opcionOrden);
    if(data !== undefined) {
      this.service.GetComercialContractByUI(data.uiComercial)
      .subscribe(result => {
        //console.table(result)
        this.datacomercial = result;
        this.ocerror = result.sType;
        this.cleanProv(result);
        this.cleanArr(result);
        this.mostrarComercial = true;
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
    }
 }

 SearchContract(valor: any) {
  switch(valor){
    case 1:
      let vp = this.opcionCProv == "" ? this.snackBar.open('Seleccione un contrato a consultar.', 'Aceptar') : this.opcionCProv
          let valProv = vp.split('-');
          this.service.GetComercialAllContractByUIProv(valProv[0])
          .subscribe(result => {
            //console.table(result)
            this.mostrarComercial = false;
            this.mostrarArr = false;
            this.datacomercialProv = result;
            this.setProv(result);
            this.mostrarProv = true;
          }, error => {
            checkError(error, this.router, this.snackBar);
          });
    break;
    case 2:
      let varr = this.opcionCarr == "" ? this.snackBar.open('Seleccione un contrato a consultar.', 'Aceptar') : this.opcionCarr
          const valArr = varr.split('-');
          this.service.GetComercialAllContractByUIArr(valArr[0])
          .subscribe(result => {
            // console.table(result)
            this.mostrarComercial = false;
            this.mostrarProv = false;
            this.datacomercialArr = result;
            this.setArr(result);
            this.mostrarArr = true;
          }, error => {
            checkError(error, this.router, this.snackBar);
          });
    break;
  }
}

 PostContratosProv() {
  if(this.mostrarComercial !== false){
      this.ejecutando = true;
      const layoutclaimProv = document.getElementById('tracing-upload-1') as HTMLInputElement;
      const listlayoutProv = layoutclaimProv.files;
      if (listlayoutProv !== null) {
        if(listlayoutProv.length !== 0){
          const modifiedDetails = this.opcionProv.split('-');
          this.frmContractProv.patchValue({
            uiProveedor: modifiedDetails[0]
          });
          this.service.PostComercialContratoProv(this.frmContractProv.value)
          .subscribe(result => {
            if(result != null){
              this.snackBar.open('Se creo el número de contrato: ' + result.sContrato, 'Aceptar');
              for (let index = 0; index < listlayoutProv.length; index++) {
                this.service.PostDocumentContracts(listlayoutProv[index], result.uiComercial, 1)
                .subscribe(result =>{
                  this.frmContractProv.reset();
                  this.getCProv();
                  console.log('Se cargo el contrato');
                }, error => {
                  console.log(error);
                });
              }
            }else{
              this.ejecutando = false;
              this.snackBar.open('El folio del contrato ya existe.', 'Aceptar');
            }
          }, error => {
            checkError(error, this.router, this.snackBar);
          })
      }
      else{
        this.ejecutando = false;
        this.snackBar.open('Favor de cargar el archivo del contrato faltante.', 'Aceptar');
      }
    }
    else {
      this.ejecutando = false;
      this.snackBar.open('Favor de cargar el archivo del contrato faltante.', 'Aceptar');
    }
  }else{
      this.ejecutando = true;
      const layoutclaimProv = document.getElementById('tracing-upload-1') as HTMLInputElement;
      const listlayoutProv = layoutclaimProv.files;
      if (listlayoutProv !== null) {
        if(listlayoutProv.length !== 0){
          const modifiedDetails = this.opcionProv.split('-');
          this.frmContractProv.patchValue({
            uiProveedor: modifiedDetails[0]
          });
          this.service.PutComercialContratoProv(this.frmContractProv.value)
          .subscribe(result => {
              this.snackBar.open('Se actualizaron los datos del número de contrato: ' + result.sContrato, 'Aceptar');
              for (let index = 0; index < listlayoutProv.length; index++) {
                this.service.PutDocumentContracts(listlayoutProv[index], result.uiComercial, 1)
                .subscribe(result =>{
                  //this.frmContractProv.reset();
                  this.getCProv();
                  window.location.reload();
                  console.log('Se actualizo el contrato');
                }, error => {
                  console.log(error);
                });
              }
          }, error => {
            checkError(error, this.router, this.snackBar);
          })
      }
      else{
        this.ejecutando = false;
        this.snackBar.open('Favor de cargar el archivo del contrato faltante.', 'Aceptar');
      }
    }
    else {
      this.ejecutando = false;
      this.snackBar.open('Favor de cargar el archivo del contrato faltante.', 'Aceptar');
    }
  }
}


PostContratosArr() {
  if(this.mostrarComercial !== false){
      this.ejecutando = true;
      const layoutclaimArr = document.getElementById('tracing-upload-2') as HTMLInputElement;
      const listlayoutArr = layoutclaimArr.files;
      if (listlayoutArr !== null) {
        if(listlayoutArr.length !== 0){
          const modifiedDetails = this.opcionArr.split('-');
          this.frmContractArr.patchValue({
            uiProveedor: modifiedDetails[0]
          });
          this.service.PostComercialContratoArr(this.frmContractArr.value)
          .subscribe(result => {
            if(result != null){

              this.snackBar.open('Se creo el número de contrato: ' + result.sContrato, 'Aceptar');
              for (let index = 0; index < listlayoutArr.length; index++) {
                this.service.PostDocumentContracts(listlayoutArr[index], result.uiComercial, 2)
                .subscribe(result =>{
                  this.frmContractArr.reset();
                  this.getCArr();
                  console.log('Se cargo el contrato');
                }, error => {
                  console.log(error);
                });
              }
            }else{
              this.ejecutando = false;
              this.snackBar.open('El folio del contrato ya existe.', 'Aceptar');
            }
          }, error => {
            checkError(error, this.router, this.snackBar);
          })
      }
      else{
        this.ejecutando = false;
        this.snackBar.open('Favor de cargar el archivo del contrato faltante.', 'Aceptar');
      }
    }
    else {
      this.ejecutando = false;
      this.snackBar.open('Favor de cargar el archivo del contrato faltante.', 'Aceptar');
    }
  }else{
      this.ejecutando = true;
      const layoutclaimArr = document.getElementById('tracing-upload-2') as HTMLInputElement;
      const listlayoutArr = layoutclaimArr.files;
      if (listlayoutArr !== null) {
        if(listlayoutArr.length !== 0){
          const modifiedDetails = this.opcionArr.split('-');
          this.frmContractArr.patchValue({
            uiProveedor: modifiedDetails[0]
          });
          this.service.PutComercialContratoArr(this.frmContractArr.value)
          .subscribe(result => {
              this.snackBar.open('Se actualizaron los datos del número de contrato: ' + result.sContrato, 'Aceptar');
              for (let index = 0; index < listlayoutArr.length; index++) {
                this.service.PutDocumentContracts(listlayoutArr[index], result.uiComercial, 2)
                .subscribe(result =>{
                  //this.frmContractArr.reset();
                  this.getCArr();
                  window.location.reload();
                  console.log('Se cargo el contrato');
                }, error => {
                  console.log(error);
                });
              }
          }, error => {
            checkError(error, this.router, this.snackBar);
          })
      }
      else{
        this.ejecutando = false;
        this.snackBar.open('Favor de cargar el archivo del contrato faltante.', 'Aceptar');
      }
    }
    else {
      this.ejecutando = false;
      this.snackBar.open('Favor de cargar el archivo del contrato faltante.', 'Aceptar');
    }
  }
}

DownLoadFile(uiTipo: number) {
  let idreg = this.opcionCProv === "" ? this.opcionCarr : this.opcionCProv;
  const id = idreg.split('-');
  const uiRegistro = parseInt(id[0]);
  this.service.DownLoadFileComercialContract(uiRegistro, uiTipo)
  .subscribe(async result => {
    //console.log(result);
    const base64Response = await fetch(`data:${result.sType};base64,${result.btmFile}`);
    const blob = await base64Response.blob();
    const downloadURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = result.sFile;
    link.click();
  }, error => {
    checkError(error, this.router, this.snackBar);
  });
}

setProv(result:any){
  //console.log(result);
  this.frmContractProv.patchValue({
    uiComercial: result.uiComercial,
    sNombre: result.sNombre,
    sContrato: result.sContrato
  });
  this.opcionProv = result.uiProveedor + "-" + result.sNombre;
  this.frmContractProv.patchValue({
    uiProveedor: this.opcionProv
  });
}

setArr(result: any){
  //console.log(result)
  this.frmContractArr.patchValue({
    uiComercial: result.uiComercial,
    sNombre: result.sNombre,
    sContrato: result.sContrato,
    iVencimiento: result.iVencimiento,
    dtInicio: result.dtInicio,
    dtFin: result.dtFin,
    uiTipoArrendamiento: result.uiTipoArrendamiento,
    sArrendamiento: result.sArrendamiento
  });
  this.opcionArr = result.uiProveedor + "-" + result.sNombre;
  // console.log(this.opcionArr)
  this.frmContractArr.patchValue({
    uiProveedor: this.opcionArr
  });

}

cleanProv(result: any){
  this.frmContractProv.patchValue({
    uiComercial: result.uiComercial,
    uiProveedor: '',
    sNombre: '',
    sContrato: ''
  });
}

cleanArr(result: any){
  this.frmContractArr.patchValue({
    uiComercial: result.uiComercial,
    uiProveedor: '',
    sNombre: '',
    sContrato: '',
    iVencimiento: '',
    dtInicio: '',
    dtFin: '',
    uiTipoArrendamiento: '',
    sArrendamiento: ''
  });
}

}
