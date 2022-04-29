import { Api } from "./api";
import { ApiResponse } from "apisauce";
import { GeneralApiProblem, getGeneralApiProblem } from "./api/api-problem";
import { Pet } from "./types";

export type GetPetsResult = { kind: "ok"; pets: Pet[] } | GeneralApiProblem;
export type GetPetResult = { kind: "ok"; pet: Pet } | GeneralApiProblem;

export class PetApi extends Api {
    convertPet(raw): Pet {
        return {
            id: raw.id,
            name: raw.name,
            type: raw.type,
            in_custody: raw.in_custody,
            user_id: raw.user_id,
        };
    }

    strCompare(str1, str2) {
        return str1.localeCompare(str2, undefined, { sensitivity: 'base' });
    }

    comparePets(foundPet, rawPet) {
        const isNameEqual = this.strCompare(foundPet.name, rawPet.name) === 0;
        const isTypeEqual = this.strCompare(foundPet.type, rawPet.type) === 0;
        console.log(isNameEqual, isTypeEqual);
        return isNameEqual && isTypeEqual;
    }

    async createPet(data: object): Promise<GetPetResult> {
        const response: ApiResponse<any> = await this.apisauce.post(
            `/api/v1/pets`,
            data
        );

        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
        }

        console.log(response);
        try {
            const pet: Pet = response.data.data;
            return { kind: "ok", pet: pet };
        } catch {
            return { kind: "bad-data" };
        }
    }
}
