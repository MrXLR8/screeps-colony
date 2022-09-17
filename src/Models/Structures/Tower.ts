import { Constants } from "Constans";
import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseStructure } from "./BaseStructure";

export class Tower extends BaseStructure
{
    tasks = [this.ActAttack, this.ActRepair];

    structure: StructureTower;
    constructor(structure: StructureTower)
    {
        super(structure);
    }

    ActAttack(): ActionResponseCode
    {
        var target = this.GetTarget<Creep>();

        if (target == null)
        {
            target = this.structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }
        if (target == null) return ActionResponseCode.NextTask;

        this.memory.targetID = target.id;

        this.structure.attack(target);
        return ActionResponseCode.Repeat;
    }

    ActRepairWalls(): ActionResponseCode
    {
        //todo target cache
        var percent: number = Utils.Percent(this.structure.store.getUsedCapacity(RESOURCE_ENERGY), this.structure.store.getCapacity(RESOURCE_ENERGY));
        //  if(this.structure.room.energyAvailable!=this.structure.energyCapacity) return false;

        if (percent < Constants.towerEnergyReserve)
        {
            return ActionResponseCode.NextTask;
        }
        var damaged = Finder.GetDamagedWalls(this.structure.room);
        if (damaged == null || damaged == undefined)
        {
            return ActionResponseCode.NextTask;
        }

        this.structure.repair(damaged);
        return ActionResponseCode.Reset;

    }

    ActRepair(): ActionResponseCode
    {
        var percent: number = Utils.Percent(this.structure.store.getUsedCapacity(RESOURCE_ENERGY), this.structure.store.getCapacity(RESOURCE_ENERGY));
        if (percent < Constants.towerEnergyReserve)
        {
            return ActionResponseCode.Reset;
        }
        var damaged = Finder.GetRandomDamagedStructuresNoPercent(this.structure.room);

        if (damaged == null || damaged == undefined)
        {
            return ActionResponseCode.NextTask;
        }
        this.structure.repair(damaged);
        return ActionResponseCode.NextTask;
    }

}
