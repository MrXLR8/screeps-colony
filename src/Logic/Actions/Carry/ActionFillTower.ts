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
    target: Tower;

    fillUntil:number;
    constructor(unit: Unit,fillUntil:number)
    {
        this.unit = unit as BaseCreep;
        this.fillUntil=fillUntil;
    }



    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.energy == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId == null)
        {
            this.target =new Tower(Game.getObjectById(this.unit.targetId as Id<StructureTower>));
        }
        if (this.target != null)
        {
            if (this.target.GetUsedStoragePercent(RESOURCE_ENERGY)<this.fillUntil)
            {
                return; //Target is valid
            }
        }

        this.target = new Tower(Finder.GetNotFilledTower(this.unit.creep.pos, this.fillUntil));
        if (this.target != null)
        {
            this.unit.targetId = this.target.structure.id;
        }
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target.structure);
                this.unit.creep.say(">🗼");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked=true;
                this.unit.creep.say("🗼");
                if (!this.RepeatAction()) return ActionResponseCode.NextTask;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. FillTower error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    RepeatAction(): boolean
    {
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
       if (entryCode!=null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.withdraw(this.target.structure, RESOURCE_ENERGY);

        return this.WorkCodeProcessing(actionCode);
    }
}
