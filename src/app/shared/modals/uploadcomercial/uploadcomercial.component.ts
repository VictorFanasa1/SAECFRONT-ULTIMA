import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { uploadcomer } from 'src/app/core/modelviews/uploadcomer.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-uploadcomercial',
  templateUrl: './uploadcomercial.component.html',
  styleUrls: ['./uploadcomercial.component.scss']
})
export class UploadcomercialComponent implements OnInit {

  urldoc: string = '';
  namefiles: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<UploadcomercialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: uploadcomer,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
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
    this.service.DownLoadFile(this.data.uiOrigin)
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

  UpLoadDocument() {
    const evidenciaRH = document.getElementById('tracing-upload') as HTMLInputElement;
    const listaFilesRH = evidenciaRH.files;
    if (listaFilesRH !== null) {
      this.service.PostDocument(listaFilesRH[0], this.data.uiOrigin)
      .subscribe(layout => {
        this.dialogRef.close(true);
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
