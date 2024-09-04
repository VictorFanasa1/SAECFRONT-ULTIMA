import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { checkError } from 'src/app/core/functions/checkError';
import { catAccesorios } from 'src/app/core/models/catAccesorios.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-accesories',
  templateUrl: './accesories.component.html',
  styleUrls: ['./accesories.component.scss']
})
export class AccesoriesComponent implements OnInit {

  accesories: catAccesorios[] = [];

  constructor(
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Guid
  ) { }

  ngOnInit(): void {
    this.service.GetAccesoriesByAssigment(this.data)
    .subscribe(accesories => {
      this.accesories = accesories;
    }, error => {
      checkError(error, this.router, this.snackBar)
    })
  }

}
