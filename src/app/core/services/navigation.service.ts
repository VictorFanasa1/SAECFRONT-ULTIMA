import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() { }

  private user: string[] = [];
  subject = new Subject();

  changeHeaderTitle(newuser: string[]) {
    this.user = newuser;

    this.subject.next(this.user);
  }

  ObtainName() {
    this.subject.next(this.user);
  }

  clear() {
    this.user = [];
    this.subject.next(this.user);
  }
}
