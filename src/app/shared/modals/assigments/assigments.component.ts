import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { employedassigment, employedassigments } from 'src/app/core/modelviews/employedassigments.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-assigments',
  templateUrl: './assigments.component.html',
  styleUrls: ['./assigments.component.scss']
})
export class AssigmentsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Serie', 'Tipo', 'Marca', 'Modelo', 'actions'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<employedassigment> = new MatTableDataSource<employedassigment>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AssigmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: employedassigments) {
  }

  ngOnInit(): void {
    this.dataSource.data = this.data.assigments;
  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }

  selectSerie(serie: string) {
    this.dialogRef.close(serie);
  }

  copytable(): string {
    let text = '<table><thead><tr><th>Serie</th><th>Tipo</th><th>Marca</th><th>Modelo</th></tr></thead><tbody>';
    this.dataSource.data.map(asg =>{
      text += `<tr><td>${asg.sSerie}</td><td>${asg.sType}</td><td>${asg.sBranch}</td><td>${asg.sModel}</td></tr>`;
    });
    text += '</tbody></table>';
    return text;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Equipos por página:';
  }

}
