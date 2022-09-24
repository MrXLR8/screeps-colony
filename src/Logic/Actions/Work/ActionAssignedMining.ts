import { Constants } from "Constans";
import { assign } from "lodash";
import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { HeavyMinerCreep } from "Models/Creeps/HeavyMiner";
import { IAssignable } from "Models/Interfaces/IAssignable";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionAssignedMining implements IAction
{
    unit: IAssignable;
    target: Source;

    lookForClosest: boolean;

    constructor(unit: IAssignable)
    {
        this.unit = unit as IAssignable;
    }

    EntryValidation(): ActionResponseCode
    {
        if ((this.unit.creep.getActiveBodyparts(WORK) * 2) > this.unit.AmmountCanCarry()) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        this.target = Game.getObjectById<Id<Source>>(this.unit.memory.assignedTo as Id<Source>);
        if(this.target==null) this.unit.Assign();
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say(">⛏️");
                return ActionResponseCode.Repeat;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.unit.creep.say("!⛏️");
                return ActionResponseCode.Reset;
            case OK:
                this.unit.memory.actions.worked = true;
                this.unit.memory.actionAttempts = 0;
                this.unit.creep.say("⛏️");
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Mining error code: " + code);
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

        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) { this.unit.creep.say("!⛏️"); return ActionResponseCode.NextTask; }
        var actionCode = this.unit.creep.harvest(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

}
