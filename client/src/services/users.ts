import { Api } from "./api";
import { ApiResponse } from "apisauce";
import { GeneralApiProblem, getGeneralApiProblem } from "./api/api-problem";
import { User, Pet } from "./types";

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem;
export type GetUserResult = { kind: "ok"; user: User; pets: Pet[] } | GeneralApiProblem;
export type GetDefaultResult = { kind: "ok"; status: string } | GeneralApiProblem;

export class UserApi extends Api {
    convertUser(raw): User {
        return {
            id: raw.id,
            fullname: raw.fullname,
            email: raw.email,
        };
    }

    async createUser(data: object): Promise<GetUserResult> {
        const response: ApiResponse<any> = await this.apisauce.post(
            `/api/v1/users`,
            data
        );

        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
        }

        console.log(response);
        try {
            if (response.data.status === "success") {
                const user: User = response.data.data;
                return { kind: "ok", user };
            } else {
                if (response.data.message === "bad-email"){
                    return { kind: "bad-email" }
                }
                return { kind: response.data.message }
            }
        } catch {
            return { kind: "bad-data" };
        }
    }

    async unsubscribe(email: string): Promise<GetDefaultResult> {
        const response: ApiResponse<any> = await this.apisauce.delete(
            `/api/v1/users`,
            { email }
        );

        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
        }

        console.log(response);
        try {
            const status: string = response.data.status;
            return { kind: "ok", status };
        } catch {
            return { kind: "bad-data" };
        }
}

    async getUserById(token: string): Promise<GetUserResult> {
        this.apisauce.setHeader("Authorization", `Bearer ${token}`);
        const response: ApiResponse<any> = await this.apisauce.get(
            `/api/v1/users/${token}`
        );

        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
        }

        try {
            const user: User = response.data.data;
            return { kind: "ok", user: user };
        } catch {
            return { kind: "bad-data" };
        }
    }

    async getUsers(token: string): Promise<GetUsersResult> {
        this.apisauce.setHeader("Authorization", `Bearer ${token}`);
        const response: ApiResponse<any> = await this.apisauce.get("/api/v1/users");

        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
        }

        try {
            const rawUsers = response.data;
            const resultUsers: User[] = rawUsers.map(this.convertUser);
            return { kind: "ok", users: resultUsers };
        } catch {
            return { kind: "bad-data" };
        }
    }
}
