import { NgModule }  from '@angular/core';
import { RouterModule } from '@angular/router';

import {LivevideoDebateContainerComponent} from './livevideo-debate-container.component';
import { IntroductionLayoutComponent } from './introduction/introduction-layout/introduction-layout.component';
import { LivevideoDebateRootComponent } from './livevideo-debate-root.component';

import { EnvironmentCheckComponent } from './environment-check/environment-check.component';
import {EnvironmentGuardService} from './service/environment-guard.service';


@NgModule({
  imports: [
    RouterModule.forChild(
    [
      {
        path: 'livevideo-debate',
        component: LivevideoDebateRootComponent,
        children:[
          { path: 'game/:id',
           component: LivevideoDebateContainerComponent,
           canActivate: [EnvironmentGuardService]
          },
          { path: 'environment_check/:id', component: EnvironmentCheckComponent}
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class LivevideoDebateRoutingModule { }



