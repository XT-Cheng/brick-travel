import { Mongoose, Schema, Document, model } from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, arrayProp, pre, instanceMethod, staticMethod } from 'typegoose';

export class FilterCriteria {
    @prop()
    _id: string;
    @prop()
    name: string;
    @prop()
    criteria: string;
}

export class FilterCategory extends Typegoose {
    @prop()
    _id: string;
    @prop()
    name: string;
    @prop()
    filterFunction: string;
    @arrayProp({ items: FilterCriteria })
    criteries: FilterCriteria[];
    @staticMethod
    static findFilterCategories(this: ModelType<FilterCategory> & typeof FilterCategory) {
        return this.find();
    }
}

export var FilterCategoryModel = new FilterCategory().getModelForClass(FilterCategory, {
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
