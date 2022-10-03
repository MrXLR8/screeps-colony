import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { BaseStructure } from "Models/Structures/BaseStructure";
import { IAction } from "../IAction";
import { Tower } from "Models/Structures/Tower";
import { Unit } from "Models/Unit";
import { profile } from "../../../../screeps-typescript-profiler/Profiler";
@profile
export class ActionTowerAttack implements IAction
{
    unit: Tower;
    target: Creep;


    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.structure.attack(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

    private EntryValidation(): ActionResponseCode
    {
        if (this.unit.structure.store[RESOURCE_ENERGY] == 0) return ActionResponseCode.NextTask;
        return null;
    }

    private GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId != null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<Creep>);
        }
        if (this.target != null)
            return; //Target is valid

        this.target = this.unit.structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }

    private WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case OK:
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.Repeat;
            case ERR_NOT_ENOUGH_RESOURCES | ERR_NOT_ENOUGH_ENERGY:
                Game.notify("TOWER CANNOT ATTACK. LOW ON RESOURCES");
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. TowerAttack error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    constructor(unit: Unit)
    {
        this.unit = unit as Tower;
    }
}
