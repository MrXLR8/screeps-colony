import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { AssignableFlag } from "Models/AssignableFlag";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { HeavyMinerMemory } from "Models/Creeps/HeavyMiner";
import { AssignableFlagMemory } from "Models/Memory/AssignableFlagMemory";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionMoveFlag implements IAction
{
    unit: BaseCreep;
    target: AssignableFlag;
    primaryColor: ColorConstant;
    secondaryColor: ColorConstant;

    maxAssigned: number;

    constructor(unit: Unit, primaryColor: ColorConstant, secondaryColor: ColorConstant, maxAssigned: number)
    {
        this.unit = unit as BaseCreep;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.maxAssigned = maxAssigned;
    }

    Act(): ActionResponseCode
    {
        this.GetSavedTarget();

        var entryCode = this.EntryValidation();
        if (!entryCode) return entryCode;

        if (this.target == null)
        {
            this.unit.creep.say("!🚩(NF)");
            return ActionResponseCode.Repeat;
        }

        var actionCode = this.unit.creep.moveTo(this.target.flag);

        return this.WorkCodeProcessing(actionCode);
    }

    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.pos.isEqualTo(this.target.flag.pos)) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId == null)
        {
            var rawTarget = Game.flags[targetId];
        }
        if (rawTarget != null)
        {
            this.target = new AssignableFlag(rawTarget);

            if (this.target.CompareColors(this.primaryColor, this.secondaryColor))
            {
                this.target.isAssigned(this.unit.creep.id);
                return; //Target is valid
            }
        }

        this.target = Finder.GetFlagByColors(this.primaryColor, this.secondaryColor, this.maxAssigned, this.unit.creep.id);
        if (this.target != null)
        {
            this.target.Assign(this.unit.creep.id);
            var mem = this.unit.memory as HeavyMinerMemory;
            mem.flagName=this.target.flag.name;
            this.unit.memory=mem;
        }
    }

    WorkCodeProcessing(code: CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NO_PATH:
                this.unit.creep.say("!🚩(NP)");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.moved = true;
                this.unit.creep.say(">🚩");
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. MoveToFlag error code: " + code);
                return ActionResponseCode.Repeat;
        }
    }

    RepeatAction(): boolean
    {
        throw ("Not Implemented");
    }
}
