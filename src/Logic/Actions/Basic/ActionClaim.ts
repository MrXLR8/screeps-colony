import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionClaim implements IAction
{
    unit: BaseCreep;
    target: StructureController;

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();
        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.claimController(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

   private EntryValidation(): ActionResponseCode
    {
        if (typeof this.unit.creep.room.controller.owner === 'undefined') return null;
        if (this.unit.creep.room.controller.owner.username == this.unit.creep.owner.username) { this.unit.creep.say("✔️"); return ActionResponseCode.Repeat; }
        return null;
    }

    private GetSavedTarget(): void
    {
        this.target = this.unit.creep.room.controller;
    }

    private WorkCodeProcessing(code: ScreepsReturnCode | ERR_FULL | ERR_GCL_NOT_ENOUGH): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say("🎪");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Claim error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }


    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
    }
}
