import { TickAction } from "Models/Data/TickAction";

export class BaseStructureMemory
{
    targetID: string;
    actionAttempts: number = 0;
    taskNumber: number = 0;
    actions:TickAction = new TickAction();
}
