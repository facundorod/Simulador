export interface UserI {
    id_user?: number;
    email: String;
    name: String;
    surname: String;
    password?: String;
    institution: String;
    roles?: [
        {
            id_role: number,
            name: string
        }
    ]
}
