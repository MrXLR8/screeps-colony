import { ActionGatherEnergy } from "Logic/Actions/Carry/ActionGatherEnergy";
import { BaseCreep } from "./BaseCreep";
import { IAction } from "Logic/Actions/IAction";
import { ActionStore } from "Logic/Actions/Carry/ActionStore";
import { IAssignable } from "Models/Interfaces/IAssignable";
import { EnergySource } from "Models/Structures/EnergySource";
import { AssignableFlag } from "Models/AssignableFlag";
import { ActionMoveAssign } from "Logic/Actions/Basic/ActionMoveToAssign";
import { ActionMoveOrigin } from "Logic/Actions/Basic/ActionMoveOrigin";
import { Constants } from "Constans";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { Utils } from "Logic/Utils";


export class ExternalHaulerCreep extends BaseCreep implements IAssignable
{

    static primaryColor: ColorConstant = COLOR_YELLOW;
    static secondaryColor: ColorConstant = COLOR_YELLOW;

    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, MOVE, MOVE,MOVE, MOVE,MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,CARRY,CARRY,CARRY,CARRY],//1300
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //1000
            [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //750
            [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //600
            [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //450
            [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY] //300
        ];

    tasks: IAction[] =
        [
            new ActionMoveAssign(this).InRange(2),
            new ActionGatherEnergy(this).ContainerTypes([STRUCTURE_CONTAINER]).WaitForIt(),
            new ActionMoveOrigin(this),
            new ActionStore(this).ContainerTypes([STRUCTURE_STORAGE])
        ];


    Assign(): boolean
    {

        if (this.memory.assignedTo != null) return true;
        var found = ExternalHaulerCreep.GetFreeHaulerSpace(this.memory.originRoom);

        if (found != null) return found.TryToAssignHauler(this);

        return false;

    }


    static GetFreeHaulerSpace(originRoom:string): EnergySource
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
            if (!assFalg.CompareColors(ExternalHaulerCreep.primaryColor, ExternalHaulerCreep.secondaryColor)) continue;
            var found = EnergySource.GetFreeHaulerSourceInRoom(flag.room);
            if (found != null) return found;
            continue;
        }
        return null;
    }

    static SpawnCondition(originRoom:string): boolean
    {

        var found = ExternalHaulerCreep.GetFreeHaulerSpace(originRoom);
        if (found != null) return true;
        return false;

    }

    static Dispose(_mem: CreepMemory)
    {
        var mem = _mem as BaseCreepMemory;
        if (!mem.assignedTo) return;

        console.log("Disposing hauler");

        var source = Game.getObjectById<Id<Source>>(mem.assignedTo as Id<Source>);

      //  var obj = new EnergySource(source);

        //obj.memory.myHauler = null;
    }
}

