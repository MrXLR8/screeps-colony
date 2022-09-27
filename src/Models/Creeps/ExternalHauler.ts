import { ActionGatherEnergy } from "Logic/Actions/Carry/ActionGatherEnergy";
import { BaseCreep } from "./BaseCreep";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionFillTower } from "Logic/Actions/Carry/ActionFillTower";
import { ActionStoreExtension } from "Logic/Actions/Carry/ActionStoreExtension";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { ActionBuild } from "Logic/Actions/Work/ActionBuild";
import { ActionUpgrade } from "Logic/Actions/Work/ActionUpgrade";
import { IAction } from "Logic/Actions/IAction";
import { ActionStore } from "Logic/Actions/Carry/ActionStore";
import { ActionGatherFromFlag } from "Logic/Actions/Carry/ActionGatherFromFlag";
import { ActionSalvage } from "Logic/Actions/Carry/ActionSalvage";
import { IAssignable } from "Models/Interfaces/IAssignable";
import { EnergySource } from "Models/Structures/EnergySource";
import { AssignableFlag } from "Models/AssignableFlag";
import { Finder } from "Logic/Finder";
import { ActionMoveAssign } from "Logic/Actions/Basic/ActionMoveToAssign";
import { ActionMoveOrigin } from "Logic/Actions/Basic/ActionMoveOrigin";
import { Constants } from "Constans";


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
            new ActionGatherEnergy(this).WaitForIt(),
            new ActionMoveOrigin(this),
            new ActionStore(this).ContainerTypes([STRUCTURE_STORAGE])
        ];


    Assign(): boolean
    {

        if (this.memory.assignedTo != null) return true;
        var found = ExternalHaulerCreep.GetFreeHaulerSpace();

        if (found != null) return found.TryToAssignHauler(this);

        return false;

    }


    static GetFreeHaulerSpace(): EnergySource
    {

        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
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

    static SpawnCondition(): boolean
    {

        var found = ExternalHaulerCreep.GetFreeHaulerSpace();
        if (found != null) return true;
        return false;

    }
}

