/// <reference path="./../../../../typings/globals/socket.io-client/index.d.ts" />
/// <reference path="./../../../../typings/globals/socket.io-stream.d.ts" />


import { Injectable } from '@angular/core';

import * as io from "socket.io-client";
import * as ss from "socket.io-stream";


@Injectable()
export class SocketstreamService {

  private socket_url = "https://recording2.mixidea.org";
  private socket_io;
  private stream;
  private is_socket_available = false;

  constructor() { }

  initialize(){

    console.log("socket service initialized");
    this.socket_io = io.connect(this.socket_url,()=>{
      console.log("socket connected");
    });

  }

  start_record(in_file_name, sample_rate_value){
    console.log("start record");
		if(!this.stream){
			console.log(" start record socket id=" + this.socket_io.id);
			this.stream = ss.createStream();
			console.log("audio polling stream id " + this.stream.id);
			var start_emit_obj = {filename:in_file_name,sample_rate:sample_rate_value};
			console.log(start_emit_obj);
			ss(this.socket_io).emit('audio_record_start', this.stream, start_emit_obj );
		}else{
			console.log("recording is already on going");
		}
  }

  suspend_record(){

  }

  resume_record(){

  }

  stop_record_save(){
		if(this.stream){
			console.log("stop record socket id=" + this.socket_io.id);
			this.stream.end();
			this.stream = null;
			var stop_emit_obj = {aaa:"aaa"};
			console.log(stop_emit_obj);
			this.socket_io.emit('audio_record_end', stop_emit_obj);
		}
  }

  stream_record_process(audio_array_buffer){
    if(!this.stream){
      return;
    }
	  const stream_buffer = new ss.Buffer(audio_array_buffer);
		this.stream.write(stream_buffer, 'buffer');
  }



  finalize(){

  }




}
