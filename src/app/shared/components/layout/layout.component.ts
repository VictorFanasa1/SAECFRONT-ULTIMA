import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { seriesaf } from 'src/app/core/modelviews/seriesaf.model';
import { db } from './../../../core/database/saec';
import { SaecService } from './../../../core/services/saec.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private service: SaecService
    ) { }

  ngOnInit(): void {
    this.service.GetAllSeries()
    .subscribe(async series => {
      await db.series.clear()
      .then(async (finish) => {
        await db.series.bulkAdd(series).then(result =>{
        }, error =>  {
        });
      });
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
  }
}
