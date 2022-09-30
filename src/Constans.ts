import { CreepRoleInfo } from "Models/CreepRoleInfo";
import { CreepTypes } from "Models/Creeps/BaseCreep";


export class Constants
{
    static damagePercentToRepair: number = 80;
    static moveAttmepts = 40;
    static towerEnergyReserve = 20;

    static weakController: number = 3;

    static userName: string;
    static LocalCreepsRequired: CreepTypes[] =
        [
            CreepTypes.UniversalCreep,
            CreepTypes.HeavyMiner,
            CreepTypes.Upgrader,
            CreepTypes.UniversalCreep,
            CreepTypes.UniversalCreep,
            CreepTypes.HeavyMiner,
            CreepTypes.UniversalCreep,
            CreepTypes.Courier,

        ];

    static ExternalCreepRequired: CreepTypes[] =
        [
            CreepTypes.Scout,
            CreepTypes.ExternalHeavyMiner,
            CreepTypes.ExternalHauler,
            CreepTypes.Scout,
            CreepTypes.ExternalHeavyMiner,
            CreepTypes.ExternalHauler,
            CreepTypes.ExpeditorCreep,
            CreepTypes.ExpeditorCreep,
            CreepTypes.ExternalRepairer,
            CreepTypes.ExternalRepairer,
            CreepTypes.Scout,
            CreepTypes.Claimer
        ];
}



