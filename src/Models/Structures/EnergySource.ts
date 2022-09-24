import { IAction } from "Logic/Actions/IAction";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { BaseStructureMemory } from "Models/Memory/BaseStructureMemory";
import { GlobalMemory } from "Models/Memory/GlobalMemory";

export class SourceMemory extends BaseStructureMemory
{
    myMiner: string=null;
    myHauler: string=null;
}

export class EnergySource
{

    structure: Source;

    constructor(_structure: Source)
    {
        this.structure = _structure;
        if(typeof this.memory==='undefined') this.memory=new SourceMemory();
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
        return (Memory as GlobalMemory).structures[this.structure.id] as SourceMemory;
    }
    set memory(memory: SourceMemory)
    {
        (Memory as GlobalMemory).structures[this.structure.id] = memory;
    }

    tasks: IAction[] =
        [
        ];


    static GetFreeMinerSourceInRoom(room: Room): EnergySource
    {
        var found = room.find(FIND_SOURCES, { filter: (source) => { return new EnergySource(source).memory.myMiner == null } })[0];
        if (found != null) return new EnergySource(found);
        return null;
    }

    static GetFreeHaulerSourceInRoom(room: Room): EnergySource
    {
        var found = room.find(FIND_SOURCES, { filter: (source) => { return new EnergySource(source).memory.myHauler } })[0];
        if (found != null) return new EnergySource(found);
        return null;
    }

    TryToAssignMiner(creep: BaseCreep): boolean
    {
        if (this.memory.myMiner == null)
        {
            this.memory.myMiner = creep.creep.name;
            creep.memory.assignedTo = this.structure.id;
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
            creep.memory.assignedTo = this.structure.id;
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
