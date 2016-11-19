import { Component, OnInit,Input } from '@angular/core';
import {LiveDebateFirebaseService} from './../../service/live-debate-firebase.service';

import {STATUS_INTRO} from './../../interface-livedebate/status'

import {SkywayService} from './../../service/skyway.service';

@Component({
  selector: 'app-reflection-layout',
  templateUrl: './reflection-layout.component.html',
  styleUrls: ['./reflection-layout.component.scss']
})
export class ReflectionLayoutComponent implements OnInit {

  @Input() event_id;

  constructor(
    private livedebate_firebase: LiveDebateFirebaseService,
    private skyway : SkywayService) { }

  ngOnInit() {
    this.skyway.join_room('main', this.event_id ,null);
  }

  goback_introduction(){

    this.livedebate_firebase.change_game_status(this.event_id, STATUS_INTRO);
    console.log("start debate");
  }


}
