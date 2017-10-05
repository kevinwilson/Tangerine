import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginGuard } from '../auth/_guards/login-guard.service';
import { UploadGuardService } from '../auth/_guards/upload-guard.service';
import { SyncRecordsComponent } from './sync-records/sync-records.component';

const routes = [{
  path: 'sync-records',
  component: SyncRecordsComponent,
  canActivate: [LoginGuard, UploadGuardService]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class SyncRecodsRoutingModule { }