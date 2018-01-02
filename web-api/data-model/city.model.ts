import { Mongoose, Schema, Document, model } from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, arrayProp, pre, instanceMethod, staticMethod } from 'typegoose';

export class City extends Typegoose {
    @prop()
    name: string;
    @prop()
    thumbnail: string;
    @staticMethod
    static findCities(this: ModelType<City> & typeof City) {
        return this.find();
    }
}

export var CityModel = new City().getModelForClass(City, {
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
