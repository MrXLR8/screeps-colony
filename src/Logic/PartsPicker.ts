import { Constants } from "Constans";
import { CreepTypes } from "Models/Creeps/BaseCreep";
import { ClaimerCreep } from "Models/Creeps/Claimer";
import { CourierCreep } from "Models/Creeps/Courier";
import { ExpiditorCreep } from "Models/Creeps/Expiditor";
import { ExternalHaulerCreep } from "Models/Creeps/ExternalHauler";
import { ExternalHeavyMiner } from "Models/Creeps/ExternalHeavyMiner";
import { ExternalRepairer } from "Models/Creeps/ExternalRepairer";
import { HeavyMinerCreep } from "Models/Creeps/HeavyMiner";
import { ScoutCreep } from "Models/Creeps/Scout";
import { UniversalCreep } from "Models/Creeps/Universal";
import { UpgraderCreep } from "Models/Creeps/Updgrader";

export class PartsPicker
{
    static BodyPartsPrice: { [part: string]: number } =
        {
            "move": 50,
            "work": 100,
            "carry": 50,
            "attack": 80,
            "ranged_attack": 150,
            "heal": 250,
            "claim": 600,
            "tough": 10
        }

    static CalculatePrice(parts: BodyPartConstant[])
    {
        var result: number = 0;
        for (var part of parts)
        {
            result += this.BodyPartsPrice[part];
        }
        return result;
    }

    static GetAviableParts(type: CreepTypes, energy: number): BodyPartConstant[]
    {
        var collection: BodyPartConstant[][];
        switch (type)
        {
            case CreepTypes.UniversalCreep:
                collection = UniversalCreep.parts;
                break;
            case CreepTypes.HeavyMiner:
                collection = HeavyMinerCreep.parts;
                break;
            case CreepTypes.Courier:
                collection = CourierCreep.parts;
                break;
            case CreepTypes.Claimer:
                collection = ClaimerCreep.parts;
                break;
            case CreepTypes.ExpeditorCreep:
                collection = ExpiditorCreep.parts;
                break;
            case CreepTypes.Upgrader:
                collection = UpgraderCreep.parts;
                break;
            default:
                return null;
        }

        for (var currentCollection of collection)
        {
            var calc = this.CalculatePrice(currentCollection);
            if (this.CalculatePrice(currentCollection) <= energy)
            {
                return currentCollection;
            }
        }

        return null;
    }


    static GetAviableMaxParts(type: CreepTypes, energy: number, roomEnergy: number): BodyPartConstant[]
    {
        var collection: BodyPartConstant[][];
        switch (type)
        {
            case CreepTypes.UniversalCreep:
                collection = UniversalCreep.parts;
                break;
            case CreepTypes.HeavyMiner:
                collection = HeavyMinerCreep.parts;
                break;
            case CreepTypes.Courier:
                collection = CourierCreep.parts;
                break;
            case CreepTypes.Claimer:
                collection = ClaimerCreep.parts;
                break;
            case CreepTypes.ExpeditorCreep:
                collection = ExpiditorCreep.parts;
                break;
            case CreepTypes.Upgrader:
                collection = UpgraderCreep.parts;
                break;
            case CreepTypes.ExternalHeavyMiner:
                collection = ExternalHeavyMiner.parts;
                break;
            case CreepTypes.ExternalHauler:
                collection = ExternalHaulerCreep.parts;
                break;
            case CreepTypes.Scout:
                collection = ScoutCreep.parts;
                break;
            case CreepTypes.ExternalRepairer:
                collection = ExternalRepairer.parts;
                break;
            default:
                console.log("No parts found for creep type: "+type);
                return null;
        }

        for (var currentCollection of collection)
        {
            var calc = this.CalculatePrice(currentCollection);

            if (calc <= roomEnergy)
            {

                if (calc <= energy)
                {
                    return currentCollection;
                }
                return null;
            }
        }

        return null;
    }

}
