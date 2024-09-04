import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { checkError } from 'src/app/core/functions/checkError';
import { addicional } from 'src/app/core/modelviews/addicional.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-addicionals',
  templateUrl: './addicionals.component.html',
  styleUrls: ['./addicionals.component.scss']
})
export class AddicionalsComponent implements OnInit {

  addcionales: addicional[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddicionalsComponent>,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Guid,
    private service: SaecService
  ) { }

  ngOnInit(): void {
    this.service.GetAddicionalsByAsiigment(this.data)
    .subscribe(addicionals => {
      this.addcionales = addicionals;
    }, error => {
      checkError(error, this.router, this.snackBar);
    })
  }

}
