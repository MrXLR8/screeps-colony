import { BaseCreep } from "Models/Creeps/BaseCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { ActionStore } from "Logic/Actions/Carry/ActionStore";
import { IAction } from "Logic/Actions/IAction";
import { EnergySource } from "Models/Structures/EnergySource";
import { ActionAssignedMining } from "Logic/Actions/Work/ActionAssignedMining";
import { IAssignable } from "Models/Interfaces/IAssignable";


export class HeavyMinerCreep extends BaseCreep implements IAssignable
{

    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK,WORK, WORK, CARRY],//900
            [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY],//800
            [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY], //700
            [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY], //600
            [MOVE,MOVE, WORK, WORK, WORK, WORK, CARRY], //550
            [MOVE, WORK, WORK, WORK, WORK, CARRY], //500
            [MOVE, WORK, WORK, CARRY] //300
        ];


    tasks: IAction[] =
        [
            new ActionAssignedMining(this),
            new ActionStore(this).ContainerTypes([STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK]).InRange(2).AllowDrop()
        ];

    Assign(): boolean
    {
        var found = EnergySource.GetFreeMinerSourceInRoom(this.creep.room);
        if (found != null) return found.TryToAssignMiner(this);
        return false;
    }

    static SpawnCondition(room: Room): boolean
    {

        return EnergySource.GetFreeMinerSourceInRoom(room) != null;
    }
    static Dispose(_mem: CreepMemory)
    {
        var mem = _mem as BaseCreepMemory;
        if (!mem.assignedTo) return;

        console.log("Disposing heavy miner. " + !mem.assignedTo);

        var source = Game.getObjectById<Id<Source>>(mem.assignedTo as Id<Source>);

        var obj = new EnergySource(source);

        obj.memory.myMiner = null;
    }
}

