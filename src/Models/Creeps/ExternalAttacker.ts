import { ActionAttackFlag } from "Logic/Actions/Attack/ActionAttackFlag";
import { IAction } from "Logic/Actions/IAction";
import { Utils } from "Logic/Utils";
import { AssignableFlag } from "Models/AssignableFlag";
import { IAssignable } from "Models/Interfaces/IAssignable";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { BaseCreep } from "./BaseCreep";

export class ExternalAttacker extends BaseCreep implements IAssignable
{


    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], //1170
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], //910
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK] //780
        ];


    static primaryColor: ColorConstant = COLOR_RED;
    static secondaryColor: ColorConstant = COLOR_RED;

    tasks: IAction[] =
        [
            new ActionAttackFlag(this)
        ];


    static SpawnCondition(roomOrigin: string): boolean
    {
        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            var assFalg = new AssignableFlag(flag);
            if (Utils.BelongsToThisRoom(flag.name, roomOrigin)) continue;
            if (!assFalg.CompareColors(ExternalAttacker.primaryColor, ExternalAttacker.secondaryColor)) continue;
            if (assFalg.assignedAmmount < 1) return true;
        }
        return false;
    }


    Assign(): boolean
    {
        var busyFlag = null;
        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            var assFalg = new AssignableFlag(flag);
            if (!Utils.BelongsToThisRoom(flag.name, this.memory.originRoom)) continue;
            if (!assFalg.CompareColors(ExternalAttacker.primaryColor, ExternalAttacker.secondaryColor)) continue;
            if (assFalg.assignedAmmount < 1)
            {
                assFalg.Assign(this.creep.id);
                this.memory.assignedTo = flagName;
                return true;
            }
            else { busyFlag = assFalg; }
        }
        if (busyFlag != null)
        {
            this.memory.assignedTo = busyFlag.flag.name;
            return true;
        }
        return false;
    }

    static Dispose(_mem: CreepMemory)
    {
        var mem = _mem as BaseCreepMemory;
        var flag = Game.flags[mem.assignedTo];

        if (!flag) return;

        console.log("Disposing external attacker. " + flag.name);

        var flagObj = new AssignableFlag(flag);
        flagObj.ReleaseDead();
    }
}
