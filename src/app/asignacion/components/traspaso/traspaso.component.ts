import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { employedassigment, employedassigments } from 'src/app/core/modelviews/employedassigments.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { traspaso } from 'src/app/core/modelviews/traspaso.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { Title } from "@angular/platform-browser";
import { TooltipTouchGestures } from '@angular/material/tooltip';

@Component({
  selector: 'app-traspaso',
  templateUrl: './traspaso.component.html',
  styleUrls: ['./traspaso.component.scss']
})
export class TraspasoComponent implements OnInit {

  isLoadEmployedS = false;
  isLoadEmployedE = false;

  employedS: employedassigments = new employedassigments();
  employedE: employedassigments = new employedassigments();

  constructor(
    private service: SaecService,
    private router: Router,
    private snackBar: MatSnackBar,
    private tittleservice: Title
  ) { }

  ngOnInit(): void {
    this.tittleservice.setTitle('Traspaso');
  }

  drop(event: CdkDragDrop<employedassigment[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  show(): void {
  }

  SearchEmployed(uiEmployed: string, type: number) {
    this.service.GetEmployedAssigments(uiEmployed)
    .subscribe(result => { 
      if(type === 1) {
        this.employedS = result;
      }
      else {
        this.employedE = result;
      }
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
  }

  newTraspaso(): void {
    let newtraspaso: traspaso = new traspaso();
    newtraspaso.employedA = this.employedS;
    newtraspaso.employedB = this.employedE;
    this.service.PostTraspaso(newtraspaso)
    .subscribe(result => {
      this.snackBar.open("Se hizo el traspaso", "Aceptar", {
        duration: 5000
      });
    }, error => { 
      checkError(error, this.router, this.snackBar);
    });
  }
}
