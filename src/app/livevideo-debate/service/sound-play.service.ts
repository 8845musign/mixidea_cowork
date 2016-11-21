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


  play = (sound_type, sound_url)=>{
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

  preload = (sound_type, sound_url)=>{
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


  play_sound = (buffer)=>{
    const source = this.audio_context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audio_context.destination);
    source.start(0);
  }

  loadBuffer = (sound_url, sound_type, callback) => {
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

/*
function BufferLoader(audio_context) {
  this.audio_context = audio_context;
  this.bufferStorage = {};
}


BufferLoader.prototype.loadBuffer = function(sound_url, sound_type, callback) {
  // Load buffer asynchronously
  var xhr = new XMLHttpRequest();
  xhr.open("GET", sound_url, true);
  xhr.responseType = "arraybuffer";
  var that = this;

  xhr.onload = function() {
    // Asynchronously decode the audio file data in request.response
    const sound_data = xhr.response
    that.audio_context.decodeAudioData(
      sound_data,
      function(buffer) {
        if (!buffer) {
          console.log('error decoding file data: ' + sound_url);
          return;
        }
        that.bufferStorage[sound_type] = buffer;
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

*/
/*
BufferLoader.prototype.load = function(audio_url, sound_type, callback) {
  this.loadBuffer(this.audio_url, this.buffer_name);
};
*/