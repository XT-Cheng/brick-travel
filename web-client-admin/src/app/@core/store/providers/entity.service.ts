import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { ObjectID } from 'bson';
import { denormalize, normalize, schema } from 'normalizr';
import { Epic } from 'redux-observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, combineLatest, concat, filter, map, mergeMap, race, startWith, switchMap } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';
import { isArray } from 'util';

import { FileUploader } from '../../fileUpload/providers/file-uploader';
import { WEBAPI_HOST } from '../../utils/constants';
import { IBiz } from '../bizModel/biz.model';
import { dirtyAddAction, dirtyRemoveAction, DirtyTypeEnum } from '../dirty/dirty.action';
import {
    EntityAction,
    EntityActionPhaseEnum,
    EntityActionTypeEnum,
    entityDeleteAction,
    entityInsertAction,
    entityUpdateAction,
    getEntityKey,
    getUIKey,
} from '../entity/entity.action';
import { EntityTypeEnum, IEntities, IEntity } from '../entity/entity.model';
import { IAppState, STORE_KEY } from '../store.model';
import { STORE_UI_COMMON_KEY } from '../ui/ui.model';
import { FilterEx } from '../utils/filterEx';
import { ErrorService } from './error.service';
import { FetchService } from './fetch.service';
import { UIService } from './ui.service';

export abstract class EntityService<T extends IEntity, U extends IBiz> extends FetchService {
    //#region Constructor

    constructor(protected _http: HttpClient,
        protected _store: NgRedux<IAppState>,
        protected _entityType: EntityTypeEnum,
        protected _entitySchema: schema.Entity,
        protected _url: string,
        protected _errorService: ErrorService,
        protected _uiService: UIService<T, U> = null) {
        super(_http, _store, _entityType, _entitySchema, _url);

        this.getAll(this._store).subscribe((value) => {
            this._all = value;
            this._all$.next(value);
        });

        this.getSelected(this._store).subscribe((value) => {
            this._selected = value;
            this._selected$.next(value);
        });

        if (this._uiService) {
            this.getSearched(this._store).subscribe((value) => {
                this._searched$.next(value);
            });

            this.getFiltered(this._store).subscribe((value) => {
                this._filtered = value;
                this._filtered$.next(value);
            });

            this.getFilteredAndSearched(this._store).subscribe((value) => {
                this._filteredAndSearched = value;
                this._filteredAndSearched$.next(value);
            });
        }
    }

    //#endregion

    //#region Protected member

    protected _all$: BehaviorSubject<U[]> = new BehaviorSubject([]);
    protected _all: U[] = [];

    protected _selected: U;
    protected _selected$: BehaviorSubject<U> = new BehaviorSubject(null);

    protected _searched: U[];
    protected _searched$: BehaviorSubject<U[]> = new BehaviorSubject(null);

    protected _filtered: U[];
    protected _filtered$: BehaviorSubject<U[]> = new BehaviorSubject(null);

    protected _filteredAndSearched: U[];
    protected _filteredAndSearched$: BehaviorSubject<U[]> = new BehaviorSubject(null);

    //#endregion

    //#region Entity Selector

    protected getById(store: NgRedux<IAppState>, id: string): Observable<U> {
        return store.select<T>([STORE_KEY.ui, getEntityKey(this._entityType), id]).pipe(
            map(ct => {
                return ct ? denormalize(ct.id, this._entitySchema, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
        );
    }

    private getAll(store: NgRedux<IAppState>): Observable<U[]> {
        return store.select<{ [id: string]: T }>([STORE_KEY.entities, getEntityKey(this._entityType)]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [this._entitySchema], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    private getSelectedId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, getUIKey(this._entityType), STORE_UI_COMMON_KEY.selectedId]);
    }

    private getSelected(store: NgRedux<IAppState>): Observable<U> {
        return this.getSelectedId(store).pipe(
            switchMap(id => {
                return store.select<T>([STORE_KEY.entities, getEntityKey(this._entityType), id]);
            }),
            map(ct => {
                return ct ? denormalize(ct.id, this._entitySchema, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
        );
    }

    private getSearched(store: NgRedux<IAppState>): Observable<U[]> {
        return this.all$.pipe(
            combineLatest(this._uiService.searchKey$, (cities, searchKey) => {
                return cities.filter(c => {
                    let matchSearchKey = true;
                    if (searchKey !== '') {
                        matchSearchKey = this.search(c, searchKey);
                    }

                    return matchSearchKey;
                });
            })
        );
    }

    private getFiltered(store: NgRedux<IAppState>): Observable<U[]> {
        return this._uiService.filters$.pipe(
            combineLatest(this.all$,
                (filterCategories, viewPoints) => {
                    return viewPoints.filter(vp => {
                        const isFiltered = filterCategories.every(category => {
                            return category.criteries.every(criteria => {
                                if (criteria.isChecked && FilterEx[category.filterFunction]) {
                                    return FilterEx[category.filterFunction](vp, criteria);
                                }
                                return true;
                            });
                        });

                        return isFiltered;
                    });
                })
        );
    }

    private getFilteredAndSearched(store: NgRedux<IAppState>): Observable<U[]> {
        return this._uiService.filters$.pipe(
            combineLatest(this.all$, this._uiService.searchKey$,
                (filterCategories, viewPoints, searchKey) => {
                    return viewPoints.filter(vp => {
                        const isFiltered = filterCategories.every(category => {
                            return category.criteries.every(criteria => {
                                if (criteria.isChecked && FilterEx[category.filterFunction]) {
                                    return FilterEx[category.filterFunction](vp, criteria);
                                }
                                return true;
                            });
                        });

                        let matchSearchKey = true;
                        if (searchKey !== '') {
                            matchSearchKey = this.search(vp, searchKey);
                        }

                        return isFiltered && matchSearchKey;
                    });
                })
        );
    }

    //#endregion

    //#region Entity Selector

    public get all$(): Observable<U[]> {
        return this._all$.asObservable();
    }

    public get selected$(): Observable<U> {
        return this._selected$.asObservable();
    }

    public get selected(): U {
        return this._selected;
    }

    public get searched$(): Observable<U[]> {
        return this._searched$.asObservable();
    }

    public get filtered(): U[] {
        return this._filtered;
    }

    public get filtered$(): Observable<U[]> {
        return this._filtered$.asObservable();
    }

    public get filteredAndSearched$(): Observable<U[]> {
        return this._filteredAndSearched$.asObservable();
    }

    //#endregion

    //#region Actions

    //#region Entity Actions

    protected updateAction = entityUpdateAction<U>(this._entityType);

    protected insertAction = entityInsertAction<U>(this._entityType);

    protected deleteAction = entityDeleteAction<U>(this._entityType);

    protected addDirtyAction = dirtyAddAction(this._entityType);

    protected removeDirtyAction = dirtyRemoveAction(this._entityType);

    //#endregion

    //#region UI Actions

    //#endregion

    //#region Epic
    public createEpic(): Epic<EntityAction, IAppState>[] {
        return [...super.createEpic(), this.createEpicOfDML(), this.createEpicOfDMLForDirtyMode()];
    }

    private createEpicOfDML(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.INSERT, EntityActionTypeEnum.DELETE, EntityActionTypeEnum.UPDATE).pipe(
                filter(action =>
                    action.payload.entityType === this._entityType
                    && action.payload.phaseType === EntityActionPhaseEnum.TRIGGER
                    && !action.payload.dirtyMode),
                mergeMap(action => {
                    const bizModel = <U>action.payload.bizModel;
                    const bizModelId = action.payload.bizModelId;
                    let ret: Observable<IEntities>;
                    switch (action.type) {
                        case EntityActionTypeEnum.INSERT: {
                            ret = this.insert(bizModel, action.payload.files);
                            break;
                        }
                        case EntityActionTypeEnum.DELETE: {
                            ret = this.delete(bizModelId);
                            break;
                        }
                        case EntityActionTypeEnum.UPDATE: {
                            ret = this.update(bizModel, action.payload.files);
                            break;
                        }
                    }
                    return ret.pipe(
                        map(data => this.succeededAction(<EntityActionTypeEnum>(action.type), data)),
                        catchError((errResponse: any) => {
                            return of(this.failedAction(<EntityActionTypeEnum>(action.type),
                                errResponse.actionError, action.payload.actionId));
                        }),
                        startWith(this.startedAction(<EntityActionTypeEnum>(action.type))));
                }));
    }

    private createEpicOfDMLForDirtyMode(): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.INSERT, EntityActionTypeEnum.DELETE, EntityActionTypeEnum.UPDATE).pipe(
                filter(action =>
                    action.payload.entityType === this._entityType
                    && action.payload.phaseType === EntityActionPhaseEnum.TRIGGER
                    && action.payload.dirtyMode),
                mergeMap(action => {
                    const bizModel = <U>action.payload.bizModel;
                    const bizModelId = action.payload.bizModelId;
                    let dirtyType: DirtyTypeEnum;
                    let ret: Observable<IEntities>;
                    switch (action.type) {
                        case EntityActionTypeEnum.INSERT: {
                            dirtyType = DirtyTypeEnum.CREATED;
                            ret = this.insert(bizModel, action.payload.files);
                            break;
                        }
                        case EntityActionTypeEnum.DELETE: {
                            dirtyType = DirtyTypeEnum.DELETED;
                            ret = this.delete(bizModelId);
                            break;
                        }
                        case EntityActionTypeEnum.UPDATE: {
                            dirtyType = DirtyTypeEnum.UPDATED;
                            ret = this.update(bizModel, action.payload.files);
                            break;
                        }
                    }
                    return ret.pipe(
                        map(data => this.succeededAction(<EntityActionTypeEnum>(action.type), data)),
                        catchError((errResponse: any) => {
                            const entities = normalize([this.afterReceiveInner(bizModel)], this.schema).entities;
                            return of(this.addDirtyAction(bizModel.id, dirtyType)).pipe(
                                concat(of(this.succeededAction(<EntityActionTypeEnum>(action.type), entities),
                                    this.failedAction(<EntityActionTypeEnum>(action.type),
                                        errResponse.actionError, action.payload.actionId))));
                        }),
                        startWith<any>(this.startedAction(<EntityActionTypeEnum>(action.type)),
                            this.removeDirtyAction(bizModel.id)));
                }));
    }
    //#endregion

    //#region Protected methods

    protected insertEntity(bizModel: U, files: Map<string, FileUploader>, dirtyMode: boolean = false): string {
        const actionId = new ObjectID().toHexString();
        this._store.dispatch(this.insertAction(bizModel.id, bizModel, files, dirtyMode, actionId));
        return actionId;
    }

    protected updateEntity(bizModel: U, files: Map<string, FileUploader>, dirtyMode: boolean = false): string {
        if (dirtyMode && this.isDirtyExist(bizModel.id, DirtyTypeEnum.CREATED)) {
            return this.insertEntity(bizModel, files, dirtyMode);
        } else {
            const actionId = new ObjectID().toHexString();
            this._store.dispatch(this.updateAction(bizModel.id, bizModel, files, dirtyMode, actionId));
            return actionId;
        }
    }

    protected deleteEntity(bizModel: U | IBiz, dirtyMode: boolean = false): string {
        if (dirtyMode && this.isDirtyExist(bizModel.id, DirtyTypeEnum.CREATED)) {
            const entities = normalize(this.afterReceiveInner(<U>bizModel), this._entitySchema).entities;
            this._store.dispatch(this.removeDirtyAction(bizModel.id));
            this._store.dispatch(this.succeededAction(<EntityActionTypeEnum>(EntityActionTypeEnum.DELETE), entities));
        } else {
            const actionId = new ObjectID().toHexString();
            this._store.dispatch(this.deleteAction(bizModel.id, <U>bizModel, dirtyMode, actionId));
            return actionId;
        }
    }

    protected beforeSend(bizModel: U): any {
        return Object.assign({}, bizModel);
    }


    protected beforeSendInner(record: U | U[]): any {
        if (isArray(record)) {
            const ret = [];
            (<U[]>record).forEach((item) => {
                ret.push(this.beforeSend(<U>item));
            });
            return ret;
        } else {
            return this.beforeSend(<U>record);
        }
    }

    protected search(bizModel: U, searchKey: any): boolean {
        return false;
    }

    //#endregion

    //#region Private methods

    private isDirtyExist(dirtyId: string, dirtyType: DirtyTypeEnum): boolean {
        let found = false;
        const dirtyIds = this._store.getState().dirties.dirtyIds[getEntityKey(this._entityType)];

        if (dirtyIds && dirtyIds[dirtyType]) {
            Object.keys(dirtyIds[dirtyType]).forEach((key) => {
                if (dirtyIds[dirtyType][key] === dirtyId) {
                    found = true;
                }
            });
        }

        return found;
    }

    private insert(bizModel: U, files: Map<string, FileUploader>, ): Observable<IEntities> {
        const formData: FormData = new FormData();

        formData.append(getEntityKey(this._entityType), JSON.stringify(this.beforeSendInner(bizModel)));

        if (files) {
            for (const key of Array.from(files.keys())) {
                for (let i = 0; i < files.get(key).queue.length; i++) {
                    formData.append(`${key}${i}`, files.get(key).queue[i]._file, files.get(key).queue[i].file.name);
                }
                files.get(key).clearQueue();
            }
        }

        return this._http.post(`${WEBAPI_HOST}/${this._url}`, formData).pipe(
            map(records => {
                return normalize(this.afterReceiveInner(records), this.schema).entities;
            })
        );
    }

    private update(bizModel: U, files: Map<string, FileUploader>, ): Observable<IEntities> {
        const formData: FormData = new FormData();

        formData.append(getEntityKey(this._entityType), JSON.stringify(this.beforeSendInner(bizModel)));

        if (files) {
            for (const key of Array.from(files.keys())) {
                for (let i = 0; i < files.get(key).queue.length; i++) {
                    formData.append(`${key}${i}`, files.get(key).queue[i]._file, files.get(key).queue[i].file.name);
                }
                files.get(key).clearQueue();
            }
        }

        return this._http.put(`${WEBAPI_HOST}/${this._url}`, formData).pipe(
            map(records => {
                return normalize(this.afterReceiveInner(records), this.schema).entities;
            })
        );
    }

    private delete(id: string): Observable<IEntities> {
        return this._http.delete(`${WEBAPI_HOST}/${this._url}/${id}`).pipe(
            map(records => {
                return normalize(this.afterReceiveInner(records), this.schema).entities;
            })
        );
    }
    //#endregion

    //#region Public methdos

    public add(biz: U, files: Map<string, FileUploader> = null): Observable<U> {
        const actionId = this.insertEntity(biz, files);

        return this.getById(this._store, biz.id).pipe(
            filter((found) => !!found),
            race(this._errorService.getActionError$(actionId).pipe(
                map((err) => {
                    throw err;
                })))
        );
    }

    public change(biz: U, files: Map<string, FileUploader> = null): Observable<U> {
        const actionId = this.updateEntity(biz, files);

        return this.getById(this._store, biz.id).pipe(
            race(this._errorService.getActionError$(actionId).pipe(
                map((err) => {
                    throw err;
                })))
        );
    }

    public remove(biz: U): Observable<U> {
        const actionId = this.deleteEntity(biz);

        return this.getById(this._store, biz.id).pipe(
            filter((found) => !found),
            race(this._errorService.getActionError$(actionId).pipe(
                map((err) => {
                    throw err;
                })))
        );
    }

    public addById(id: string) {
        const toAdd = this.byId(id);
        if (!toAdd) { throw new Error(`${this._entityType} Id ${id} not exist!`); }

        this.insertEntity(toAdd, null, true);
    }

    public changeById(id: string) {
        const toChange = this.byId(id);
        if (!toChange) { throw new Error(`${this._entityType} Id ${id} not exist!`); }

        this.updateEntity(toChange, null, true);
    }

    public removeById(id: string) {
        this.deleteEntity({ id: id }, true);
    }

    public byId(id: string): U {
        return denormalize(id, this._entitySchema, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }
    //#endregion
}
