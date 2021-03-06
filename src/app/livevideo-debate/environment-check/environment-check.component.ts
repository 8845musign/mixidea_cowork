import { Component, OnInit, AfterViewInit,ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

import { UserauthService} from './../../core/service/userauth.service';

import {SkywayService} from './../service/skyway.service';


@Component({
  selector: 'app-environment-check',
  templateUrl: './environment-check.component.html',
  styleUrls: ['./environment-check.component.scss']
})
export class EnvironmentCheckComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,
               private router: Router
               ,private user_auth : UserauthService,
               private skyway : SkywayService,
               private el: ElementRef) { }

  evnet_id;
  _el;
  video_container
  own_user_subscription;

  ngOnInit() {
    this._el = this.el.nativeElement;
    this.evnet_id = this.route.snapshot.params['id'];
    console.log(this.evnet_id);
    if(this.user_auth.own_user.loggedIn){
      this.skyway.initialize();
    }else{
      this.own_user_subscription =
         this.user_auth.own_user_subject$
          .filter( ()=>{return this.user_auth.own_user.loggedIn == true})
          .take(1)
          .subscribe(()=>{
            this.skyway.initialize();
          })
    }
  }

  ngAfterViewInit(){

    console.log("ng after vie init of environment_check");
    this.skyway.local_video_stream_subject.subscribe((stream)=>{
      console.log("local video stream subscription");
      if(stream){
        this.video_container = this._el.getElementsByClassName("own_video")[0];
        this.video_container.innerHTML = "";
        const video_element = document.createElement("video");
        video_element.autoplay = true;
        video_element.src= window.URL.createObjectURL(stream);
        video_element.muted = true; //own voice is heard when enveironment is checked.
        this.video_container.insertBefore(video_element, null)
        console.log(video_element.src);
        
      }
    })
  }




  join_game(){

    if(!this.user_auth.own_user.loggedIn){
      alert("you need to login to enter video call");
      this.user_auth.open_login_modal();
      return;
    }
    console.log("enter video call");
    this.router.navigate(['/livevideo-debate/game/', this.evnet_id]);
    this.skyway.switch_localstream_small();
  }

  ngOnDestroy(){
    this.video_container = null;
    if(this.own_user_subscription){
      this.own_user_subscription.unsubscribe();
    }
  }

}
