import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { AssignableFlag } from "Models/AssignableFlag";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionMoveToRoom implements IAction
{
    unit: BaseCreep;
    target: StructureController;

    Act(): ActionResponseCode
    {
        this.GetSavedTarget();


        if (this.target == null)
        {
            this.unit.creep.say("!🥾");
            return ActionResponseCode.Repeat;
        }

        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        var actionCode = this.unit.MoveToPos(this.target.pos);
        return this.WorkCodeProcessing(actionCode);
    }

    private GetSavedTarget(): void
    {
        var targetId = this.unit.memory.assignedTo;
        this.target = Game.getObjectById<Id<StructureController>>(targetId as Id<StructureController>);
    }

    private EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.room.name == this.target.room.name)
        {
            //this.unit.MoveToTarget(this.unit.creep.room.controller);
            return ActionResponseCode.NextTask;
        }
        return null;
    }


    private WorkCodeProcessing(code: CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NO_PATH:
                this.unit.creep.say("!🥾(NP)");
                return ActionResponseCode.Repeat;
            case ERR_TIRED:
            case OK:
                this.unit.memory.actions.moved = true;
                this.unit.creep.say(">🥾");
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. MoveToRoom error code: " + code);
                return ActionResponseCode.Repeat;
        }
    }

    constructor(unit: Unit,)
    {
        this.unit = unit as BaseCreep;
    }

}
