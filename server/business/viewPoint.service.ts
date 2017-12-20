import { ViewPointModel, ViewPointCategory, ViewPoint, ViewPointComment } from "../data-model/viewPoint.model";

export class ViewPointService {
    

    public static loadComment(id: string, skip: number, limit: number): ViewPointComment[] {
        return null;
        // return ViewPointModel.findById(id).slice('comments',[skip,limit]).exec() //
        //     .then(viewPoint => {
        //         return viewPoint.comments;
        //     })
    }

    public static async  insert(payload: any): Promise<void> {
        await Object.assign(new ViewPointModel(), payload).save();
    }

    public static async addComment(id: string, payload: any): Promise<void> {
        let viewPoint = await ViewPointModel.findById(id)
        if (viewPoint == null) throw new Error("ViewPoint Id " + id + " not exist");
        payload.createdAt = new Date();
        viewPoint.comments.push(payload);
        await viewPoint.save();
    }

    public static async load(): Promise<any> {
        let ret = await ViewPointModel.find();
        return ret;
        // let results = [];
        // let eqpNames = [];
        //1. Find equipment_status
        // return ViewPointModel.find().slice('comments',[0,2]).exec()
        //     .then(viewPoints => {
        //         // viewPoints.forEach(viewPoint => {
        //         //     var ret = {
        //         //         name: viewPoint.name,
        //         //         currentStatus: viewPoint.currentStatus,
        //         //         currentShift: viewPoint.workShift,
        //         //         shiftYield: 0,
        //         //         shiftScrap: 0,
        //         //         currentOrder: ''
        //         //     };
        //         //     results.push(ret);
        //         //     eqpNames.push(viewPoint.name);
        //         // });

        //         //return results;

        //         return viewPoints;
        //     });
    }
}