import { ActionResponseCode } from "Models/ActionResponseCode";
import { IAction } from "../IAction";
import { Unit } from "Models/Unit";
import { EnergySource } from "Models/Structures/EnergySource";
import { BaseCreep } from "Models/Creeps/BaseCreep";
export class ActionSourceDispose implements IAction
{
    unit: EnergySource;
    target: StructureLink;

    assignedMinerId: string;
    asssignedHaulerId: string;


    constructor(unit: Unit)
    {
        this.unit = unit as EnergySource;
    }

    EntryValidation(): ActionResponseCode
    {
        return null;
    }

    GetSavedTarget(): void
    {
        var assignedMinerId = this.unit.memory.myMiner;
        var asssignedHaulerId = this.unit.memory.myHauler;
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {

        throw ("Not Implemented");
    }

    RepeatAction(): boolean
    {
        throw ("Not Implemented");
    }

    Act(): ActionResponseCode
    {

        this.GetSavedTarget();

        if (this.assignedMinerId != null)
        {
            if (Game.getObjectById<Creep>(this.assignedMinerId as Id<Creep>) == null)
            {
                this.unit.memory.myMiner = null;
            }
        }

        if (this.asssignedHaulerId != null)
        {
            if (Game.getObjectById<Creep>(this.asssignedHaulerId as Id<Creep>) == null)
            {
                this.unit.memory.myHauler = null;
            }
        }

        return ActionResponseCode.Repeat;
    }
}
