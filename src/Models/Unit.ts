import { ActionResponseCode } from "./ActionResponseCode";
import { TickAction } from "./Data/TickAction";
import { BaseCreepMemory } from "./Memory/BaseCreepMemory";
import { BaseStructureMemory } from "./Memory/BaseStructureMemory";

export abstract class Unit
{
    protected tasks: (() => ActionResponseCode)[];

    abstract get memory(): BaseCreepMemory | BaseStructureMemory;

    abstract set memory(memory: BaseCreepMemory | BaseStructureMemory);

    private IncrementNumber(num: number, max: number): number
    {
        num++;
        if (num > max) num = 0;
        return num;
    }

    public GetTarget<T extends _HasId>(targetSearchMethod: () => _HasId, validTargetMethod?: (target: T) => boolean): T
    {
        var targetID = this.memory.targetID;
        if (targetID != null)
        {
            var retrived = Game.getObjectById(targetID as Id<T>);
            if (validTargetMethod !== undefined)
            {
                if (validTargetMethod.call(this, retrived))
                {
                    return retrived;
                }
            }
            else
            {
                return retrived;
            }
        }
        var targetObj = targetSearchMethod.call(this) as T;
        if (targetObj != null)
        {
            this.memory.targetID = targetObj.id;
            return targetObj;
        }
        return null;
    }

    Act(): void
    {
        this.memory.actions=new TickAction();
        var taskNumber = this.memory.taskNumber;
        var i = this.tasks.length * 2;
        var taskCount = this.tasks.length - 1;
        doLoop: do
        {
            i--;

            try
            {
            var result = this.tasks[taskNumber].call(this);
            }
            catch
            {
                console.log("Exception caught");
                this.memory.taskNumber=0;
                this.memory.targetID=null;
                this.memory.actionAttempts=0;
            }
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
    }

}
