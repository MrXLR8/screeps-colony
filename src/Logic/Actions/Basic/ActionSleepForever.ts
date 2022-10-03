import { ActionResponseCode } from "Models/ActionResponseCode";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";
export class ActionSleepForever implements IAction
{

    unit: Unit;
    constructor(unit: Unit)
    {
        this.unit = unit;
    }

    Act(): ActionResponseCode
    {
        this.unit.memory.haltUntil=Number.MAX_SAFE_INTEGER;
        return ActionResponseCode.Repeat;
    }
}
