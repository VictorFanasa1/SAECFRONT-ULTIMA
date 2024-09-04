import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { checkError } from 'src/app/core/functions/checkError';
import { detailsupport } from 'src/app/core/modelviews/detailsupport.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-supports',
  templateUrl: './supports.component.html',
  styleUrls: ['./supports.component.scss']
})
export class SupportsComponent implements OnInit {

  supports: detailsupport[] = [];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SupportsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Guid,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if(this.data === null) {
      this._bottomSheetRef.dismiss();
      this.snackBar.open('No se encontraron soportes para mostrar.', 'Aceptar', {
        duration: 7500
      });
    }

    else{
      this.service.GetSupportsByUi(this.data)
      .subscribe(result => {
        this.supports = result;
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
    }
  }

  getSize(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  Dowload(event: MouseEvent, uiSupport: number) {
    event.preventDefault();
    this.service.DownloadSupport(uiSupport)
    .subscribe(async result => {
      const base64Response = await fetch(`data:${result.sType};base64,${result.btmFile}`);
      const blob = await base64Response.blob();
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = result.sFile;
      link.click();
    }, error => {
      checkError(error, this.router, this.snackBar)
    });
  }
}
