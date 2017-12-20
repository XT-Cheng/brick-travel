import { Mongoose, Schema, Document, model } from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, arrayProp, pre } from 'typegoose';

export enum ViewPointCategory {
    View,
    Food,
    Humanities,
    Transportation,
    Shopping,
    Lodging
}

export class ViewPointComment extends Typegoose {
    @prop()
    detail: string;
    @prop()
    user: string;
    @prop()
    avatar: string;
    @prop()
    publishedAt: Date;
    @arrayProp({ items: String })
    images: string[];
    @prop()
    rate: number;
    @prop()
    createdAt: Date;
}

@pre<ViewPoint>('save', function (next) {
    if (this.isNew) this.createdAt = new Date();
    next();
})
export class ViewPoint extends Typegoose {
    @prop()
    name: string;
    @prop()
    description: string;
    @prop()
    tips: string;
    @prop()
    timeNeeded: string;
    @prop()
    thumbnail: string;
    @prop()
    address: string;
    @prop()
    latitude: number;
    @prop()
    longtitude: number;
    @prop({ enum: ViewPointCategory })
    category: ViewPointCategory;
    @prop()
    rank: number;
    @arrayProp({ items: String })
    images: string[];
    //countOfComments : number,
    @arrayProp({ items: ViewPointComment })
    comments: ViewPointComment[];
    @prop()
    createdAt: Date;
}

export var ViewPointModel = new ViewPoint().getModelForClass(ViewPoint);