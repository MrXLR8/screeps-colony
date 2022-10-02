import { create, max } from "lodash";
import { Utils } from "Logic/Utils";
import { BaseCreep } from "Models/Creeps/BaseCreep";

export class Storage
{

    building: StructureContainer | StructureStorage | StructureLink;
    salvage: Tombstone | Ruin;
    resourceObject: Resource;

    resourceConstant: ResourceConstant;
    constructor(gameObject: StructureContainer | StructureStorage | StructureLink | Tombstone | Resource | Ruin, resourceType?: ResourceConstant)
    {

        this.building = null;
        this.salvage = null;
        this.resourceObject = null;

        this.resourceConstant = resourceType;
        if (gameObject instanceof Resource)
        {
            if (typeof this.resourceConstant === 'undefined')
                this.resourceConstant = gameObject.resourceType;
            this.resourceObject = gameObject;
            return;
        }

        if (gameObject instanceof Tombstone)
        {
            this.salvage = gameObject;
        }
        else if (gameObject instanceof Ruin)
        {
            this.salvage = gameObject;
        }
        else
        {
            this.building = gameObject;
        }

        if (typeof this.resourceConstant === 'undefined')
        {
            this.resourceConstant = _.filter(Object.keys(gameObject.store), resource => gameObject.store[resource as ResourceConstant] > 0)[0] as ResourceConstant;
        }
    }

    Gather(creep: BaseCreep): ScreepsReturnCode
    {
        if (this.resourceObject != null) { return creep.creep.pickup(this.resourceObject); }
        if (this.salvage != null) { return creep.creep.withdraw(this.salvage, this.resourceConstant); }
        else
        {
            return creep.creep.withdraw(this.building, this.resourceConstant);
        }
    }

    Put(creep: BaseCreep): ScreepsReturnCode
    {
        if (this.resourceObject != null) return ERR_INVALID_TARGET;
        if (this.salvage != null) return ERR_INVALID_TARGET;
        else
        {
            return creep.creep.transfer(this.building, this.resourceConstant);
        }
    }



    get ammount(): number
    {
        if (this.resourceObject != null)
        {
            if (this.resourceObject.resourceType != this.resourceConstant) return 0;
            return this.resourceObject.amount;
        }
        if (this.salvage != null) return this.salvage.store.getUsedCapacity(this.resourceConstant);
        else
        {
            return this.building.store.getUsedCapacity(this.resourceConstant);
        }
    }

    get maxAmmount(): number
    {
        if (this.resourceObject != null) return this.resourceObject.amount;
        if (this.salvage != null) return this.salvage.store.getCapacity(this.resourceConstant);
        else
        {
            return this.building.store.getCapacity(this.resourceConstant);
        }
    }

    get freeSpace(): number
    {
        if (this.resourceObject != null) return 0;
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

    get id(): string
    {
        if (this.resourceObject != null) return this.resourceObject.id;
        if (this.salvage != null) return this.salvage.id;

        return this.building.id;
    }

    get pos(): RoomPosition
    {
        if (this.resourceObject != null) return this.resourceObject.pos;
        if (this.salvage != null) return this.salvage.pos;

        return this.building.pos;
    }

}
