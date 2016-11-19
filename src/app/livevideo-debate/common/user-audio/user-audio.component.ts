import { Component, OnInit, Input, ElementRef, OnChanges, OnDestroy, ChangeDetectorRef,NgZone } from '@angular/core';

import { UserauthService} from './../../../core/service/userauth.service';


@Component({
  selector: 'app-user-audio',
  templateUrl: './user-audio.component.html',
  styleUrls: ['./user-audio.component.css']
})
export class UserAudioComponent implements OnInit, OnChanges, OnDestroy {

  @Input() video_data
  @Input() user_env
  @Input() room_users
  @Input() user_id

  audio_src = null;
  _el;

  constructor(private el: ElementRef,
             private change_ref: ChangeDetectorRef,
              private user_auth : UserauthService,
             private _ngZone: NgZone) { }

  ngOnInit() {
    this._el = this.el.nativeElement;
  }

  ngOnChanges() {
    this.video_data = this.video_data || {};
    this.audio_src = this.video_data[this.user_id];
    const user_env = this.user_env || {};
    const audio_env = user_env.audio || {};
    this.room_users = this.room_users || [];

    if(!this.audio_src ||
       audio_env[this.user_id] == false ||
        this.room_users.indexOf(this.user_id) == -1 || 
        this.user_id == this.user_auth.own_user.id){
        setTimeout(()=>{
          this.remove_audio_area();
        }, 200)
      return;
    }
    setTimeout(()=>{
      this.set_usere_audio();
    }, 200)
  }

  set_usere_audio(){
    this.remove_audio_area();

    console.log("audio element is created with src : ",this.audio_src);
    const audio_container = this._el.getElementsByClassName("audio_container")[0];
    const audio_element = document.createElement("audio");
    audio_element.autoplay = true;
    audio_element.src= this.audio_src;

    audio_container.insertBefore(audio_element, null)
    this.change_ref.detectChanges();
    this._ngZone.run(()=>{});
  }

  remove_audio_area(){
    const audio_container = this._el.getElementsByClassName("audio_container")[0];
    audio_container.innerHTML = "";
  }

  ngOnDestroy(){

  }


}
