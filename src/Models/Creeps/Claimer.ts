import { ActionClaim } from "Logic/Actions/Basic/ActionClaim";
import { ActionMoveFlag } from "Logic/Actions/Basic/ActionMoveFlag";
import { IAction } from "Logic/Actions/IAction";
import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";
import { AssignableFlag } from "Models/AssignableFlag";
import { AssignableFlagMemory } from "Models/Memory/AssignableFlagMemory";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { BaseCreep } from "./BaseCreep";

export class ClaimerCreep extends BaseCreep
{


    static parts: BodyPartConstant[][] =
        [
            [MOVE, CLAIM] //600
        ];


    static primaryColor: ColorConstant = COLOR_RED;
    static secondaryColor: ColorConstant = COLOR_WHITE;

    tasks: IAction[] =
        [
            new ActionMoveFlag(this).WithColors(ClaimerCreep.primaryColor, ClaimerCreep.secondaryColor),
            new ActionClaim(this)
        ];


    static SpawnCondition(roomOrigin: string): boolean
    {
        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            var assFalg = new AssignableFlag(flag);
            if(!Utils.BelongsToThisRoom(flag.name, roomOrigin)) continue;
            if (!assFalg.CompareColors(ClaimerCreep.primaryColor, ClaimerCreep.secondaryColor)) continue;
            if (assFalg.assignedAmmount < 1) return true;
        }
        return false;
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
