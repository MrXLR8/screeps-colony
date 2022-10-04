import { IAction } from "Logic/Actions/IAction";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { BaseStructureMemory } from "Models/Memory/BaseStructureMemory";
import { GlobalMemory } from "Models/Memory/GlobalMemory";

export class SourceMemory extends BaseStructureMemory
{
    myMiner: string = null;
    myHauler: string = null;
}

export class ResourceSource
{

    source: Source | Mineral | Deposit;

    constructor(_structure: Source | Mineral | Deposit)
    {
        this.source = _structure;
        if (typeof this.memory === 'undefined') this.memory = new SourceMemory();
        // EnergySource.StructureMemoryExistsCheck(_structure.id);

    }

    /*
        static StructureMemoryExistsCheck(id: Id<any>)
        {
            var mem = (Memory as GlobalMemory);
            if (mem.structures == undefined)
            {
                mem.structures = {};
            }
            var request = mem.structures[id];

            if (typeof request === 'undefined')
            {
                console.log(id + " creating memory");
                var mem2 = new SourceMemory();
                mem.structures[id.toString()] = mem2;
            }
        }
        */

    get memory(): SourceMemory
    {
        return (Memory as GlobalMemory).structures[this.source.id] as SourceMemory;
    }
    set memory(memory: SourceMemory)
    {
        (Memory as GlobalMemory).structures[this.source.id] = memory;
    }

    tasks: IAction[] =
        [
        ];


    static GetFreeMinerSourceInRoom(room: Room): ResourceSource
    {
        var found: Source | Mineral | Deposit = room.find(FIND_SOURCES, {
            filter: (source) =>
            {
                var obj = new ResourceSource(source);
                obj.CheckForDead();
                return obj.memory.myMiner == null
            }
        })[0];
        if (found != null) return new ResourceSource(found);

        var extractor = room.find(FIND_STRUCTURES, {
            filter: (structure) => { return structure.structureType == STRUCTURE_EXTRACTOR }
        })[0];

        if (typeof extractor !== 'undefined')
        {
            found = extractor.pos.lookFor<"mineral">("mineral")[0];
        }

        if (found != null) return new ResourceSource(found);
        return null;
    }

    static GetFreeHaulerSourceInRoom(room: Room): ResourceSource
    {
        var found: Source | Mineral | Deposit = room.find(FIND_SOURCES, {
            filter: (source) =>
            {
                var obj = new ResourceSource(source);
                obj.CheckForDead();
                return obj.memory.myHauler == null
            }
        })[0];
        // if (found != null) return new ResourceSource(found);
        // found = room.find(FIND_MINERALS, {
        //     filter: (structures) =>
        //     {
        //         var obj = new ResourceSource(structures);
        //         obj.CheckForDead();
        //         if (obj.memory.myMiner == null)
        //         {
        //             return structures.pos.lookFor<"structure">("structure").filter((str) => { str.structureType == STRUCTURE_EXTRACTOR })[0] != null;
        //         }
        //         return false;
        //     }
        // })[0];
        // if (found != null) return new ResourceSource(found);
        return null;
    }

    TryToAssignMiner(creep: BaseCreep): boolean
    {
        if (this.memory.myMiner == null)
        {
            this.memory.myMiner = creep.creep.name;
            creep.memory.assignedTo = this.source.id;
            return true;
        }
        if (this.memory.myMiner != creep.creep.name) return false;
        else return true
    }

    TryToAssignHauler(creep: BaseCreep): boolean
    {

        if (this.memory.myHauler == null)
        {
            this.memory.myHauler = creep.creep.name;
            creep.memory.assignedTo = this.source.id;
            return true;
        }
        if (this.memory.myHauler != creep.creep.name) return false;
        return true;
    }

    CheckForDead()
    {
        var found: Creep;
        if (this.memory.myMiner != null)
        {
            found = Game.creeps[this.memory.myMiner]
            if (found == null) this.memory.myMiner = null;
        }
        if (this.memory.myHauler != null)
        {
            found = Game.creeps[this.memory.myHauler];
            if (found == null) this.memory.myHauler = null;
        }
    }

}
