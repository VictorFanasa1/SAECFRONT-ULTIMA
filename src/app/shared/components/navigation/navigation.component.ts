import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { checkError } from 'src/app/core/functions/checkError';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Output() public sidenavTooggle = new EventEmitter();

  data: any;

  constructor(
    private navService: NavigationService,
    private saecService: SaecService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.data = ['','', ''];
    this.saecService.ObtainData()
    .subscribe(result => {
      this.data = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
    this.navService.subject.subscribe(result => {
      this.data = result;
    })
  }

  clicktoclose(): void {
    this.sidenavTooggle.emit();
  }

  logOut(): void {
    localStorage.removeItem('tokenSaec');
    this.navService.clear();
    this.router.navigate(['login']);
    this.sidenavTooggle.emit();
  }
}
