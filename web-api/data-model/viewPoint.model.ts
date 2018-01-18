import { Mongoose, Schema, Document, model } from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, arrayProp, pre, instanceMethod, staticMethod, Ref } from 'typegoose';
import { City } from './city.model';

export enum ViewPointCategory {
    View,
    Food,
    Humanities,
    Transportation,
    Shopping,
    Lodging
}

export class ViewPointComment {
    @prop()
    _id: string;
    @prop()
    detail: string;
    @prop()
    user: string;
    @prop()
    avatar: string;
    @prop({ default: Date.now })
    publishedAt: Date;
    @arrayProp({ items: String })
    images: string[];
    @prop()
    rate: number;
}

export class ViewPoint extends Typegoose {
    public static readonly commentsPerLoad = 2;
    @prop()
    _id: string;
    @prop()
    name: string;
    @prop({ref: City})
    city: Ref<City>;
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
    @prop({ default: 0 })
    countOfComments: number;
    @arrayProp({ items: ViewPointComment })
    comments: ViewPointComment[];
    @instanceMethod
    addComment(this: InstanceType<ViewPoint>, comment: ViewPointComment) {
        this.comments.push(comment);
        this.countOfComments++;
        return this.save();
    }
    @staticMethod
    static loadComments(this: ModelType<ViewPoint> & typeof ViewPoint, id: string, skip: number) {
        //NOTE: https://stackoverflow.com/questions/7670073/how-to-combine-both-slice-and-select-returned-keys-operation-in-function-update
        return this.findById(id).slice('comments', [skip, ViewPoint.commentsPerLoad])
            .select({
                name: 0,
                updatedAt: 0,
                createdAt: 0,
                _id: 0,
                description: 0,
                tips: 0,
                timeNeeded: 0,
                thumbnail: 0,
                address: 0,
                latitude: 0,
                longtitude: 0,
                category: 0,
                rank: 0,
                images: 0,
                countOfComments: 0
            });
    }
    @staticMethod
    static findViewPoints(this: ModelType<ViewPoint> & typeof ViewPoint) {
        return this.find().slice('comments', [0, ViewPoint.commentsPerLoad]);
    }
    @staticMethod
    static findViewPointsByCity(this: ModelType<ViewPoint> & typeof ViewPoint, cityId : string) {
        return this.find({city: cityId}).slice('comments', [0, ViewPoint.commentsPerLoad]);
    }
}

export var ViewPointModel = new ViewPoint().getModelForClass(ViewPoint, {
    schemaOptions: {
        timestamps: true,
        toJSON: {
            transform: (doc, ret, options) => {
                delete ret.__v;
                return ret;
            }
        }
    }
});

//#region Classic mongoose
// var childSchma = new Schema({
//     user : String
// },{timestamps: true});
// childSchma.pre('save',(next)=> {
//     console.log('pre save child');
//     next();
// })

// var blogSchema = new Schema({
//     title:  String,
//     author: String,
//     users : [childSchma]
//   },{timestamps: true});

// blogSchema.pre('save',(next)=> {
//     console.log('pre save blog');
//     next();
// })

// export var blogModel = model('blog',blogSchema);
//#endregion
