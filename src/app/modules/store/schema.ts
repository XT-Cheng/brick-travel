import { schema } from 'normalizr';

export const comment = new schema.Entity('comments');

export const viewPoint = new schema.Entity('viewPoints',{
    comments: [ comment ]
});
