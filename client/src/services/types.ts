export type User = {
    id: number;
    fullname: string;
    email: string;
};

export type Pet = {
    id?: number;
    name: string;
    type: string;
    user_id: number;
    in_custody: number;
};

export type FormFieldError = {
    field: string,
    message: string,
};
