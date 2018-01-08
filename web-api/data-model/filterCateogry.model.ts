import { Mongoose, Schema, Document, model } from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, arrayProp, pre, instanceMethod, staticMethod } from 'typegoose';

export class FilterCriteria {
    @prop()
    name: string;
    @prop()
    criteria: string;
}

export class FilterCategory extends Typegoose {
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
                ret.id = ret._id;
                if (ret.criteries) {
                    ret.criteries = ret.criteries.map((criteria) => {
                        criteria.id = criteria._id;
                        delete criteria._id;
                        return criteria;
                    })
                };
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
});
