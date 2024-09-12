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
import { altadispositivos } from 'src/app/core/modelviews/altadispositivos.model';
import { comercial } from 'src/app/core/modelviews/comercial.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-viewdevices',
  templateUrl: './viewdevices.component.html',
  styleUrls: ['./viewdevices.component.scss']
})
export class ViewdevicesComponent implements OnInit {

  catalogoDevices: altadispositivos[] = [];


  constructor(
    public builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, uiremision:Guid },
    public dialogref: MatDialogRef<ViewdevicesComponent>,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.SearchData(this.data.uiremision);
  }

    SearchData(uiremision: Guid) {
      this.service.GetAllDivicesSearch(uiremision)
      .subscribe(result => {
        //console.table(result)
        this.catalogoDevices = result;
      }, error => {
        checkError(error, this.router, this.snackBar);
      });
  }


}
