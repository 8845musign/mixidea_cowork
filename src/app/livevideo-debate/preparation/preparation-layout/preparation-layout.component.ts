import { Component, OnInit, Input, OnChanges } from '@angular/core';

import {STYLE_NA, STYLE_ASIAN, STYLE_BP} from './../../../interface/deb_style'

import {TEAM_PROPOSITION, TEAM_GOV, TEAM_OG} from './../../../interface/team';

import { AngularFire } from 'angularfire2';


@Component({
  selector: 'app-preparation-layout',
  templateUrl: './preparation-layout.component.html',
  styleUrls: ['./preparation-layout.component.scss']
})
export class PreparationLayoutComponent implements OnInit, Input, OnChanges {

  @Input() event_id;
  @Input() deb_style;
  @Input() participants_team;
  @Input() participants_type;
  @Input() users_in_team;
  @Input() is_in_team_myself;
  @Input() current_own_team;

  @Input() room_users;
  @Input() video_data;
  
  current_prep_team : string = null;
  audience_team : string = null;
  default_team : string;

  prep_doc_subscription = null;
  prep_doc = {
    intro: {},
    arg_arr: []
  };
  intro_doc = {};
  arg_obj = {};


  constructor(private af: AngularFire) { }

  ngOnInit() {

    switch(this.deb_style){
      case STYLE_NA:
        this.default_team = TEAM_GOV;
      break;
      case STYLE_ASIAN:
        this.default_team = TEAM_PROPOSITION;
      break;
      case STYLE_BP:
        this.default_team = TEAM_OG;
      break;
    }
  }

  ngOnChanges(){

    const prep_team = this.audience_team || this.current_own_team[0] || this.default_team;

    if(this.current_prep_team != prep_team){

      if(this.prep_doc_subscription){
        this.prep_doc_subscription.unsubscribe();
      }
      const reference = "/event_related/livevideo-debate-prepdoc/" + this.event_id + "/" + prep_team;
      const prep_doc_item = this.af.database.object(reference, { preserveSnapshot: true });
      this.prep_doc_subscription
        = prep_doc_item.subscribe((snapshot)=>{

          this.prep_doc = snapshot.val() || {};
          console.log(this.prep_doc);
          this.intro_doc = this.prep_doc.intro || {};
          this.arg_obj = this.prep_doc.arg_arr || {};
          if(!this.arg_obj["0"]){
            this.arg_obj["0"] = {};
          }
          if(!this.arg_obj["1"]){
            this.arg_obj["1"] = {};
          }
      })
      this.current_prep_team = prep_team;
    }

  }




  }


