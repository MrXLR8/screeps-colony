import { create, max } from "lodash";
import { Utils } from "Logic/Utils";
import { BaseCreep } from "Models/Creeps/BaseCreep";

export class Storage
{


    storage: StructureContainer | StructureStorage | StructureLink | Tombstone | Resource | Ruin;

    building: StructureContainer | StructureStorage | StructureLink;
    salvage: Tombstone | Ruin;
    resource: Resource;

    resourceConstant: ResourceConstant;
    constructor(store: StructureContainer | StructureStorage | StructureLink | Tombstone | Resource | Ruin, resourceType: ResourceConstant)
    {
        this.storage = store;
        this.resourceConstant = resourceType;
        if (store instanceof Resource)
            this.resource = store;
        else if (store instanceof Tombstone)
        {
            this.salvage = store;
        }
        else if (store instanceof Ruin)
        {
            this.salvage = store;
        }
        else
        {
            this.building = store;
        }
    }

    Gather(creep: BaseCreep): ScreepsReturnCode
    {
        if (this.resource != null) return creep.creep.pickup(this.resource);
        if (this.salvage != null) return creep.creep.withdraw(this.salvage, this.resourceConstant);
        else
        {
            return creep.creep.withdraw(this.building, this.resourceConstant);
        }
    }

    Put(creep: BaseCreep): ScreepsReturnCode
    {
        if (this.resource != null) return ERR_INVALID_TARGET;
        if (this.salvage != null) return ERR_INVALID_TARGET;
        else
        {
            return creep.creep.transfer(this.building, this.resourceConstant);
        }
    }



    get ammount(): number
    {
        if (this.resource != null) return this.resource.amount;
        if (this.salvage != null) return this.salvage.store.getUsedCapacity(this.resourceConstant);
        else
        {
            return this.building.store.getUsedCapacity(this.resourceConstant);
        }
    }

    get maxAmmount(): number
    {
        if (this.resource != null) return this.resource.amount;
        if (this.salvage != null) return this.salvage.store.getCapacity(this.resourceConstant);
        else
        {
            return this.building.store.getCapacity(this.resourceConstant);
        }
    }

    get freeSpace(): number
    {
        if (this.resource != null) return 0;
        if (this.salvage != null) return 0;
        else
        {
            return this.building.store.getFreeCapacity(this.resourceConstant);
        }
    }

    get percentUsed(): number
    {
        return Utils.Percent(this.ammount, this.maxAmmount);
    }

}
