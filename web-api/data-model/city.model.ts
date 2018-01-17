import { ModelType, prop, staticMethod, Typegoose } from 'typegoose';
import { ObjectId } from 'mongodb';

export class City extends Typegoose {
    @prop()
    _id: string;
    @prop()
    name: string;
    @prop()
    thumbnail: string;
    @staticMethod
    static findCities(this: ModelType<City> & typeof City) {
        return this.find();
    }
    @staticMethod
    static createCity(this: ModelType<City> & typeof City,create: any) {
        return this.create(create);
    }
}

export var CityModel = new City().getModelForClass(City, {
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
