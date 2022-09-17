import { CreepTypes } from "../Creeps/BaseCreep";

export class BaseCreepMemory implements CreepMemory
{
    Role: CreepTypes = 0;
    targetID: string;
    actionAttempts: number = 0;
    taskNumber: number = 0;
}
