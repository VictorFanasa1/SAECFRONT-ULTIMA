import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { SaecService } from 'src/app/core/services/saec.service';
import {MLogin} from './../../../core/models/MLogin'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: FormGroup;
  hide: boolean = true;
  isbusy: boolean = false;

  loginSAEC: MLogin = new MLogin();

  constructor(
    private saecService: SaecService,
    private navService: NavigationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.credentials = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  LogIn(event: Event) {
    console.log("SI ES AQUI")
    this.isbusy = true;
    event.preventDefault();
    const user: string = this.credentials.controls.user.value;
    const password: string = this.credentials.controls.password.value;
    this.loginSAEC.user = user;
    this.loginSAEC.password = password;
    //this.saecService.LogIn(user, password)
    this.saecService.LogIn(this.loginSAEC)
    .subscribe(result => {
      localStorage.setItem('tokenSaec', result[0]);
      this.router.navigate(['index']);
      this.saecService.ObtainData()
      .subscribe(result => {
        this.navService.changeHeaderTitle(result);
      })
    }, error => {
      this.isbusy = false;
    });
  }

}
