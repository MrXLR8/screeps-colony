import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Finder } from "Logic/Finder";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { ActionMoveFlag } from "Logic/Actions/Basic/ActionMoveFlag";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionStore } from "Logic/Actions/Carry/ActionStore";
import { AssignableFlagMemory } from "Models/Memory/AssignableFlagMemory";
import { AssignableFlag } from "Models/AssignableFlag";
import { IAction } from "Logic/Actions/IAction";
import { EnergySource } from "Models/Structures/EnergySource";
import { ActionAssignedMining } from "Logic/Actions/Work/ActionAssignedMining";


export class HeavyMinerCreep extends BaseCreep
{

    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY],//800
            [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY], //700
            [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY], //600
            [MOVE, WORK, WORK, WORK, WORK, CARRY], //500
            [MOVE, WORK, WORK, CARRY] //300
        ];

    tasks: IAction[] =
        [
            new ActionAssignedMining(this),
            new ActionStore(this, [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK], RESOURCE_ENERGY, 2)
        ];

    Assign(): boolean
    {
        var source = this.creep.room.find(FIND_SOURCES, {
            filter: (src) =>
            {
                var obj = new EnergySource(src);
                return obj.TryToAssignMiner(this)
            }
        });
        return source!=null;
    }

    static SpawnCondition(room:Room): EnergySource
    {
        return EnergySource.GetFreeMinerSourceInRoom(room);
    }
    static Dispose(_mem: CreepMemory)
    {
        var mem = _mem as BaseCreepMemory;
        var flag = Game.flags[mem.assignedTo];

        if (!flag) return;

        console.log("Disposing heavy miner. " + flag.name);

        var flagObj = new AssignableFlag(flag);
        flagObj.ReleaseDead();
    }
}

