import { ActionGather } from "Logic/Actions/Carry/ActionGather";
import { BaseCreep } from "./BaseCreep";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionFillTower } from "Logic/Actions/Carry/ActionFillTower";
import { ActionStoreExtension } from "Logic/Actions/Carry/ActionStoreExtension";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { ActionBuild } from "Logic/Actions/Work/ActionBuild";
import { ActionUpgrade } from "Logic/Actions/Work/ActionUpgrade";
import { IAction } from "Logic/Actions/IAction";


export class UniversalCreep extends BaseCreep
{


    tasks: IAction[] =
    [
        new ActionGather(this,false,[STRUCTURE_CONTAINER,STRUCTURE_STORAGE]),
        new ActionMining(this,false),
        new ActionFillTower(this,20),
        new ActionStoreExtension(this),
        new ActionRepair(this,[STRUCTURE_CONTAINER,STRUCTURE_ROAD],false,true),
        new ActionFillTower(this,80),
        new ActionBuild(this),
        new ActionUpgrade(this)
    ];
}

