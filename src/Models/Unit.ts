import { IAction } from "Logic/Actions/IAction";
import { ActionResponseCode } from "./ActionResponseCode";
import { TickAction } from "./Data/TickAction";
import { BaseCreepMemory } from "./Memory/BaseCreepMemory";
import { BaseStructureMemory } from "./Memory/BaseStructureMemory";

export abstract class Unit
{
    protected tasks: IAction[];


    abstract get memory(): BaseCreepMemory | BaseStructureMemory;

    abstract set memory(memory: BaseCreepMemory | BaseStructureMemory);

    get targetId():string
    {
        return this.memory.targetID;
    }

    set targetId(target:string)
    {
        this.memory.targetID=target;
        this.memory.actionAttempts=0;
    }

    private IncrementNumber(num: number, max: number): number
    {
        console.log("resetting");
        num++;
        if (num > max) num = 0;
        return num;
    }

    Act(): void
    {

       // if((this.memory as BaseCreepMemory).Role!=1) return; //DEBUG
        console.log(">>>>");
        this.memory.actions=new TickAction();
        var taskNumber = this.memory.taskNumber;
        var i = this.tasks.length * 2;
        var taskCount = this.tasks.length - 1;
        doLoop: do
        {
            i--;

            var result = this.tasks[taskNumber].Act();

       //     console.log("TaskNumber" +taskNumber +" ended with: "+result.toString());

            codeSwitch: switch (result)
            {
                case ActionResponseCode.StopCreepAct:
                    {
                        taskNumber = this.IncrementNumber(taskNumber, taskCount);
                        this.memory.taskNumber = taskNumber;
                        this.memory.targetID = null;
                        this.memory.actionAttempts = 0;
                        break doLoop;
                    }
                case ActionResponseCode.NextTask:
                    {
                        taskNumber = this.IncrementNumber(taskNumber, taskCount);
                        this.memory.taskNumber = taskNumber;
                        this.memory.targetID = null;
                        this.memory.actionAttempts = 0;
                        break codeSwitch;
                    }
                case ActionResponseCode.Repeat:
                    {
                        break doLoop;
                    }
                case ActionResponseCode.RepeatThisTick:
                    {
                        break codeSwitch;
                    }
                case ActionResponseCode.Reset:
                    {
                        this.memory.taskNumber = 0;
                        this.memory.targetID = null;
                        break doLoop;
                    }
                case ActionResponseCode.ResetThisTick:
                    {
                        this.memory.taskNumber = 0;
                        this.memory.targetID = null;
                        break codeSwitch;
                    }
                case ActionResponseCode.NextTaskPreserveTarget:
                    {
                        taskNumber = this.IncrementNumber(taskNumber, taskCount);
                        this.memory.taskNumber = taskNumber;
                        this.memory.actionAttempts = 0;
                        break codeSwitch;
                    }
                case ActionResponseCode.ResetPreserveTarget:
                    {
                        this.memory.taskNumber = 0;
                        break doLoop;
                    }
            }

        } while (this.memory.actions.moved&&(this.memory.actions.worked||this.memory.actions.attacked))
        console.log("<<<<<");
    }

}
