import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { AssignableFlag } from "Models/AssignableFlag";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionMoveFlag implements IAction
{
    unit: BaseCreep;
    target: AssignableFlag;
    primaryColor: ColorConstant;
    secondaryColor: ColorConstant;
    maxAssigned: number;

    thisRoomOnly: boolean;

    Act(): ActionResponseCode
    {
        this.GetSavedTarget();


        if (this.target == null)
        {
            this.unit.creep.say("!🚩(NF)");
            return ActionResponseCode.Repeat;
        }

        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        var actionCode = this.unit.MoveToPos(this.target.flag.pos);
        return this.WorkCodeProcessing(actionCode);
    }

    private GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        var rawTarget;
        if (targetId != null)
        {
            rawTarget = Game.flags[targetId];
        }
        if (rawTarget != null)
        {
            this.target = new AssignableFlag(rawTarget);
            if (this.target.CompareColors(this.primaryColor, this.secondaryColor))
            {
                if (this.target.isAssigned(this.unit.creep.id)) return;
            }
        }

      //  this.target = Finder.FindWhereIAmAssigned(this.unit.creep.id);

        if (this.target == null)
        {
            this.target = Finder.GetFlagByColors(this.primaryColor, this.secondaryColor, this.maxAssigned, this.unit.creep.id, this.unit.creep.room);

            if (this.target == null && !this.thisRoomOnly)
            {
                this.target = Finder.GetFlagByColors(this.primaryColor, this.secondaryColor, this.maxAssigned, this.unit.creep.id)
            }

            if (this.target != null)
            {
                this.target.Assign(this.unit.creep.id);
                this.unit.memory.assignedTo=this.target.flag.name;
            }
        }

        if (this.target != null)
        {
            this.unit.targetId = this.target.flag.name;
            var mem = this.unit.memory as BaseCreepMemory;
            mem.assignedTo = this.target.flag.name;
            this.unit.memory = mem;
        }
    }

    private EntryValidation(): ActionResponseCode
    {
        if (Utils.PosCompare(this.unit.creep.pos, this.target.flag.pos)) { return ActionResponseCode.NextTask; }
        return null;
    }

    private WorkCodeProcessing(code: number): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NO_PATH:
                this.unit.creep.say("!🚩(NP)");
                return ActionResponseCode.Repeat;
            case ERR_TIRED:
            case OK:
                this.unit.memory.actions.moved = true;
                this.unit.creep.say("🚩");
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. MoveToFlag error code: " + code);
                return ActionResponseCode.Repeat;
        }
    }

    //#region factory
    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
        this.thisRoomOnly = false;
        this.maxAssigned = 1;
    }
    WithColors(primaryColor: ColorConstant, secondaryColor: ColorConstant): ActionMoveFlag
    {
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        return this;
    }
    MaxAssigned(maxAssigned: number): ActionMoveFlag
    {
        this.maxAssigned = maxAssigned;
        return this;
    }

    BindToRoom(): ActionMoveFlag
    {
        this.thisRoomOnly = true;
        return this;
    }
    //#endregion

}
