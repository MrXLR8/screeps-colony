import { ActionResponseCode } from "Models/ActionResponseCode";
import { Unit } from "Models/Unit";

export interface IAction<T>
{

unit:Unit;
target:T;

 SearchMethod: ()=>T;
 ValidationMethod: (target:T)=>boolean;

 Act():ActionResponseCode;

 EntryValidation():ActionResponseCode;

 RepeatEligable():boolean;

 WorkCodeProcessing(code:number):ActionResponseCode;

}
