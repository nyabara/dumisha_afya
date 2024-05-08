export type User = {
    id: string;
    name: string;
    email: string;
    password: string
};

export type LocationField = {
    id: string;
    name: string;
  };

export type Vacancy = {
    id: string;
    name: string;
    location_id: string;
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


export type RequirementValue = {
    id: string;
    name:string;
    requirement_id:string;
}

export type JobsTable = {
    id: string;
    jobtitle: string;
    place: string;
    datecreated: string;
    requirement: string;
    status: 'pending' | 'paid';
    subject:string;
}

export type RequirementField = {
    id: string;
    name: string;
  };


  export type JobForm = {
    id: string;
    jobtitle: string;
    location_id: string;
    status: 'pending' | 'closed';
  };

