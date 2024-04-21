export type User = {
    id: string;
    name: string;
    email: string;
    password: string
};
export type Vacancy = {
    id: string;
    name: string;
    place: string;
    // In TypeScript, this is called a string union type.
    // It means that the "status" property can only be one of the two strings: 'pending' or 'closed'.
    status: 'pending' | 'closed';
    date: string;
};
export type Requirement = {
    id: string;
    vacancy_id: string;
    name:string
}


export type RequirementType = {
    id: string;
    name:string;
    requirement_id:string;
}

export type RequirementValue = {
    id: string;
    name:string;
    requirement_value_id: string;
}

export type JobsTable = {
    id: string;
    JobTitle: string;
    Place: string;
    DateCreated: string;
    requirement: string;


}



