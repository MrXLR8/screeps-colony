import { forEach } from "lodash";
import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionGatherFromFlag implements IAction
{
    unit: BaseCreep;
    target: StructureContainer | StructureStorage | StructureLink;

    primaryColor: ColorConstant;

    secondaryColor: ColorConstant;

    constructor(unit: Unit, primaryColor: ColorConstant, secondaryColor: ColorConstant)
    {
        this.unit = unit as BaseCreep;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
    }




    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getFreeCapacity() == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId != null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<StructureContainer | StructureStorage | StructureLink>);
        }
        if (this.target != null)
        {
            if (this.target.store.getUsedCapacity(RESOURCE_ENERGY) > this.unit.AmmountCanCarry())
            {
                return; //Target is valid
            }
        }

        this.target = this.FlagSearch();

        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }


    FlagSearch(): StructureContainer | StructureStorage | StructureLink
    {
        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            if (flag.color == this.primaryColor && flag.secondaryColor == this.secondaryColor)
            {
                if (flag.room != this.unit.creep.room) return null;
                var found = flag.pos.lookFor<"structure">("structure")[0] as StructureContainer | StructureStorage | StructureLink;
                if (found.store.getUsedCapacity(RESOURCE_ENERGY) > this.unit.AmmountCanCarry()) return found;
            }
        }
        return null;
    }

    RepeatAction(): boolean
    {
        throw ("Not implemented");
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say(">⚡");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.creep.say("⚡");
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.NextTask;
            default:
                this.unit.log("Problem occured. Gather error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.withdraw(this.target, RESOURCE_ENERGY);

        return this.WorkCodeProcessing(actionCode);
    }
}
