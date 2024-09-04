import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { UpdateService } from './core/services/update.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet class="theme-alternate"></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SAEC';

  constructor(
    private service: UpdateService
    ) { }

  ngOnInit() {
    if(localStorage.getItem('theme') !== null) {
      if(localStorage.getItem('theme') === 'D') {
        document.body.className += " theme-alternate";
      }
    }

    else{
      localStorage.setItem('theme', 'L');
    }

    this.service.checkForUpdates();
  }


}