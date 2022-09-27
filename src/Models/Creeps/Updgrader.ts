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


export class UpgraderCreep extends BaseCreep
{

    static parts: BodyPartConstant[][] =
    [
        [MOVE, MOVE, MOVE, MOVE,WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY], //1000
        [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY], //700
        [MOVE, MOVE,MOVE, WORK, WORK, WORK, CARRY, CARRY], //550
        [MOVE, MOVE, WORK, WORK, CARRY, CARRY], //400
        [MOVE, MOVE, WORK, CARRY, CARRY] //300
    ];

    tasks: IAction[] =
    [
        new ActionGatherEnergy(this,).ContainerTypes([STRUCTURE_CONTAINER]),
        new ActionUpgrade(this),
    ];

}

