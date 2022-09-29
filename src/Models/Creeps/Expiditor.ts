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

export class ExpiditorCreep extends BaseCreep implements IAssignable
{


    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY], //800
        ];

    tasks: IAction[] =
        [
            new ActionMoveToRoom(this),
            new ActionGatherEnergy(this).ContainerTypes([STRUCTURE_CONTAINER, STRUCTURE_STORAGE]),
            new ActionMining(this).FindRandomSource(),
            new ActionFillTower(this).FillUntil(20),
            new ActionStoreExtension(this),
            new ActionFillTower(this).FillUntil(80),
            new ActionBuild(this),
            new ActionRepair(this,).Structures([STRUCTURE_CONTAINER, STRUCTURE_ROAD]).RepeatToEnd(),
            new ActionUpgrade(this)
        ];

    static SpawnCondition(room: Room): boolean
    {
        return false;
       // return ExpiditorCreep.LookForRoomWithConstructionSites() != null;
    }



    static LookForRoomWithConstructionSites(): Room
    {
        for (var roomName in Game.rooms)
        {
            var room = Game.rooms[roomName];

            if (room.find(FIND_MY_CONSTRUCTION_SITES)[0] != null)
            {
                return room;
            }

        }
        return null;
    }

    Assign(): boolean
    {
        var found = ExpiditorCreep.LookForRoomWithConstructionSites();
        if (found != null)
        {
        }
        return false;
    }

    static GetMyNoSpawnRoom(ignoreRoom: Room): Room
    {
        var room: Room;
        var result: Room;
        var secondTarget: Room = null;
        for (var roomName in Game.rooms)
        {
            room = Game.rooms[roomName];
            if (room == null) continue;
            if (room.name == ignoreRoom.name) continue;
            if (typeof room.controller === 'undefined') continue;
            if (typeof room.controller.owner === 'undefined') continue;
            if (room.controller.owner.username != Constants.userName) continue;
            if (room.controller.level < Constants.weakController) secondTarget = room;
            if (room.find(FIND_MY_SPAWNS)[0] == null) return result = room;
        }
        if (result != null) return result;
        return secondTarget;
    }


}

