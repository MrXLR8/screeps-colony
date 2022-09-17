import { Constants } from "Constans";
import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";

export class Tower
{
    structure: StructureTower;
    constructor(structure: StructureTower)
    {
        this.structure = structure;
    }

    Act()
    {

        if (!this.ActAttack())
        {
            if (!this.ActRepair())
            {
                this.ActRepairWalls();
            }
        }
    }


    ActAttack(): boolean
    {
        var hostile: Creep = this.structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile == null || hostile == undefined) return false;
        this.structure.attack(hostile);
        return true;
    }

    ActRepairWalls(): boolean
    {
        return false;
        /*
                var percent: number = Utils.Percent(this.structure.store.getUsedCapacity(RESOURCE_ENERGY), this.structure.store.getCapacity(RESOURCE_ENERGY));
              //  if(this.structure.room.energyAvailable!=this.structure.energyCapacity) return false;

                if (percent < Constants.towerEnergyReserve)
                {
                    return false;
                }
                var damaged = Finder.GetDamagedWalls(this.structure.room);
                if (damaged == null || damaged == undefined)
                {
                    return false;
                }

                this.structure.repair(damaged);
                return true;
                */
    }

    ActRepair(): boolean
    {
        var percent: number = Utils.Percent(this.structure.store.getUsedCapacity(RESOURCE_ENERGY), this.structure.store.getCapacity(RESOURCE_ENERGY));
        if (percent < Constants.towerEnergyReserve)
        {
            return false;
        }
        var damaged = Finder.GetRandomDamagedStructuresNoPercent(this.structure.room);

        if (damaged == null || damaged == undefined)
        {
            return false;
        }
        this.structure.repair(damaged);
        return true;
    }

}
