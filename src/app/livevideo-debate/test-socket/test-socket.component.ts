/// <reference path="./../../../../typings/globals/socket.io-client/index.d.ts" />



import { Component, OnInit } from '@angular/core';
import * as io from "socket.io-client";

@Component({
  selector: 'app-test-socket',
  templateUrl: './test-socket.component.html',
  styleUrls: ['./test-socket.component.scss']
})
export class TestSocketComponent implements OnInit {

  private socket;
  private socket_url = "http://127.0.0.1:3000"

  constructor() { }

  ngOnInit() {
    console.log("socket test init");
    this.socket = io(this.socket_url);
  //  this.socket.emit('',"aa")
  }

  socket_test(){
    console.log("socket_test");
    this.socket.emit('chat_message',"test");
  }



}
