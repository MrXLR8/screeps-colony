import { IAction } from "Logic/Actions/IAction";
import { ActionTowerAttack } from "Logic/Actions/Strcuture/ActionTowerAttack";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { Utils } from "Logic/Utils";
import { BaseStructure } from "./BaseStructure";

export class Tower extends BaseStructure
{
    //tasks = [this.ActAttack, this.ActRepair,this.ActRepairWalls];

    tasks: IAction[] =
        [
            new ActionTowerAttack(this),
            new ActionRepair(this).Structures([STRUCTURE_ROAD, STRUCTURE_CONTAINER]).ChooseRandomly().EnergyReserves(25),
            new ActionRepair(this).Structures([STRUCTURE_WALL, STRUCTURE_RAMPART]).EnergyReserves(80).RoomMinumumEnergy(10000)
        ];

    structure: StructureTower;

    public GetUsedStoragePercent(resource: ResourceConstant): number
    {
        return Utils.Percent(this.structure.store.getUsedCapacity(resource), this.structure.store.getCapacity(resource));
    }

}
