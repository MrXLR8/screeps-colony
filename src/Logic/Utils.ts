import { copyFileSync } from "fs";
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

    static Percent(val: number, max: number): number
    {
        return (val / max) * 100;
    }
}
