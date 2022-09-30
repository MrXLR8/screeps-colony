import { ActionGatherEnergy } from "Logic/Actions/Carry/ActionGatherEnergy";
import { BaseCreep } from "./BaseCreep";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionFillTower } from "Logic/Actions/Carry/ActionFillTower";
import { ActionStoreExtension } from "Logic/Actions/Carry/ActionStoreExtension";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { ActionBuild } from "Logic/Actions/Work/ActionBuild";
import { ActionUpgrade } from "Logic/Actions/Work/ActionUpgrade";
import { IAction } from "Logic/Actions/IAction";
import { Constants } from "Constans";
import { ActionMoveToRoom } from "Logic/Actions/Basic/ActionMoveToRoom";
import { ActionMoveAssign } from "Logic/Actions/Basic/ActionMoveToAssign";
import { IAssignable } from "Models/Interfaces/IAssignable";

export class ExpiditorCreep extends BaseCreep
{


    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]//1800
        ];

    tasks: IAction[] =
        [
            new ActionGatherEnergy(this).ContainerTypes([STRUCTURE_CONTAINER, STRUCTURE_STORAGE]),
            new ActionMining(this).FindRandomSource(),
            new ActionBuild(this).GlobalSearch(),
           // new ActionRepair(this,).Structures([STRUCTURE_CONTAINER, STRUCTURE_ROAD]).RepeatToEnd(),
        ];

    static SpawnCondition(room: Room): boolean
    {
        //return false;
         return ExpiditorCreep.LookForRoomWithConstructionSites() != null;
    }



    static LookForRoomWithConstructionSites(): Room
    {
        for (var roomName in Game.rooms)
        {
            var room = Game.rooms[roomName];

            if(room==null) continue;
            if (room.find(FIND_MY_CONSTRUCTION_SITES)[0] != null)
            {
                return room;
            }

        }
        return null;
    }


}

