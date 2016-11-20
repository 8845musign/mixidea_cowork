import { Component, OnInit, Input, OnChanges, ElementRef, ChangeDetectorRef,NgZone, OnDestroy } from '@angular/core';

import { UserauthService} from './../../../core/service/userauth.service';

const NOT_LOGIN_USER = "NOT_LOGIN_USER";
const LOGIN_USER_without_stream = "LOGIN_USER_without_stream";
const LOGIN_USER_with_audio = "LOGIN_USER_with_audio";
const LOGIN_USER_with_video = "LOGIN_USER_with_video";



@Component({
  selector: 'app-user-video-icon',
  templateUrl: './user-video-icon.component.html',
  styleUrls: ['./user-video-icon.component.scss']
})
export class UserVideoIconComponent implements OnInit, OnChanges, OnDestroy {

  NOT_LOGIN_USER = NOT_LOGIN_USER;
  LOGIN_USER_without_stream = LOGIN_USER_without_stream;
  LOGIN_USER_with_audio = LOGIN_USER_with_audio;
  LOGIN_USER_with_video = LOGIN_USER_with_video;

  @Input() stream_data
  @Input() user_env
  @Input() room_users
  @Input() user_id
  /*
  @Input() type
  @Input() height
  @Input() width
  */
  //video_src = null;
  stream_src = null;
  _el;

  show_video = false;
  show_image = false;
  user_type = NOT_LOGIN_USER;


  constructor(private el: ElementRef,
             private change_ref: ChangeDetectorRef,
             private _ngZone: NgZone,
             private user_auth : UserauthService) { }

  ngOnInit() {
    this._el = this.el.nativeElement;
  }

  ngOnChanges() {


/* check the condition*/

    this.stream_data = this.stream_data || {};
    this.stream_src = this.stream_data[this.user_id];

    const user_env = this.user_env || {};
    const video_env = user_env.video || {};
    let video_available = true
    if(video_env[this.user_id] == false){
      video_available = false;
    }
    const audio_env = user_env.audio || {};
    let audio_available = true;
    if(audio_env[this.user_id] == false){
      audio_available = false;
    }

    this.room_users = this.room_users || [];
    let is_room_user = true
    if(this.room_users.indexOf(this.user_id) == -1){
      is_room_user = false;
    }

/* set view parameter**/

    if(this.stream_src && video_available){
      this.user_type = LOGIN_USER_with_video;
      setTimeout(this.set_user_video, 300);
      return;
    }

    if(this.stream_src && !video_available && audio_available){
      this.user_type = LOGIN_USER_with_audio;
      setTimeout(this.set_user_audio, 300);
      return;  
    }

    if(is_room_user && !video_available && !audio_available){
      this.user_type = LOGIN_USER_without_stream;
      return; 
    }


    if(!is_room_user){
      this.user_type = NOT_LOGIN_USER;
      return; 
    }

/*
    if(!updated_video_src){
      console.log("only image is shown for user ", this.user_id);
    }else if (video_env[this.user_id] == false){
      console.log("user video environment is not available", this.user_id);
      updated_video_src = null;
    }else if(this.room_users.indexOf(this.user_id) == -1) {

      console.log("user is not in the room");
      updated_video_src = null;
    }else{
          console.log("video start to be shown to ", this.user_id);
    }

    if(this.video_src && !updated_video_src){
      setTimeout(this.remove_video_area, 100);
    }

    if(updated_video_src && this.video_src !=updated_video_src){
      setTimeout(this.set_user_video, 1000);
    }
    this.video_src = updated_video_src;
  */
  }


  remove_video_area = ()=>{
    const video_container = this._el.getElementsByClassName("video_container")[0];
    if(video_container){
      video_container.innerHTML = "";
    }
  }

  set_user_video = ()=>{
    this.remove_video_area();

    console.log("==video element is created with src== : ",this.stream_src);
    const video_container = this._el.getElementsByClassName("video_container")[0];
    const video_element = document.createElement("video");
    video_element.autoplay = true;
    video_element.src= this.stream_src
    video_element.width=100
    video_element.height=100

    if(this.user_id == this.user_auth.own_user.id){
      video_element.muted = true;
      console.log("==video muted==", this.user_id);
    }else{
      video_element.muted = false;
      console.log("==video not muted==", this.user_id);
    }

    video_container.insertBefore(video_element, null)
    console.log(video_element.src);
    this.change_ref.markForCheck();

    this._ngZone.run(()=>{});
  }



  remove_audio_area = ()=>{
    const audio_container = this._el.getElementsByClassName("audio_container")[0];
    if(audio_container){
      audio_container.innerHTML = "";
    }
    
  }

  set_user_audio = ()=>{
    this.remove_audio_area();
    if(this.user_id == this.user_auth.own_user.id){
      console.log("==your own audio should be disabled==")
      return;
    }


    console.log("==audio element is created== : ",this.stream_src);
    console.log("==audio element is usrid== : ",this.user_id);
    const audio_container = this._el.getElementsByClassName("audio_container")[0];
    const audio_element = document.createElement("audio");
    audio_element.autoplay = true;
    audio_element.src= this.stream_src;

    audio_container.insertBefore(audio_element, null)
    this.change_ref.markForCheck();
    this._ngZone.run(()=>{});
  }





  ngOnDestroy(){
    this.remove_video_area();
  }
  


}
