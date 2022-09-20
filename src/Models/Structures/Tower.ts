import { Constants } from "Constans";
import { ActionTowerAttack } from "Logic/Actions/Strcuture/ActionTowerAttack";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { IStorable } from "Models/Interfaces/IStorable";
import { BaseStructure } from "./BaseStructure";

export class Tower extends BaseStructure implements IStorable
{
    //tasks = [this.ActAttack, this.ActRepair,this.ActRepairWalls];

    tasks: (() => ActionResponseCode)[] =
        [
            new ActionTowerAttack(this).Act,
            new ActionRepair(this, [STRUCTURE_ROAD, STRUCTURE_CONTAINER], true, 20).Act,
            new ActionRepair(this, [STRUCTURE_WALL, STRUCTURE_RAMPART], false, 80).Act
        ];

    structure: StructureTower;

    public GetUsedStoragePercent(resource: ResourceConstant): number
    {
        return Utils.Percent(this.structure.store.getUsedCapacity(resource), this.structure.store.getCapacity(resource));
    }

}
