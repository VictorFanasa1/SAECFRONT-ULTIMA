import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() public sidenavTooggle = new EventEmitter();

  theme = '';
  tooltip = '';

  constructor() {
    let x = localStorage.getItem('theme');
    if(x !== null){
      this.theme = x;
      if(this.theme === 'D'){
        this.tooltip = 'Tema Claro';
      }
      else{
        this.tooltip = 'Tema Oscuro';
      }
    }

    else {
      this.theme = 'L';
      this.tooltip = 'Tema Oscuro';
    }
  }

  public onTooggleSideNav = () => {
    this.sidenavTooggle.emit();
  }

  Change() {
    const theme = localStorage.getItem('theme');
    if(theme === 'L') {
      localStorage.setItem('theme', 'D');
      document.body.className += " theme-alternate";
      this.theme = 'D';
      this.tooltip = 'Tema Claro';
    }

    else{
      localStorage.setItem('theme', 'L');
      document.body.className = document.body.className.replace(" theme-alternate", "");
      this.theme = 'L';
      this.tooltip = 'Tema Oscuro';
    }
  }
}
