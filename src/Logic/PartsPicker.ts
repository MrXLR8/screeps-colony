import { Constants } from "Constans";
import { CreepTypes } from "Models/Creeps/BaseCreep";

export class PartsPicker
{
    static MinerParts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY], //700
            [MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY], //500
            [MOVE, MOVE, WORK, WORK, CARRY, CARRY], //400
            [MOVE, MOVE, WORK, CARRY, CARRY] //300
        ];

    static HeavyMinerParts: BodyPartConstant[][] =
        [
            [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY], //700
            [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY], //600
            [MOVE, WORK, WORK, WORK, WORK, CARRY], //500
            [MOVE, WORK, WORK, CARRY] //300
        ];

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
                collection = this.MinerParts;
                break;
            case CreepTypes.HeavyMiner:
                collection = this.HeavyMinerParts;
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
