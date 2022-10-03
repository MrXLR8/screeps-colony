import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { AssignableFlag } from "Models/AssignableFlag";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { IAssignable } from "Models/Interfaces/IAssignable";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";
import { profile } from "../../../../screeps-typescript-profiler/Profiler";
@profile
export class ActionAttackFlag implements IAction
{
    private unit: IAssignable;
    private target: AnyCreep | Structure;
    private foundFlag: Flag;

    Act(): ActionResponseCode
    {
        this.GetSavedTarget();


        if (this.target == null)
        {
            if (this.foundFlag == null)
            {
                this.unit.creep.say("!🚩(NF)");
                return ActionResponseCode.Repeat;
            }
            else
            {
                this.unit.MoveToTarget(this.foundFlag);
                this.unit.creep.say("🚩");
                return ActionResponseCode.Repeat;
            }
        }


        var actionCode = this.unit.creep.attack(this.target);
        return this.WorkCodeProcessing(actionCode);
    }


    private GetTargetOnFlag()
    {
        if(typeof this.foundFlag.room==='undefined') return;
        this.target = this.foundFlag.pos.findInRange(FIND_HOSTILE_CREEPS, 1)[0];
        if (this.target == null) this.target = this.foundFlag.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1)[0];
        if(this.target==null) this.foundFlag.remove();
    }
    private GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        this.target = Game.getObjectById<Id<AnyCreep | Structure>>(targetId as Id<AnyCreep | Structure>);

        if (this.target != null)
        {
            this.foundFlag = Game.flags[this.unit.memory.assignedTo];
            this.foundFlag.pos = this.target.pos;
            return;
        }


        if (this.unit.memory.assignedTo == null)
        {
            this.unit.Assign();
            if (this.unit.memory.assignedTo == null) return;
        }

        this.foundFlag = Game.flags[this.unit.memory.assignedTo];
        if (this.foundFlag==null)
        {
            this.unit.memory.assignedTo = null;
            return;
        }

        this.GetTargetOnFlag();


        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }



    private WorkCodeProcessing(code: number): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target);
                this.unit.memory.actions.moved = true;
                this.unit.creep.say("⚔️");
                return ActionResponseCode.Repeat;
            case ERR_NO_PATH:
                this.unit.creep.say("!🚩(NP)");
                return ActionResponseCode.Repeat;
            case ERR_TIRED:
            case OK:
                this.unit.memory.actions.attacked = true;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Attack error code: " + code);
                return ActionResponseCode.Repeat;
        }
    }

    //#region factory
    constructor(unit: Unit)
    {
        this.unit = unit as IAssignable;
    }
    //#endregion

}
