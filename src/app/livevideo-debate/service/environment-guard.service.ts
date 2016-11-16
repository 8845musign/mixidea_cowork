import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

import {SkywayService} from './skyway.service';


@Injectable()
export class EnvironmentGuardService implements CanActivate {

  event_id;

  constructor(private skyway : SkywayService,
              private router: Router) { }

  canActivate(route_activated: ActivatedRouteSnapshot, route_state: RouterStateSnapshot): boolean{

    if(this.skyway.is_own_peer_opened && this.skyway.is_usermedia_set){
      console.log("canActivate:true: environment is prepared for video call");
      return true;
    }else{
      console.log("canActivate: false: environment is not sufficient to be in video call");
      this.event_id = route_activated.params['id'];
      this.router.navigate(['/livevideo-debate/environment_check/', this.event_id]);
      return false;
    }
  }



}
