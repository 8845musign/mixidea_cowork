import { Injectable } from '@angular/core';

declare var window:any;

@Injectable()
export class SoundPlayService {

  sound_obj : any = {};
  audio_context : any;
  source_domain = 'https://s3.amazonaws.com/mixideahangoutcommercial/angular_fire_hangout/app/';
  bufferStorage = {};

  constructor() {
    AudioContext = window.AudioContext || window.webkitAudioContext;
  　this.audio_context = new AudioContext();
    console.log("audio context constructor");

  }

  public PlayPoi(){
    console.log("play poi");
    const sound_type="play_poi";
    const sound_url = this.source_domain + 'audio/pointofinformation.mp3';
    this.play(sound_type, sound_url)
  }

  public PlaySpeechStart(){
    console.log("play speech start");
    const sound_type="speech_start";
    const sound_url = this.source_domain + 'audio/speech_start.mp3';
    this.play(sound_type, sound_url)
  }

  public PlayTaken(){
    console.log("play taken");
    const sound_type="taken";
    const sound_url = this.source_domain + 'audio/taken.mp3';
    this.play(sound_type, sound_url)
  }

  public PlayGoBackToSpeaker(){
    console.log("play go back to speaker");
    const sound_type="go_back_to";
    const sound_url = this.source_domain + 'audio/gobacktospeaker.mp3';
    this.play(sound_type, sound_url)
  }

  public PlayHearHear(){
    console.log("play hear hear");
    const sound_type="hearhear";
    const sound_url = this.source_domain + 'audio/hearhear.mp3';
    this.play(sound_type, sound_url)
  }

  public PlayShame(){
    console.log("play shame");
    const sound_type="shame";
    const sound_url = this.source_domain + 'audio/shame.mp3';
    this.play(sound_type, sound_url)
  }

  public PlayOnePin(){
    console.log("play one pin");
    const sound_type="one_pin";
    const sound_url = this.source_domain + 'audio/OnePin.mp3';
    this.play(sound_type, sound_url)
  }

  public PlayTwoPin(){
    console.log("play two pin");
    const sound_type="two_pin";
    const sound_url = this.source_domain + 'audio/TwoPin.mp3';
    this.play(sound_type, sound_url)
  }

  public PlayThreePin(){
    console.log("play ThreePin");
    const sound_type="three_pin";
    const sound_url = this.source_domain + 'audio/ThreePin.mp3';
    this.play(sound_type, sound_url)
  }

  public PlayPreparationStart(){
    console.log("play PreparationStar");
    const sound_type="prep_start";
    const sound_url = this.source_domain + 'audio/prep_start.mp3';
    this.play(sound_type, sound_url)
  }

  public PlayPrepFinishSpeechStart(){
    console.log("play PrepFinishSpeechStart");
    const sound_type="prep_finish";
    const sound_url = this.source_domain + 'audio/prep_finish_speech_sart.mp3';
    this.play(sound_type, sound_url);
  }

  public PlayAllSpeechOver(){
    console.log("play AllSpeechOve");
    const sound_type="allspeech_over";
    const sound_url = this.source_domain + 'audio/all_seech_over.mp3';
    this.play(sound_type, sound_url)
  }

  public PlayIntroduction(){
    console.log("play Introduction");
    const sound_type="introduction";
    const sound_url = this.source_domain + 'audio/introduction.mp3';
    this.play(sound_type, sound_url)
  }


  private play = (sound_type, sound_url)=>{
    if(this.bufferStorage[sound_type]){
      this.play_sound(this.bufferStorage[sound_type])
    }else{
      this.loadBuffer(
        sound_url,
        sound_type,
        this.play_sound
      )
    }
  }

  private preload = (sound_type, sound_url)=>{
    if(this.bufferStorage[sound_type]){
      console.log("already loaded");
    }else{
      this.loadBuffer(
        sound_url,
        sound_type,
        function(){console.log("just load")}
      )
    }
  }


  private play_sound = (buffer)=>{
    const source = this.audio_context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audio_context.destination);
    source.start(0);
  }

  private loadBuffer = (sound_url, sound_type, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", sound_url, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = ()=> {
      // Asynchronously decode the audio file data in request.response
      const sound_data = xhr.response
      this.audio_context.decodeAudioData(
        sound_data,
        (buffer)=> {
          if (!buffer) {
            console.log('error decoding file data: ' + sound_url);
            return;
          }
          this.bufferStorage[sound_type] = buffer;
          callback(buffer);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }
    xhr.onerror = function() {
      alert('BufferLoader: XHR error');
    }
    xhr.send();
  };

}
