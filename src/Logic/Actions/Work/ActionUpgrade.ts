import { Constants } from "Constans";
import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionUpgrade implements IAction
{
    unit: BaseCreep;
    target: StructureController;

    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
    }


    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        this.target=this.unit.creep.room.controller;
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say(">⬆️");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                this.unit.creep.say("⬆️");
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Upgrade error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    RepeatAction(): boolean
    {
       throw ("Not implemented");
    }


    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
       if (entryCode!=null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.upgradeController(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

}
