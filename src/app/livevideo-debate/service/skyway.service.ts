import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';

import { UserauthService} from './../../core/service/userauth.service';
import {ModelUserService} from './../../core/service/model-user.service';
import {LiveDebateFirebaseService} from './live-debate-firebase.service';


import {SKYWAY_STATUS_NOPEER
  ,SKYWAY_STATUS_UNDER_PEERINIT
  ,SKYWAY_STATUS_PEERSET
  ,SKYWAY_STATUS_UNDER_ROOMINIT
  ,SKYWAY_STATUS_IN_ROOM} from './../interface-livedebate/status'



declare var navigator:any;
declare var Peer:any;


@Injectable()
export class SkywayService {

  own_peer : any;
  is_own_peer_opened = false;
  sfu_room : any;
  local_stream : any;

  audio_available : boolean;
  video_available: boolean;
  video_active : boolean;
  audio_active : boolean;
  is_usermedia_set = false;

  local_video_stream_subject : BehaviorSubject<any>;
  skyway_status = SKYWAY_STATUS_NOPEER;

  room_data_subject


  constructor(private user_auth : UserauthService,
              private user_model : ModelUserService,
              private livedebate_firebase: LiveDebateFirebaseService) {

    this.local_video_stream_subject = new BehaviorSubject(null);
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


  }

  initialize(event_id?, in_roomname?){
    console.log("<<skyway service API>> Initialization ");

    this.room_data_subject = new BehaviorSubject(this.room_data);

    console.log("<<skyway operation>>new peer");
    this.set_skyway_status(SKYWAY_STATUS_UNDER_PEERINIT);
    this.own_peer = new Peer(this.user_auth.own_user.id, {
      key: '1ea20ebb-c109-4262-b9b8-f2afed75e3af',
//        key: '63899577-16cc-4fdb-9a4d-ad3ace362cde',
      debug:3
    });
    this.own_peer.on('open', ()=>{
      console.log("<<skyway peer event>> open : peer id ", this.own_peer.id);
      const constraints = { audio:true,
                          video: {
                            width:{ideal:320},
                            height:{ideal: 180}
                          }};
      this.is_own_peer_opened = true;
      this.get_usermedia(constraints, event_id, in_roomname);

    })

    this.own_peer.on('error', (err)=>{
      console.log("<<skyway peer event>>peer error", err);
      alert("peer error");
    })

    const constraints = { audio:true,
                        video: {
                          width:{ideal:320},
                          height:{ideal: 180}
                        }};
    const room_join = false;
    this.is_own_peer_opened = false;
    this.get_usermedia(constraints, event_id, in_roomname);

  }

  set_skyway_status(in_status){
    this.skyway_status = in_status;
  }


  get_usermedia(constraints : any, event_id?: string, in_roomname? : string){

    const promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then((video_stream)=>{
      console.log(">>usermedia<< get_usermedia videoaudio approved");
      this.local_stream= video_stream;
      this.local_video_stream_subject.next(video_stream);
      this.video_available = true;
      this.audio_available = true;
      this.is_usermedia_set = true;


      const streamURL = URL.createObjectURL(video_stream);
      this.add_stream_on_roomuser(this.user_auth.own_user.id, streamURL);

      if(this.sfu_room){
        this.sfu_room.replaceStream(this.local_stream)
      }
      if(in_roomname){
        this.join_room_execute(event_id, in_roomname);
      }

    }).catch(()=>{
      console.log(">>usermedia<< get_usermedia_videoaudio failed");
      this.get_usermedia_audio(event_id, in_roomname);
    })
  }

  get_usermedia_audio(event_id?: string, in_roomname? : string){
    const constraints = { audio:true,
                          video: false};
    const promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then((audio_stream)=>{
      console.log(">>usermedia<< get_usermedia_audio approved");
      this.local_stream= audio_stream;
      this.video_available = false;
      this.audio_available = true;
      this.is_usermedia_set = true;

      if(this.sfu_room){
        this.sfu_room.replaceStream(this.local_stream)
      }
      if(in_roomname){
        this.join_room_execute( event_id, in_roomname);
      }
    }).catch(()=>{
      console.log(">>usermedia<< get_usermedia_audio failed");
      alert("you cannot use both aido and video, so you can just watch but cannot speak anything");
      this.video_available = false;
      this.audio_available = false;
      this.is_usermedia_set = true;
      if(in_roomname){
        this.join_room_execute( event_id, in_roomname);
      }
    })
  }

  switch_localstream_small(){
     console.log(">>skyway service API<< switch_localstream_small ");
      const constraints = { audio:true,
                          video: {
                            width:{ideal:100},
                            height:{ideal: 100},
                            frameRate: { ideal: 2}
                          }};
    this.get_usermedia(constraints);
 
  }
  


  middle_process = false;

  public join_room(type :string, event_id: string, team_name : string){
    console.log("<<skyway service API>> join_room ");
    let room_name = ''
    if(type=='main'){
      room_name = 'mixidea_' + event_id + '_main';
    }else if( type === 'preparation'){
      room_name = 'mixidea_' + event_id + '_' + team_name;
    }else{
      return;
    }

    this.join_room_execute(event_id, room_name);

  }

  private join_room_execute(event_id: string, in_room_name : string){


    this.close_room();

    this.set_user_env(event_id);


   this.sfu_room = this.own_peer.joinRoom(in_room_name, {mode: 'sfu', stream: this.local_stream })
   console.log("<<skyway operation>>join room :room_name", in_room_name);

    this.sfu_room.on('open', ()=>{
      console.log("<<<<skyway room event>>>> open");
      this.middle_process = false;
      this.set_peer_users();
    });

    this.sfu_room.on('close', ()=>{
      console.log("<<<<skyway room event>>>> closed");
      alert("room is closed");
    });

    this.sfu_room.on('error', (err)=>{
      console.log(" <<<<skyway room event>>>> error");
      console.log(err);
      this.middle_process = false;
    });

    this.sfu_room.on('stream', (stream)=>{
        const streamURL = URL.createObjectURL(stream);
        const peerId = stream.peerId;
        this.add_stream_on_roomuser(peerId, streamURL);


        console.log("<<<<skyway room event>>>>stream is detected");
        console.log("peer id" , peerId);
        console.log("url", streamURL);
    })

    this.sfu_room.on('removeStream', (stream)=>{
        const peerId = stream.peerId;
        this.remove_stream_from_roomuser(peerId);

        console.log("<<<<skyway room event>>>>stream is removed");
        console.log("peer id" , peerId);
    })

    this.sfu_room.on('peerJoin', (peerId)=>{
      this.user_model.add_user(peerId);
      console.log("<<<<skyway room event>>>>peer join ---: ", peerId);
      this.set_peer_users();
    });

    this.sfu_room.on('peerLeave', (peerId)=>{
      console.log("<<<<skyway room event>>>>peer leave ----", peerId);
      this.set_peer_users();
    });
  }



  room_data = {
    room_users:[],
    video_data:{}
  };


  private set_peer_users(){

      this.own_peer.listAllPeers((list)=>{
        console.log("all user list is", list );
        const room_user_obj = {};
        room_user_obj["room_users"]=list;
        this.room_data = Object.assign({}, this.room_data, room_user_obj);
        this.room_data_subject.next(this.room_data);
      })
  }

  private add_stream_on_roomuser(peerId, stream){

    const updated_video_obj = Object.assign({}, this.room_data.video_data)
    updated_video_obj[peerId] = stream;
    const updated_video_parent = {video_data: updated_video_obj};
    this.room_data = Object.assign({}, this.room_data,updated_video_parent);
    console.log("<<<<<<<room data>>>>>>>>");
    console.log(this.room_data);
    this.room_data_subject.next(this.room_data);
  }

  private remove_stream_from_roomuser(peerId){
    const updated_video_obj = Object.assign({}, this.room_data.video_data);
    if(updated_video_obj[peerId]){
      delete updated_video_obj[peerId];
    }
    const updated_video_parent = {video_data: updated_video_obj};
    this.room_data = Object.assign({}, this.room_data,updated_video_parent);
    console.log("<<<<<<<room data>>>>>>>>");
    console.log(this.room_data);
    this.room_data_subject.next(this.room_data);
  }

  private set_user_env(event_id){

    if(!this.audio_available){
      this.livedebate_firebase.set_user_audio_unavailable(event_id, this.user_auth.own_user_id);
    }else{
      this.livedebate_firebase.set_user_audio_available(event_id, this.user_auth.own_user_id);
    }
    if(!this.video_available){
     this.livedebate_firebase.set_user_video_unavailable(event_id, this.user_auth.own_user_id);
    }else{
      this.livedebate_firebase.set_user_video_available(event_id, this.user_auth.own_user_id);
    }
  }

  mute(){
    // これは何度もよばれるが、現状の値と比較し、変更の必要があったときのみ、apiを叩く
    this.sfu_room.mute({"video":false,"audio":false})
  
  }

  unmute(){
    this.sfu_room.unmute({"video":true,"audio":true})
  }

  public close_room(){
    if(this.sfu_room){
      console.log("<<skyway operation>>close room");
      this.sfu_room.close();
      this.sfu_room = null;
    }
  }


  public finalize(){
    console.log("<<skyway service API>> finalize ");
    this.is_usermedia_set = false;
    this.is_own_peer_opened = false;

    this.close_room();
    console.log("<<skyway operation>>destroy peer");
    this.own_peer.destroy();
    //this.own_peer = null;
    if(this.room_data_subject){
      this.room_data_subject.unsubscribe();
      this.room_data_subject = null;
    }
    
  }

}
