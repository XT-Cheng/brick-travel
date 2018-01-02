import { Mongoose, Schema, Document, model } from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, arrayProp, pre, instanceMethod, staticMethod } from 'typegoose';

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
    private static readonly commentsPerLoad = 2;

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
    static loadComments(this: ModelType<ViewPoint> & typeof ViewPoint, id: string,skip: number,limit: number) {
        return this.findById(id).slice('comments',[skip,limit]).select('comments');
    }
    @staticMethod
    static findViewPoints(this: ModelType<ViewPoint> & typeof ViewPoint) {
        return this.find().slice('comments',[0,ViewPoint.commentsPerLoad]);
    }
    @staticMethod
    static createViewPoint(this: ModelType<ViewPoint> & typeof ViewPoint, create: any) {
        return this.create(create);
    }
}

export var ViewPointModel = new ViewPoint().getModelForClass(ViewPoint, {
    schemaOptions: {
        timestamps: true,
        toJSON: {
            transform: (doc, ret, options) => {
                ret.id = ret._id;
                if (ret.comments) {
                    ret.comments = ret.comments.map((comment) => {
                        delete comment._id;
                        return comment;
                    })
                };
                delete ret._id;
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
