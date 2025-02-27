import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { SaecService } from 'src/app/core/services/saec.service';
import { Guid } from 'guid-typescript';
import { equiposLiberados } from 'src/app/core/models/equiposLiberados';

import * as XLSX from 'xlsx';

export interface seriesInterfaz {
  serie: string,
  contador: number,
  estatus: boolean
}

@Component({
  selector: 'app-liberacion',
  templateUrl: './liberacion.component.html',
  styleUrls: ['./liberacion.component.scss']
})

export class LiberacionComponent implements OnInit {

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

  archivo: any;
  displayedColumns: string[] = ['serie', 'accion'];
  nombreArchivo: string = "";
  archivoElegido: string = "";
  contenidoArchivo: any;
  fileArch: any;
  isLoadingResults: boolean = false;
  listaSeries: seriesInterfaz[] = [];
  fileDocumento: File = {} as File;
  fileDocumentoPDF: File = {} as File;
  objetoSeries: Array<any> = [];
  modeloSerie: seriesInterfaz = {} as seriesInterfaz;
  validaTabla: boolean = false;
  contadorSerieSi = 1;
  contadorSerieNo = 1;
  contadorErrores = 0;
  contadorLista = 0;
  uiOrigin: Guid = Guid.create();
  equiposLiberados: any;
  uiLiberacion: Guid = Guid.create();
  listaSeriesSi: seriesInterfaz[] = [];
  listaSeriesNo: seriesInterfaz[] = [];
  arregloEjemplo = [
    {
      "codigo": "8H3TD3"
    },
    {
      "codigo": "9S2G6F"
    },
    {
      "codigo": "2P3J45"
    },
    {
      "codigo": "8S2H4K"
    },
    {
      "codigo": "5V37DS"
    }
  ];
  
  constructor(private router: Router, private saecService: SaecService) { }

  ngOnInit(): void {
  }

  guardarArchivo(event: any){
    this.fileArch = event.target.files[0];
    const reader = new FileReader();
    this.nombreArchivo = this.fileArch.name; 
    reader.readAsDataURL(this.fileArch);
    reader.onload = () => {
      this.archivo = reader.result;
    }
  }

  upLoadFile(id: string)
  {
    const docUp = document.getElementById(id) as HTMLInputElement
    const fileGet = docUp.files;
  
    if(fileGet !== null)
    {
      for (let i = 0; i < fileGet.length; i++) {
        this.fileDocumento = fileGet[i];       
      }
    }
  }

  uploadPDF(id: string){
    const docUp = document.getElementById(id) as HTMLInputElement
    const fileGet = docUp.files;
  
    if(fileGet !== null)
    {
      for (let i = 0; i < fileGet.length; i++) {
        this.fileDocumentoPDF = fileGet[i];       
      }
    }
  }

  subiArchivo(){
    this.isLoadingResults = true;
    if(this.fileDocumento.name == undefined){
      this.Toast.fire({
        icon: 'warning',
        title: 'Aún no carga ningún archivo'
      });
      this.isLoadingResults = false;
    }else{
      if(this.fileDocumento.name.includes(".csv") != true){
        this.Toast.fire({
          icon: 'warning',
          title: 'Debe subir un archivo válido (CSV)'
        });
        this.isLoadingResults = false;
      }else{
        //let nuevoArchivo = this.archivo.replace('data:text/csv;base64,','');
        this.saecService.GuardarObsoletos3(this.fileDocumento).subscribe(respuesta => {
          if(respuesta.length == 0){
            this.Toast.fire({
              icon: 'error',
              title: 'El archivo cargado se encuentra vacío'
            });
            this.isLoadingResults = false;
          }else{
            respuesta.forEach(element => {
              if(element.estatus == true){
                this.modeloSerie = {
                  serie: element.serie,
                  contador: this.contadorSerieSi,
                  estatus: element.estatus
                }
                this.listaSeriesSi.push(this.modeloSerie);
                this.contadorSerieSi++;
              }else{
                this.modeloSerie = {
                  serie: element.serie,
                  contador: this.contadorSerieNo,
                  estatus: element.estatus
                }
                this.listaSeriesNo.push(this.modeloSerie);
                this.contadorSerieNo++;
              }
              
            });


            
        
            this.validaTabla = true;
            this.isLoadingResults = false;
          }
        });
      }
    }
  }

  
  // enviarLiberados(){
  //   this.contadorErrores = 0;
  //   if(this.fileDocumentoPDF == undefined){
  //     this.Toast.fire({
  //       icon: 'warning',
  //       title: 'Falta subir su archivo PDF'
  //     });
  //   }else{
  //     if(this.fileDocumentoPDF.name.includes('.pdf') == false){
  //       this.Toast.fire({
  //         icon: 'success',
  //         title: 'El archivo anexo debe ser formato PDF'
  //       });
  //     }else{
  //       Swal.fire({
  //         title: "¿Está seguro de guardar estos registros como liberados?",
  //         showCancelButton: true,
  //         confirmButtonText: "Si"
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           this.isLoadingResults = true;
  //           this.listaSeries.forEach(element => {
  //             this.saecService.GuardarLiberados(element.serie).subscribe(res => {
  //               console.log(res);

  //               this.saecService.GuardarPDFLiberados(res.uiLiberacion, this.fileDocumentoPDF).subscribe(res => {
  //                 this.Toast.fire({
  //                   icon: 'success',
  //                   title: 'Liberación de equipos completada'
  //                 });  
  //                 this.isLoadingResults = false;
  //                 setTimeout(() => {
  //                   location.reload();
  //                 }, 3000);
  //               });

  //             });
  //           });
  //           // this.saecService.GuardarPDFLiberados(originGuid, this.fileDocumentoPDF).subscribe(res => {
  //           //   this.Toast.fire({
  //           //     icon: 'success',
  //           //     title: 'Liberación de equipos completada'
  //           //   });  
  //           //   this.isLoadingResults = false;
  //           //   setTimeout(() => {
  //           //     location.reload();
  //           //   }, 3000);
  //           // });
            
  //         }
  //       });
  //     }
  //   }
    
  // }

  enviarLiberados(){
    this.contadorErrores = 0;
    if(this.fileDocumentoPDF == undefined){
      this.Toast.fire({
        icon: 'warning',
        title: 'Falta subir su archivo PDF'
      });
    }else{
      if(this.fileDocumentoPDF.name.includes('.pdf') == false){
        this.Toast.fire({
          icon: 'success',
          title: 'El archivo anexo debe ser formato PDF'
        });
      }else{
        Swal.fire({
          title: "¿Está seguro de guardar estos registros como liberados?",
          showCancelButton: true,
          confirmButtonText: "Si"
        }).then((result) => {
          if (result.isConfirmed) {
            this.isLoadingResults = true;
            var originGuid = this.uiOrigin;
            this.listaSeriesSi.forEach(element => {
              this.saecService.GuardarLiberados(element.serie).subscribe(res => {
                this.equiposLiberados = res;
                console.log(res);
                console.log("sales de preliberados");
                //for (const [clave, valor] of Object.entries(this.equiposLiberados)) {
                  if (res.uiLiberacion.toString() !== '00000000-0000-0000-0000-000000000000') {
                    this.saecService.GuardarPDFLiberados(res.uiLiberacion, this.fileDocumentoPDF).subscribe(result => {
                      this.Toast.fire({
                        icon: 'success',
                        title: 'Liberación de equipos completada'
                      });  
                      this.isLoadingResults = false;
                      setTimeout(() => {
                        location.reload();
                      }, 3000);
                    });
                  //}
                }
              });
            });
            // this.Toast.fire({
            //   icon: 'success',
            //   title: 'Liberación de equipos completada'
            // });  
            // this.isLoadingResults = false;
            // setTimeout(() => {
            //   location.reload();
            // }, 3000);
          }
        });
      }
    }
    
  }


  descargaExcelPrueba(){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.arregloEjemplo);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SERIES');
    XLSX.writeFile(wb, 'Listado muestra de carga de archivo CSV.csv');
  }


  DeleteDocRequisitosSi(id: number)
  {
    const index = this.listaSeriesSi.findIndex(doc=> doc.contador === id);
    this.listaSeriesSi.splice(index,1);
    this.listaSeriesSi = [...this.listaSeriesSi];
 
    this.contadorSerieSi = 1;
    for (let index = 0; index <  this.listaSeriesSi.length; index++) {
      const element =  this.listaSeriesSi[index];
      element.contador = this.contadorSerieSi;
      this.contadorSerieSi++;
    }
  }

  DeleteDocRequisitosNo(id: number)
  {
    const index = this.listaSeriesNo.findIndex(doc=> doc.contador === id);
    this.listaSeriesNo.splice(index,1);
    this.listaSeriesNo = [...this.listaSeriesNo];
 
    this.contadorSerieNo = 1;
    for (let index = 0; index <  this.listaSeriesNo.length; index++) {
      const element =  this.listaSeriesNo[index];
      element.contador = this.contadorSerieNo;
      this.contadorSerieNo++;
    }
  }
  

}
