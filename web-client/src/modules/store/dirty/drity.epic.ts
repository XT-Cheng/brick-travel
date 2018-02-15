import { Injectable } from '@angular/core';

import { DataSyncService } from '../../../providers/dataSync.service';

@Injectable()
export class DirtyEpics {
  constructor(private _dataSyncService: DataSyncService) {}

  public createEpics() : any[] {
    return [this._dataSyncService.createEpic()];
  }
}