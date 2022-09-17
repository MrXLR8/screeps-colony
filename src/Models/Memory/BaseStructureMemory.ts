import { StructureTypes } from "Models/Structures/BaseStructure";
import { CreepTypes } from "../Creeps/BaseCreep";

export class BaseStructureMemory
{
    Type:StructureTypes=0;
    targetID: string;
    actionAttempts: number = 0;
    taskNumber: number = 0;
}
