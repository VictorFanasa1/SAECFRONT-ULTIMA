import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor() { }

  private uiDivice: Guid = Guid.createEmpty();
  subjectuiDivice = new Subject();

  senduiDivice(newuser: Guid) {
    this.uiDivice = newuser;
    this.subjectuiDivice.next(this.uiDivice);
  }
}
