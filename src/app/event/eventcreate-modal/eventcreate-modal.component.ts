import { Component, OnInit , ViewChild, Input} from '@angular/core';

import { ModalDirective } from './../../../../node_modules/ng2-bootstrap/components/modal/modal.component';
import {DatepickerModule} from './../../../../node_modules/ng2-bootstrap/components/datepicker';
import {TimepickerModule} from './../../../../node_modules/ng2-bootstrap/components/timepicker';
import {Event} from './../event'
import {FormsModule} from '@angular/forms';
import {AngularFire} from 'angularfire2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-eventcreate-modal',
  templateUrl: './eventcreate-modal.component.html',
  styleUrls: ['./eventcreate-modal.component.scss']
})
export class EventcreateModalComponent implements OnInit {

  submitted = false;
  event_obj = new Event();

  constructor(private af: AngularFire, private router: Router) { }

  @ViewChild(ModalDirective) event_create_modal:ModalDirective;

  ngOnInit() {
  }

  open_modal(){
    console.log("open modal");
    this.event_create_modal.show();
  }

  onSubmit(){
    this.submitted = true;
    this.event_obj.compute_date_time()
  }

  close_modal(){
    this.event_create_modal.hide();
  }

  fix_data(){
    this.submitted = false;
  }

  save_data(){
    const saved_data = {
      title: this.event_obj.title
    };
    const event_items = this.af.database.list('/event_related/event');
    const promise = event_items.push(saved_data);
    promise
      .then(()=>{
          alert("saving data success");
          this.event_create_modal.hide();
          // goto event page;
          this.router.navigate(['/articlelist']);
        })
      .catch((err)=>{
        console.log("error to save data to firebase", err)
        alert("fail to save data ");
      })

  }

  finsh_event_creation(){    
  }


}
