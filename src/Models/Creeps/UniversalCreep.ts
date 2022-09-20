import { ActionResponseCode } from "Models/ActionResponseCode";
import { ActionGather } from "Logic/Actions/Carry/ActionGather";
import { BaseCreep } from "./BaseCreep";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionFillTower } from "Logic/Actions/Carry/ActionFillTower";
import { ActionStoreExtension } from "Logic/Actions/Carry/ActionStoreExtension";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { ActionBuild } from "Logic/Actions/Work/ActionBuild";
import { ActionUpgrade } from "Logic/Actions/Work/ActionUpgrade";


export class UniversalCreep extends BaseCreep
{
    tasks: (() => ActionResponseCode)[] =
    [
        new ActionGather(this).Act,
        new ActionMining(this,false).Act,
        new ActionFillTower(this,20).Act,
        new ActionStoreExtension(this).Act,
        new ActionRepair(this,[STRUCTURE_CONTAINER,STRUCTURE_ROAD],false).Act,
        new ActionFillTower(this,100).Act,
        new ActionBuild(this).Act,
        new ActionUpgrade(this).Act
    ];
}

