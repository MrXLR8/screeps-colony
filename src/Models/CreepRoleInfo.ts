import { CreepTypes } from "./Creeps/BaseCreep";

export class CreepRoleInfo
{
    constructor(_requiredAmmount:number,_bodyParts:BodyPartConstant[],_name:CreepTypes)
    {
        this.requiredAmmount=_requiredAmmount;
        this.bodyParts=_bodyParts;
        this.type=_name;
    }
     requiredAmmount:number;
     bodyParts:BodyPartConstant[];
     type:CreepTypes
}
