import { BaseCreep } from "Models/Creeps/BaseCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { ActionStore } from "Logic/Actions/Carry/ActionStore";
import { IAction } from "Logic/Actions/IAction";
import { EnergySource } from "Models/Structures/EnergySource";
import { ActionAssignedMining } from "Logic/Actions/Work/ActionAssignedMining";
import { IAssignable } from "Models/Interfaces/IAssignable";
import { AssignableFlag } from "Models/AssignableFlag";
import { ActionMoveFlag } from "Logic/Actions/Basic/ActionMoveFlag";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { Constants } from "Constans";
import { Utils } from "Logic/Utils";


export class ExternalHeavyMiner extends BaseCreep implements IAssignable
{

    static primaryColor: ColorConstant = COLOR_YELLOW;
    static secondaryColor: ColorConstant = COLOR_YELLOW;

    static parts: BodyPartConstant[][] =
        [

            [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY], //650

        ];


    tasks: IAction[] =
        [
            new ActionAssignedMining(this),
            new ActionStore(this).ContainerTypes([STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK]).InRange(2).AllowDrop()
        ];


    static SpawnCondition(originRoom:string): boolean
    {
        var found = ExternalHeavyMiner.GetFreeMinerSpace(originRoom);
        if (found != null) return true;
        return false;
    }


    Assign(): boolean
    {

        // if (this.memory.assignedTo != null) return true;
        var found = ExternalHeavyMiner.GetFreeMinerSpace(this.memory.originRoom);

        if (found != null) return found.TryToAssignMiner(this);

        return false;

    }


    static GetFreeMinerSpace(originRoom:string): EnergySource
    {

        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            if(!Utils.BelongsToThisRoom(flag.name,originRoom)) continue;
            if (typeof flag.room === 'undefined') continue;
            if (typeof flag.room.controller !== 'undefined')
            {
                if (typeof flag.room.controller.owner !== 'undefined')
                {
                    if (flag.room.controller.owner.username == Constants.userName) continue;
                }
            }
            var assFalg = new AssignableFlag(flag);
            if (!assFalg.CompareColors(ExternalHeavyMiner.primaryColor, ExternalHeavyMiner.secondaryColor)) continue;
            var found = EnergySource.GetFreeMinerSourceInRoom(flag.room);
            if (found != null) return found;
            continue;
        }
        return null;
    }

    static Dispose(_mem: CreepMemory)
    {
        var mem = _mem as BaseCreepMemory;
        if (mem.assignedTo == null) return;

        console.log("Disposing external heavy miner. " + mem.assignedTo);


        var source = Game.getObjectById<Id<Source>>(mem.assignedTo as Id<Source>);

         var obj = new EnergySource(source);

        obj.memory.myMiner = null;
    }
}

