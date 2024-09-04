import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { datauploaddoc } from 'src/app/core/modelviews/datauploaddoc.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-uploaddoc',
  templateUrl: './uploaddoc.component.html',
  styleUrls: ['./uploaddoc.component.scss']
})
export class UploaddocComponent implements OnInit {

  urldoc: string = '';
  namefiles: string[] = [];
  inProccess = false;

  constructor(
    public dialogRef: MatDialogRef<UploaddocComponent>,
    @Inject(MAT_DIALOG_DATA) public data: datauploaddoc,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if(this.data.sType === 'Responsiva') {
      this.urldoc = 'http://portales.gf.grupofarmacos.net:5437/Asignaciones/ImpresionResponsiva/' + this.data.uiOrigen;
    }

    if(this.data.sType === 'Liberación') {
      this.urldoc = 'http://portales.gf.grupofarmacos.net:5437/Administracion/ImpresionLiberacion/' + this.data.uiOrigen;
    }
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

  downLoadResponsivi() {
    this.service.DownLoadResponsiva(this.data.uiOrigen)
    .subscribe(async result => {
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

  Upload(): void {
    this.inProccess = true;
    if(this.data.sType === 'Responsiva') {
      const evidenciaRH = document.getElementById('tracing-upload') as HTMLInputElement;
      const listaFilesRH = evidenciaRH.files;
      if (listaFilesRH !== null) {
        this.service.PostResponsiva(listaFilesRH[0], this.data.uiOrigen)
        .subscribe(result => {
          this.inProccess = false;
          this.dialogRef.close(true);
        }, error => {
          checkError(error, this.router, this.snackBar);
          this.inProccess = false;
        });
      }
    }

    if(this.data.sType === 'Liberación') {
      this.inProccess = false;
      this.urldoc = 'http://portales.gf.grupofarmacos.net:5437/Administracion/ImpresionLiberacion/' + this.data.uiOrigen;
    }
  }
}
