export type User = {
    id: number;
    name: string;
    email: string;
    password: string
};
export type Vacancy = {
    id: number;
    name: string;
    place: string;
    // In TypeScript, this is called a string union type.
    // It means that the "status" property can only be one of the two strings: 'pending' or 'closed'.
    status: 'pending' | 'closed';
    date: string;
};
export type Requirement = {
    id: number;
    vacancy_id: number;
    name:string
}


export type RequirementType = {
    id: number;
    name:string;
    requirement_id:number;
}

export type RequirementValue = {
    id: number;
    name:string;
    requirement_value_id: number;
}

export type JobsTable = {
    id: Number;
    name: string;
    place: string;
    date: string;
    education: string;
    subject: string;
    status: string;

}

