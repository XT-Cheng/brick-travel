export enum STORE_DIRTIES_KEY {
  travelAgendas = 'travelAgendas',
}

export const INIT_DIRTY_STATE = {
  lastSynced: null,
  lastError: null,
  syncing: false,
  dirtyIds: {
    travelAgendas: {
      created: [],
      updated: [],
      deleted: []
    }
  }
}

export interface IDirties {
  lastError: Error,
  lastSynced: Date,
  syncing: boolean,
  dirtyIds: {
    travelAgendas: { created: string[], updated: string[], deleted: string[] }
  }
}