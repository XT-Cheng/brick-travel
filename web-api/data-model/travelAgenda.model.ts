import { arrayProp, ModelType, prop, Ref, staticMethod, Typegoose } from '../typegoose/typegoose';
import { ViewPoint } from './viewPoint.model';

export enum TransportationCategory {
    Walking,
    SmallBus,
    BigBus,
    SelfDrive
}

export class TravelViewPoint {
    @prop()
    _id: string;
    @prop({ enum: TransportationCategory })
    transportationToNext: TransportationCategory;
    @prop({ref: ViewPoint})
    viewPoint: Ref<ViewPoint>;
}

export class DailyTrip {
    @prop()
    _id: string;
    @arrayProp({items: TravelViewPoint})
    travelViewPoints : TravelViewPoint[];
}

export class TravelAgenda extends Typegoose {
    @prop()
    _id: string;
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
                    'comments': [0,ViewPoint.commentsPerLoad],
                }
             }
        });
    }
};

export var TravelAgendaModel = new TravelAgenda().getModelForClass(TravelAgenda, {
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
