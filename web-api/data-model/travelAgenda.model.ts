import { arrayProp, ModelType, prop, Ref, staticMethod, Typegoose } from '../typegoose/typegoose';
import { ViewPoint } from './viewPoint.model';

export enum TransportationCategory {
    Walking,
    SmallBus,
    BigBus,
    SelfDrive
}

export class TravelViewPoint extends Typegoose{
    @prop()
    _id: string;
    @prop()
    get id() : string {
        return this._id
    };
    set id(value) {
        this._id = value;
    }
    @prop({ enum: TransportationCategory })
    transportationToNext: TransportationCategory;
    @prop({ref: ViewPoint,idType: 'String'})
    viewPoint: Ref<ViewPoint>;
}

new TravelViewPoint().getModelForClass(TravelViewPoint, {
    schemaOptions: {
        toJSON: {
            virtuals: true,
            transform: (doc, ret, options) => {
                delete ret._id;
                return ret;
            }
        }
    }
});

export class DailyTrip extends Typegoose{
    @prop()
    _id: string;
    @prop()
    get id() : string {
        return this._id
    };
    set id(value) {
        this._id = value;
    }
    @arrayProp({items: TravelViewPoint})
    travelViewPoints : TravelViewPoint[];
}

new DailyTrip().getModelForClass(DailyTrip, {
    schemaOptions: {
        toJSON: {
            virtuals: true,
            transform: (doc, ret, options) => {
                delete ret._id;
                return ret;
            }
        }
    }
});

export class TravelAgenda extends Typegoose {
    @prop()
    _id: string;
    @prop()
    get id() : string {
        return this._id
    };
    set id(value) {
        this._id = value;
    }
    @prop()
    name: string;
    @prop()
    user: string;
    @prop()
    cover: string;
    @arrayProp({items: DailyTrip})
    dailyTrips:  DailyTrip[];
    @staticMethod
    static createTravelAgenda(this: ModelType<TravelAgenda> & typeof TravelAgenda,create: any) {
        return this.create(create);
    }
    @staticMethod
    static findTravelAgendas(this: ModelType<TravelAgenda> & typeof TravelAgenda) {
        return this.find().populate({
            path: 'dailyTrips.travelViewPoints.viewPoint',
            options: { 
                slice: {
                    'comments': [0,ViewPoint.commentsFirstLoad],
                }
             }
        });
    }
};

export var TravelAgendaModel = new TravelAgenda().getModelForClass(TravelAgenda, {
    schemaOptions: {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret, options) => {
                delete ret.__v;
                delete ret._id;
                return ret;
            }
        }
    }
});
