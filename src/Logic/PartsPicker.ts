import { Constants } from "Constans";
import { CreepTypes } from "Models/Creeps/BaseCreep";
import { ClaimerCreep } from "Models/Creeps/Claimer";
import { CourierCreep } from "Models/Creeps/Courier";
import { ExpiditorCreep } from "Models/Creeps/ExpiditorCreep";
import { HeavyMinerCreep } from "Models/Creeps/HeavyMiner";
import { UniversalCreep } from "Models/Creeps/UniversalCreep";

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
        console.log("taking parts of" + type);
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

}
