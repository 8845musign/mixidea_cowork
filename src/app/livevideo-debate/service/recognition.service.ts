import { Injectable } from '@angular/core';
import { UserauthService} from './../../core/service/userauth.service';
import {LiveDebateFirebaseService} from './live-debate-firebase.service';

declare var window:any;


@Injectable()
export class RecognitionService {

  private under_recording = false;
  private available = true;
  private recognition = null;
  private speech_start_time : number;
  private transcription_ref = null;


  constructor(private user_auth : UserauthService,
              private livedebate_firebase: LiveDebateFirebaseService) { }

  initialize(){
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!window.SpeechRecognition){
    this.available = false;
    return;
    }
    this.recognition = new window.SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = "en-US";

    this.recognition.onresult = (e)=>{
      const results = e.results;
      for(let i = e.resultIndex; i<results.length; i++){
        if(results[i].isFinal){
          this.StoreData(results[i][0].transcript);
        }
      }
    };
  }


  start(event_id, deb_style, speech_type, speaker_role, speech_start_time){
    if(!this.available){
      return;
    }
    this.speech_start_time = speech_start_time;
    const short_split_id_value = Date.now();

    this.transcription_ref = "/event_related/audio_transcript/" + event_id + "/" + deb_style + "/" + speaker_role + 
              "/" + this.speech_start_time + "/spech_context/" + short_split_id_value;
    const speech_initial_obj = {
      user: this.user_auth.own_user.id,
      type: speech_type
    }
    this.livedebate_firebase.save_firebase_data(this.transcription_ref, speech_initial_obj);


    if(this.under_recording){
      return;
    }else{
      console.log("--recognition start--")
      this.recognition.start();
      this.under_recording = true;
    }

  }



  stop(){
    if(!this.available || !this.under_recording){
      return;
    }
    setTimeout(
      ()=>{
        console.log("--recognition stop--");
        this.recognition.stop();
        this.under_recording = false;
      }
    ,1000);
  }
  

  StoreData(text){
    	console.log(text);
      const current_time_value = Date.now();	
      const audio_time =  current_time_value - this.speech_start_time;
      const transcription_context_ref = this.transcription_ref + "/context";

      const speech_obj = {}
      speech_obj[audio_time]=text
      this.livedebate_firebase.update_firebase_data(transcription_context_ref, speech_obj);
  }
  



}
