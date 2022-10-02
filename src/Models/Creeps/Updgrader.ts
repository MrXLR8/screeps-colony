import { ActionGatherEnergy } from "Logic/Actions/Carry/ActionGatherEnergy";
import { BaseCreep } from "./BaseCreep";
import { ActionUpgrade } from "Logic/Actions/Work/ActionUpgrade";
import { IAction } from "Logic/Actions/IAction";


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

