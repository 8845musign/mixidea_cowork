import { Injectable } from '@angular/core';

import {SocketstreamService} from './../service/socketstream.service';

declare var window:any;


@Injectable()
export class RecordingService {

  under_recording = false;

  constructor(private socket_stream : SocketstreamService) { }


  initialize(){
    console.log("recording service initialization")
    this.socket_stream.initialize();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audio_context = new AudioContext();

    const promise = navigator.mediaDevices.getUserMedia({ audio:true,video: false});
    promise.then(
      (audio_stream)=>{
        console.log("audio getusermedia is approved");
        const audioInput = audio_context.createMediaStreamSource(audio_stream);
        const bufferSize = 4096;
        const scriptNode = audio_context.createScriptProcessor(bufferSize, 1, 1);
        audioInput.connect(scriptNode);
        scriptNode.connect(audio_context.destination); 

        scriptNode.onaudioprocess = (audioProcessingEvent)=>{
          if(!this.under_recording ){
            return;
          }
          var left = audioProcessingEvent.inputBuffer.getChannelData(0);
          var audio_array_buffer = this.convertoFloat32ToInt16(left);
          this.socket_stream.stream_record_process(audio_array_buffer);
        }
      }
    );
  }

  
  start_audio_polling(){

  }



  public record_start(){
    this.under_recording = true;
    this.socket_stream.start_record("test",20);
  }

  public record_finish(){
    this.under_recording = false;
    this.socket_stream.stop_record_save();
  }


  finish_audio_polling(){

  }

  convertoFloat32ToInt16 = (buffer)=>{
	  const len = buffer.length;

	  const double_len = len*2;
	  const unit8_buf = new Uint8Array(double_len);
	  const int16_variable = new Int16Array(1);
	  for (let i=0; i< len; i++) {
	    int16_variable[0] = buffer[i]*0x7FFF;    //convert to 16 bit PCM
	    unit8_buf[2*i] = int16_variable[0] & 0x00FF; //convert to uint8 for stream buffer
	    unit8_buf[2*i+1] = (int16_variable[0] & 0xFF00) >> 8;
	  }
	  return unit8_buf.buffer;
  }


}
