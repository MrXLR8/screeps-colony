import { BaseCreep } from "Models/Creeps/BaseCreep";

export interface IAssignable extends BaseCreep
{
    Assign():boolean;
}
