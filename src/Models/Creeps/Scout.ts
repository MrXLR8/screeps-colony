import { BaseCreep } from "./BaseCreep";
import { IAction } from "Logic/Actions/IAction";
import { IAssignable } from "Models/Interfaces/IAssignable";
import { AssignableFlag } from "Models/AssignableFlag";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { ActionMoveAssign } from "Logic/Actions/Basic/ActionMoveToAssign";
import { Utils } from "Logic/Utils";


export class ScoutCreep extends BaseCreep implements IAssignable
{

    static parts: BodyPartConstant[][] =
        [
            [MOVE] //50
        ];

    tasks: IAction[] =
        [
            new ActionMoveAssign(this).InRange(10)
        ];


    Assign(): boolean
    {
        if (this.memory.assignedTo != null) return true;
        var found = ScoutCreep.GetUnknownRoom(this.memory.originRoom);
        if (found != null)
        {
            found.memory.scout = this.creep.id;
            this.memory.assignedTo = found.flag.name;
            return true;
        }
        return false;
    }

    static Dispose(_mem: CreepMemory)
    {
        var mem = _mem as BaseCreepMemory;
        var flag = Game.flags[mem.assignedTo];

        if (!flag) return;

        console.log("Disposing Scout " + flag.name);

        var flagObj = new AssignableFlag(flag);
        flagObj.memory.scout = null;
    }


    static GetUnknownRoom(originRoom:string): AssignableFlag
    {

        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            if (typeof flag.room === 'undefined')
            {
                if(!Utils.BelongsToThisRoom(flag.name,originRoom)) continue;
                var assFalg = new AssignableFlag(flag);
                if (assFalg.memory.scout == null)
                {
                    return assFalg;
                }
            }
        }
        return null;
    }

    static SpawnCondition(originRoom:string): boolean
    {

        return this.GetUnknownRoom(originRoom)!=null;
    }
}

