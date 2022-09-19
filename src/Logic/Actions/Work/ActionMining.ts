import { Constants } from "Constans";
import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { IAction } from "../IAction";

export class ActionMining implements IAction
{
    unit: BaseCreep;
    target: Source;

    constructor(creep: BaseCreep)
    {
        this.unit = creep as BaseCreep;
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (!entryCode) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.harvest(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getFreeCapacity() == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId == null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<Source>);
        }
        if (this.target != null)
        {
            if (this.target.energy !=0)
            {
                return; //Target is valid
            }
        }

        this.target = Finder.GetRandomSource(this.unit.creep.room);

        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.memory.actionAttempts++;
                if (this.unit.memory.actionAttempts > Constants.moveAttmepts)
                {
                    return ActionResponseCode.Reset;
                }

                this.unit.MoveToTarget(this.target);
                this.unit.creep.say(">⛏️");
                return ActionResponseCode.Repeat;
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

}