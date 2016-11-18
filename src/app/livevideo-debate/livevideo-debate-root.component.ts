import { Component, OnInit } from '@angular/core';

import {SkywayService} from './service/skyway.service';

@Component({
  selector: 'app-livevideo-debate-root',
  templateUrl: './livevideo-debate-root.component.html',
  styleUrls: []
})
export class LivevideoDebateRootComponent implements OnInit {

  constructor(private skyway : SkywayService) { }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.skyway.finalize();
  }




}
