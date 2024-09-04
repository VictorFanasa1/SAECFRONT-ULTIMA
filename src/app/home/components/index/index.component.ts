import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { SaecService } from 'src/app/core/services/saec.service';
import { db } from '../../../core/database/saec'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  url: any;
  constructor(
    private navservice: NavigationService,
    private service: SaecService,
    public _sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.service.GetPowerBi()
    .subscribe(result => {
      this.url = this._sanitizer.bypassSecurityTrustResourceUrl(result[0]);
    });
  }

}
