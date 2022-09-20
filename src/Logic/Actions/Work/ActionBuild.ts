import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionBuild implements IAction
{
    unit: BaseCreep;
    target: ConstructionSite;

    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (!entryCode) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.build(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.energy == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId == null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<ConstructionSite>);
        }
        if (this.target != null)
                return; //Target is valid

        this.target = Finder.GetConstructionSites(this.unit.creep.pos);
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
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say(">🏗️");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked=true;
                this.unit.creep.say("🏗️");
                 return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Repair error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    RepeatAction(): boolean
    {
        throw("Not Implemented");
    }
}
