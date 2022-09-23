import { IAction } from "Logic/Actions/IAction";
import { ActionLinkSend } from "Logic/Actions/Strcuture/ActionLinkSend";
import { ActionTowerAttack } from "Logic/Actions/Strcuture/ActionTowerAttack";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { Utils } from "Logic/Utils";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { IStorable } from "Models/Interfaces/IStorable";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { BaseStructureMemory } from "Models/Memory/BaseStructureMemory";
import { GlobalMemory } from "Models/Memory/GlobalMemory";
import { Memory } from "../../../test/unit/mock";
import { BaseStructure } from "./BaseStructure";

class SourceMemory extends BaseCreepMemory
{
    myMiner: string;
    myHauler: string;
}

export class EnergySource
{

    structure: Source;

    constructor(_structure: Source)
    {
        this.structure = this.structure;
    }

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


    static GetFreeMinerSourceInRoom(room: Room):EnergySource
    {
       var found =  room.find(FIND_SOURCES, { filter: (source) => { return new EnergySource(source).memory.myMiner == null } })[0];
       if(found!=null) return new EnergySource(found);
       return null;
    }

    static GetFreeHaulerSourceInRoom(room: Room):EnergySource
    {
        var found = room.find(FIND_SOURCES, { filter: (source) => { return new EnergySource(source).memory.myHauler } })[0];
        if(found!=null) return new EnergySource(found);
        return null;
    }

    TryToAssignMiner(creep: BaseCreep): boolean
    {
        if (this.memory.myMiner == null)
        {
            this.memory.myMiner = creep.creep.name;
            return true;
        }
        if (this.memory.myMiner != creep.creep.name) return false;
        return true;
    }

    TryToAssignHauler(creep: BaseCreep): boolean
    {

        if (this.memory.myHauler == null)
        {
            this.memory.myHauler = creep.creep.name;
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
