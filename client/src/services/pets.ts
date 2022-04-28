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
            petType: raw.petType,
        };
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
