import { Constants } from "Constans";
import { CreepRoleInfo } from "Models/CreepRoleInfo";
import { CreepTypes } from "Models/Creeps/BaseCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { Utils } from "Logic/Utils";
import { PartsPicker } from "Logic/PartsPicker";
import { HeavyMinerMemory } from "Models/Creeps/HeavyMiner";
import { BaseStructure } from "./BaseStructure";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { ActionSpawn } from "Logic/Actions/Strcuture/ActionSpawn";

export class Spawner extends BaseStructure
{
    //  tasks = [this.ActSpawn];
    tasks: (() => ActionResponseCode)[] =
        [
            new ActionSpawn(this).Act
        ];
}


