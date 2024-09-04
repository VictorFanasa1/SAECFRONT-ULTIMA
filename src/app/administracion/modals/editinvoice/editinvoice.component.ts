import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { invoiceHeader } from 'src/app/core/modelviews/invoiceHeader.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-editinvoice',
  templateUrl: './editinvoice.component.html',
  styleUrls: ['./editinvoice.component.scss']
})
export class EditinvoiceComponent implements OnInit {

  constructor(
    private builder: FormBuilder,
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditinvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: invoiceHeader,
  ) { }

  ngOnInit(): void {
  }

}
