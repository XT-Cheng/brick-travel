import Immutable from 'seamless-immutable';

import { IAppState } from "../model";

export function getViewPoints(state : IAppState) {
    const {entities} = state;
    const {viewPoints,viewPointComments} = entities;

    let vps = (<any>viewPoints).asMutable({deep: true});

    vps.forEach(vp => {
        for (let i= 0;i<vp.comments.length;i++) {
            vp.comments[i] = viewPointComments.find(comment => {
                return comment.id === vp.comments[i]}
            );
        }
    });

    return vps;
}