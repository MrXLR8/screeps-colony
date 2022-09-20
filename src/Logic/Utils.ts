import { copyFileSync } from "fs";
import { AssignableFlag } from "Models/AssignableFlag";
import { CreepTypes } from "Models/Creeps/BaseCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { UnitFactory } from "./UnitFactory";

export class Utils
{
    static CalculatePercentOfHP(_target: Structure | Creep)
    {
        return (_target.hits / _target.hitsMax) * 100;
    }

    static MemoryCleanUp()
    {
        for (const name in Memory.creeps)
        {
            if (!Game.creeps[name])
            {
                var mem = Memory.creeps[name];
                UnitFactory.DisposeCreep(mem);
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        for(var name in Game.flags)
        {
            var flag = new AssignableFlag(Game.flags[name]);
            flag.ReleaseDead();
        }
    }

    static GetCreepPopulation(room: Room): { [type: number]: number }
    {
        var result: { [type: number]: number } = { 0: 0, 1: 0, 2: 0 };
        for (var creepName in Game.creeps)
        {
            var creep: Creep = Game.creeps[creepName];
            if (creep.room.name != room.name) continue;
            var role: CreepTypes = ((creep.memory) as BaseCreepMemory).Role;
            result[role]++;
        }

        return result;
    }

    static PosCompare(pos1:RoomPosition,pos2:RoomPosition):boolean
    {
        return (pos1.x==pos2.x)&&(pos1.y==pos2.y);
    }

    static GetUsedStoragePercent<T extends ResourceConstant,K extends boolean>(storage:Store<T,K>,resource:T): number
    {
       return Utils.Percent(storage.getUsedCapacity(resource), storage.getCapacity(resource));;
    }

    static Percent(val: number, max: number): number
    {
        return (val / max) * 100;
    }
}
