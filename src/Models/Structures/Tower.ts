import { IAction } from "Logic/Actions/IAction";
import { ActionTowerAttack } from "Logic/Actions/Strcuture/ActionTowerAttack";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { Utils } from "Logic/Utils";
import { IStorable } from "Models/Interfaces/IStorable";
import { BaseStructure } from "./BaseStructure";

export class Tower extends BaseStructure implements IStorable
{
    //tasks = [this.ActAttack, this.ActRepair,this.ActRepairWalls];

    tasks: IAction[] =
        [
            new ActionTowerAttack(this),
            new ActionRepair(this, [STRUCTURE_ROAD, STRUCTURE_CONTAINER], true,false, 20,),
            new ActionRepair(this, [STRUCTURE_WALL, STRUCTURE_RAMPART], false, false,80,)
        ];

    structure: StructureTower;

    public GetUsedStoragePercent(resource: ResourceConstant): number
    {
        return Utils.Percent(this.structure.store.getUsedCapacity(resource), this.structure.store.getCapacity(resource));
    }

}
