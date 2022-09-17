import { BaseCreep } from "Models/Creeps/BaseCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { GlobalMemory } from "Models/Memory/GlobalMemory";

export class TargetSystem
{
    creep: BaseCreep;
    constructor(creep: BaseCreep)
    {
        this.creep = creep;
    }


    ReserveASlot(targetID: string, limit: number): boolean
    {
        var mem: GlobalMemory = Memory as GlobalMemory;
        var object: string[] = mem.targets[targetID];
        if (object != null || object != undefined)
        {
            if (object.length + 1 > limit)
            {
                this.creep.log("Target is busy. Now: " + object.length + " . Limit is: " + limit);
                return false;
            }
        }
        this.creep.log("reserved");

        (this.creep.creep.memory as BaseCreepMemory).targetID = targetID;

        mem.targets[targetID].push(this.creep.creep.id);
        return true;
    }

    RevokeASlot(targetID:string)
    {
        var mem: GlobalMemory = Memory as GlobalMemory;
        var object: string[] = mem.targets[targetID];

    }


    static GetAllTargetsInformation()
    {

    }


}
