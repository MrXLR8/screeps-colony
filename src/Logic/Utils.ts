import { copyFileSync } from "fs";
import { AssignableFlag } from "Models/AssignableFlag";
import { CreepTypes } from "Models/Creeps/BaseCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { type } from "os";
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

        for (var name in Game.flags)
        {
            var flag = new AssignableFlag(Game.flags[name]);
            flag.ReleaseDead();
        }
    }

    static GetCreepPopulation(room?: Room): { [type: number]: number }
    {
        var result: { [type: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
        for (var creepName in Game.creeps)
        {
            var creep: Creep = Game.creeps[creepName];
            if (typeof room !== 'undefined') if (creep.room.name != room.name) continue;
            var role: CreepTypes = ((creep.memory) as BaseCreepMemory).Role;
            result[role]++;
        }

        return result;
    }


    static BelongsToThisRoom(toCheck: string, roomName: string): boolean
    {
        var split = toCheck.split('|');
        if (split.length > 1)
        {
            return roomName == split[0]
        }
        return false;
    }

    static GetFlagResourceConstant(flagName: string): ResourceConstant
    {
        var split = flagName.split('|');
        if (split.length > 2)
        {
            return split[1] as ResourceConstant;
        }
        return null;
    }

    static PosCompare(pos1: RoomPosition, pos2: RoomPosition): boolean
    {
        return (pos1.x == pos2.x) && (pos1.y == pos2.y);
    }

    static WhosClose(from: RoomPosition, pos1: RoomObject, pos2: RoomObject): RoomObject
    {
        if (pos1 == null && pos2 == null) return null;
        if (pos1 == null) return pos2;
        if (pos2 == null) return pos1;

        if (from.getRangeTo(pos1) < from.getRangeTo(pos2)) return pos1;
        return pos2;
    }


    static GetUsedStoragePercent<T extends ResourceConstant, K extends boolean>(storage: Store<T, K>, resource: T): number
    {
        return Utils.Percent(storage.getUsedCapacity(resource), storage.getCapacity(resource));;
    }

    static Percent(val: number, max: number): number
    {
        return (val / max) * 100;
    }

    static GetResourceInStore(store: StoreDefinition, moreThen?: number): ResourceConstant
    {
        if (typeof moreThen === 'undefined') moreThen = 0;
        return _.filter(Object.keys(store), resource => store[resource as ResourceConstant] > moreThen)[0] as ResourceConstant;
    }
}
