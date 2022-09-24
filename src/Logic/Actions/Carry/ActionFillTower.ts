import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Tower } from "Models/Structures/Tower";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionFillTower implements IAction
{
    unit: BaseCreep;
    target: StructureTower;

    fillUntil: number;



    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.energy == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId != null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<StructureTower>);


            if (this.target != null)
            {
                if (this.target instanceof StructureTower)
                    if (Utils.GetUsedStoragePercent(this.target.store, RESOURCE_ENERGY) <= this.fillUntil)
                    {
                        return; //Target is valid
                    }
            }
        }

        this.target = Finder.GetNotFilledTower(this.unit.creep.pos, this.fillUntil);
        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say(">🗼");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                if (!this.RepeatAction()) return ActionResponseCode.Reset;
                this.unit.creep.say("🗼");
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. FillTower error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    RepeatAction(): boolean
    {
        var newStore = this.unit.creep.store.getUsedCapacity(RESOURCE_ENERGY) - this.target.store.getFreeCapacity(RESOURCE_ENERGY);
        if (newStore < 0) return false;

        var newTarget = Finder.GetNotFilledTower
            (
                this.unit.creep.pos,
                this.fillUntil,
                this.unit.targetId as Id<StructureTower>
            );
        if (newTarget != null)
        {
            this.unit.targetId = newTarget.id;
            this.unit.MoveToTarget(newTarget);
            return true;
        }
        return false;
    }


    Act(): ActionResponseCode
    {


        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;
        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.transfer(this.target, RESOURCE_ENERGY);

        return this.WorkCodeProcessing(actionCode);
    }


    //#region  factory
    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
        this.fillUntil = 100;
    }

    FillUntil(fillUntil: number)
    {
        this.fillUntil = fillUntil;
        return this;
    }
    //#endregion
}
