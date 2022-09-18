import { Constants } from "Constans";
import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { BaseCreep } from "./BaseCreep";



export abstract class WorkerCreep extends BaseCreep
{
    protected ActGathering(): ActionResponseCode
    {

        if (this.creep.store.getFreeCapacity() == 0) return ActionResponseCode.NextTask;
        //todo look from id to not search twice
        var source: Structure = Finder.GetFilledStorage(this.creep.pos, this.AmmountCanCarry());
        if (source != null)
        {
            if (this.creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                this.MoveToTarget(source);
                this.creep.say(">⚡");
                return ActionResponseCode.Repeat;
            }
            this.creep.say("⚡");
            return ActionResponseCode.Repeat;
        }
        var dropped = Finder.FindDropped(this.creep.pos, this.AmmountCanCarry());

        if (dropped != null)
        {
            if (this.creep.pickup(dropped) == ERR_NOT_IN_RANGE)
            {
                this.MoveToTarget(dropped);
                this.creep.say(">⚡");
                return ActionResponseCode.Repeat;
            }
            this.creep.say("⚡");
            return ActionResponseCode.Repeat;
        }

        return ActionResponseCode.NextTask;
    }

    protected ActMining(): ActionResponseCode
    {
        if (this.creep.store.getFreeCapacity() == 0) return ActionResponseCode.NextTask;

        var target: Source = this.GetTarget<Source>(()=>Finder.GetRandomSource(this.creep.room));

        if(target==null) return ActionResponseCode.NextTask;

        if (this.memory.actionAttempts > Constants.moveAttmepts)
        {
            target = Finder.GetRandomSource(this.creep.room);

            this.memory.targetID = target.id;
            this.memory.actionAttempts = 0;
        }
        var code = this.creep.harvest(target);
        switch (code)
        {
            case (ERR_NOT_IN_RANGE):
                {
                    this.memory.actionAttempts++;
                    if (this.memory.actionAttempts > Constants.moveAttmepts)
                    {
                        return ActionResponseCode.Reset;
                    }
                    this.MoveToTarget(target);
                    this.creep.say(">⛏️");
                    return ActionResponseCode.Repeat;
                }
            case (ERR_NOT_ENOUGH_RESOURCES):
                {
                    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) return ActionResponseCode.Reset;
                    return ActionResponseCode.NextTask;
                }
            default: break;
        }

        this.memory.actionAttempts = 0;
        this.creep.say("⛏️");
        return ActionResponseCode.Repeat;

    }

    protected ActUpgrading(): ActionResponseCode
    {
        if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) return ActionResponseCode.NextTask;

        var target: StructureController = this.creep.room.controller;
        var code: ScreepsReturnCode = this.creep.upgradeController(target);

        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                {
                    this.MoveToTarget(target);
                    this.creep.say(">⬆️");
                    return ActionResponseCode.Repeat;
                }
        }
        this.creep.say("⬆️");
        return ActionResponseCode.Repeat;
    }
}
