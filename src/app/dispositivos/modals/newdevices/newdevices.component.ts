import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { checkError } from 'src/app/core/functions/checkError';
import { catComercial } from 'src/app/core/models/catComercial.model';
import { catGeneral } from 'src/app/core/models/catGeneral.model';
import { comercial } from 'src/app/core/modelviews/comercial.model';
import { SaecService } from 'src/app/core/services/saec.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-newdevices',
  templateUrl: './newdevices.component.html',
  styleUrls: ['./newdevices.component.scss']
})
export class NewdevicesComponent implements OnInit {
  frmDevice: FormGroup;
  ocerror = '';
  ejecutando = false;
  jsonData = []


  filteredOpMarca: Observable<catGeneral[]>;
  controlMarca  = new FormControl('', Validators.required);

  catalogoMarca: catGeneral[] = [];
  opcionMarca: string = "";
  arregloMarca: string[] = [];

  filteredOpModel: Observable<catGeneral[]>;
  controlModel = new FormControl(null, Validators.required);

  catalogoModel: catGeneral[] = [];
  arregloModel: string[] = [];


  filteredOpType: Observable<catGeneral[]>;
  controlType = new FormControl(null, Validators.required);

  catalogoType: catGeneral[] = [];
  arregloType: string[] = [];

  constructor(
    public builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, uiremision:Guid, sempleado: number },
    public dialogref: MatDialogRef<NewdevicesComponent>,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    this.filteredOpMarca = new Observable<catGeneral[]>();
    this.filteredOpModel = new Observable<catGeneral[]>();
    this.filteredOpType = new Observable<catGeneral[]>();


    this.frmDevice = this.builder.group({
      uiRegistroEquipo: [Guid],
      uiRemision: this.data.uiremision,
      uiTipoEquipo: this.controlType,
      uiTipoEquipoS: "",
      sMarca: "",
      sModelo: "",
      uiMarca: this.controlMarca,
      uiModelo: this.controlModel,
      sSerie: ['', Validators.required],
      sPlaca: ['', Validators.required],
      uiNumeroEmpleado: this.data.sempleado,
      sStatus: 1,
      SubStatus: 1,
      details: this.builder.array([]),
      sTipoRegistro: 0
    })
  }

  ngOnInit(): void {
    this.getOrdenes();
    this.getModels();
    this.getTypes();

  }

  private _filterMarca(value: string): catGeneral[] {
    const filterValue = value.toLowerCase();
      return this.catalogoMarca.filter(optmarca => optmarca.sNombre.toString().toLowerCase().includes(filterValue));
  }

  private _filterModel(value: string): catGeneral[] {
    const filterValue = value.toLowerCase();
      return this.catalogoModel.filter(optmodel => optmodel.sNombre.toString().toLowerCase().includes(filterValue));
  }

  private _filterType(value: string): catGeneral[] {
    const filterValue = value.toLowerCase();
      return this.catalogoType.filter(optype => optype.sNombre.toString().toLowerCase().includes(filterValue));
  }

  private getOrdenes()
  {
    this.service.GetAllMarcas()
    .subscribe(marca=>{
      this.catalogoMarca = marca;
      this.filteredOpMarca = this.controlMarca.valueChanges.pipe(
        startWith(''),
        map(marc => (marc ? this._filterMarca(marc) : this.catalogoMarca.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }

  private getModels()
  {
    this.service.GetAllModelos()
    .subscribe(model=>{
      this.catalogoModel = model;
      this.filteredOpModel = this.controlModel.valueChanges.pipe(
        startWith(''),
        map(mod => (mod ? this._filterModel(mod) : this.catalogoModel.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }

  private getTypes()
  {
    this.service.GetAllTipoEquipo()
    .subscribe(type=>{
      this.catalogoType = type;
      this.filteredOpType = this.controlType.valueChanges.pipe(
        startWith(''),
        map(typ => (typ ? this._filterType(typ) : this.catalogoType.slice())),
      );
    }, error=>{
      checkError(error, this.router, this.snackBar);
     });
  }

  get details(): FormArray {
    return this.frmDevice.controls["details"] as FormArray;
  }

  AddDetail(): void {
      const detail = this.builder.group({
        uiRegistroEquipo: [Guid],
        uiRemision: this.data.uiremision,
        uiTipoEquipo: ['', Validators.required],
        uiMarca: ['', Validators.required],
        uiModelo: ['', Validators.required],
        sSerie: ['', Validators.required],
        sPlaca: ['', Validators.required],
        uiNumeroEmpleado: this.data.sempleado,
        sStatus: 1,
        SubStatus: 1
      });
      this.details.push(detail);
  }


  PostDevice(){
        this.ejecutando = true;
        const tequipo = this.frmDevice.value.uiTipoEquipo.split('-');
        const marca = this.frmDevice.value.uiMarca.split('-');
        const modelo = this.frmDevice.value.uiModelo.split('-');
        const modifiedDetails = this.frmDevice.value.details.map((detail: {
          uiTipoEquipo: any; uiMarca: string; uiModelo: string; }) => {
          const tequipom = detail.uiTipoEquipo.split('-');
          const marcam = detail.uiMarca.split('-');
          const modelom = detail.uiModelo.split('-');
          let uiTipoEquipo= tequipom[0];
          let uiMarca = marcam[0];
          let uiModelo = modelom[0];
          return {
            ...detail,
            uiTipoEquipo,
            uiMarca,
            uiModelo
          };
        });
        this.frmDevice.patchValue({
          uiTipoEquipo: tequipo[0],
          uiMarca: marca[0],
          uiModelo: modelo[0],
          details: modifiedDetails
        });
        console.log(this.frmDevice.value);
        this.service.PostDevice(this.frmDevice.value)
        .subscribe(result => {
          if(result != null){
            //console.log(result);
            this.dialogref.close();
            this.snackBar.open('Se agrego el dispositivo correctamente!', 'Aceptar');
          }else{
            this.ejecutando = false;
            this.snackBar.open('El dispositivo ya existe.', 'Aceptar');
          }
        }, error => {
          checkError(error, this.router, this.snackBar);
        })
  }

  DivicesAll(){
    //console.log(this.data.uiremision)
    //console.log([Guid])
    //console.log(this.jsonData)
    this.jsonData.forEach((row: any) => {
      const marca = row['Marca'];
      const modelo = row['Modelo'];
      const placa = row['Placa'];
      const serie = row['Serie'];
      const tipoEquipo = row['TipoEquipo'];
      this.frmDevice.patchValue({
        sSerie: serie,
        sPlaca: placa,
        sMarca: marca,
        sModelo: modelo, 
        uiMarca: 0,
        uiModelo: 0,
        uiTipoEquipo: 0,
        uiTipoEquipoS: tipoEquipo,
        sTipoRegistro: 1
      })
      console.log(this.frmDevice.value)
      this.service.PostDevice(this.frmDevice.value)
        .subscribe(result => {
          if(result != null){
            //console.log(result);
            this.dialogref.close();
            this.snackBar.open('Se agrego el dispositivo correctamente!', 'Aceptar');
          }else{
            this.ejecutando = false;
            this.snackBar.open('El dispositivo ya existe.', 'Aceptar');
          }
        }, error => {
          checkError(error, this.router, this.snackBar);
        })
    });
  }
  
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
  
      fileReader.onload = (e: any) => {
        const binaryData = e.target.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        this.jsonData = XLSX.utils.sheet_to_json(sheet);
  
        console.log(this.jsonData); 
      };
    }
  }

}
