export enum STORE_DIRTIES_KEY {
  travelAgendas = 'travelAgendas',
}

export const INIT_DIRTY_STATE = {
  travelAgendas: {
    created: [],
    updated: [],
    deleted: []
  }
}

export interface IDirties {
  travelAgendas?: {created: string[], updated: string[],deleted: string[]}
}