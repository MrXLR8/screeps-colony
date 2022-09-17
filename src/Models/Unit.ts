import { ActionResponseCode } from "./ActionResponseCode";
import { BaseCreepMemory } from "./Memory/BaseCreepMemory";
import { BaseStructureMemory } from "./Memory/BaseStructureMemory";

export abstract class Unit
{
    protected tasks: (()=>ActionResponseCode)[];

    abstract get memory():BaseCreepMemory|BaseStructureMemory;

    abstract set memory(memory:BaseCreepMemory|BaseStructureMemory);

    private IncrementNumber(num:number,max:number):number
    {
        num++;
        if(num>max) num=0;
        return num;
    }

    protected GetTarget():RoomObject
    {
        var targetID = this.memory.targetID;

        if(targetID!=null)
        {
            return Game.getObjectById(targetID);
        }
        return null;
    }

    Act() : void
    {

     //  var mem =  this.GetCreepMemory();
       var taskNumber =this.memory.taskNumber;
       var i=this.tasks.length*2;
       var taskCount = this.tasks.length-1;
       doLoop: do
        {
            i--;

            var result  = this.tasks[taskNumber].call(this);
            codeSwitch: switch(result)
            {
                case ActionResponseCode.Done :
                    {
                    taskNumber=this.IncrementNumber(taskNumber,taskCount);
                    this.memory.taskNumber=taskNumber;
                    this.memory.targetID=null;
                    this.memory.actionAttempts=0;
                    break doLoop;
                    }
                case ActionResponseCode.NextTask :
                    {
                    taskNumber=this.IncrementNumber(taskNumber,taskCount);
                    this.memory.taskNumber=taskNumber;
                    this.memory.targetID=null;
                    this.memory.actionAttempts=0;
                    break codeSwitch;
                    }
                case ActionResponseCode.Repeat:
                    {
                    break doLoop;
                    }
                case ActionResponseCode.Reset:
                    {
                    this.memory.taskNumber=0;
                    this.memory.targetID=null;
                    break doLoop;
                    }
                case ActionResponseCode.NextTaskPreserveTarget:
                    {
                        taskNumber=this.IncrementNumber(taskNumber,taskCount);
                        this.memory.taskNumber=taskNumber;
                        this.memory.actionAttempts=0;
                        break codeSwitch;
                    }
                    case ActionResponseCode.ResetPreserveTarget:
                    {
                            this.memory.taskNumber=0;
                            break doLoop;
                    }
            }

        } while(i>0)
    }

}
