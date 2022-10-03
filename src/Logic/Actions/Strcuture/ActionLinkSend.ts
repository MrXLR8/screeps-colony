import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { BaseStructure } from "Models/Structures/BaseStructure";
import { IAction } from "../IAction";
import { Tower } from "Models/Structures/Tower";
import { Unit } from "Models/Unit";
import { Link } from "Models/Structures/Link";
import { link } from "fs";
import { profile } from "../../../../screeps-typescript-profiler/Profiler";
@profile
export class ActionLinkSend implements IAction
{
    unit: Link;
    target: StructureLink;

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();


        if (this.target == null) return ActionResponseCode.Repeat;

        if (this.target.id == this.unit.structure.id) return ActionResponseCode.Repeat;
        if (this.target.store.getFreeCapacity(RESOURCE_ENERGY) < 50) return ActionResponseCode.Repeat;
        var actionCode = this.unit.structure.transferEnergy(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

    private EntryValidation(): ActionResponseCode
    {
        if (this.unit.structure.cooldown > 0)
        {
            this.unit.memory.haltUntil = Game.time + this.unit.structure.cooldown;
            return ActionResponseCode.Repeat;
        }
        if (this.unit.structure.store[RESOURCE_ENERGY] == 0) return ActionResponseCode.Repeat;
        return null;
    }

    private GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId != null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<StructureLink>);
        }
        if (this.target != null)
            return; //Target is valid


        var flag = this.unit.structure.room.find(FIND_FLAGS, { filter: (flag) => { return flag.color == COLOR_YELLOW && flag.secondaryColor == COLOR_WHITE } })[0];
        if (flag != null)
        {
            this.target = flag.pos.lookFor<"structure">("structure")[0] as StructureLink;
        }
        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }

    private WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_TIRED:
                this.unit.memory.haltUntil = Game.time + this.unit.structure.cooldown;
            case OK:
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Link error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    constructor(unit: Unit)
    {
        this.unit = unit as Link;
    }

}
