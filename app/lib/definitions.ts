export type User = {
    id: string;
    name: string;
    email: string;
    password: string
};

export type Station = {
    id: string;
    station: string;
  };

export type JobGroup = {
    id: string;
    job_group : string;
  }

export type Job = {
    id: string;
    position: string;
    station_id: string;
    job_group: string;
    period: string;
    // In TypeScript, this is called a string union type.
    // It means that the "status" property can only be one of the two strings: 'pending' or 'closed'.
    status: 'pending' | 'closed';
    date: string;
    term: string;

};

export type Responsibility = {
  id: string;
  responsibility: string;
  position_id : string;
}

export type Requirement = {
  id: string;
  requirement:string;
  position_id: string;
  group_id:string;
  rqtype_id: string;
}

export type RequirementType = {
  id: string;
  requirement_type: string;
}
export type Terms = {
  id: string
  term: string

}

export type RequirementValue = {
    id: string;
    requirement_value:string;
    requirement_id:string;
}

export type JobsTable = {
    id: string;
    position: string;
    station: string;
    period: string;
    datecreated: string;
    requirement: string[];
    responsibility: string[];
    status: 'pending' | 'paid';
    terms: string;
}

export type RequirementField = {
    id: string;
    name: string;
  };


  export type JobForm = {
    id: string;
    position: string;
    station_id: string;
    period : string;
    status: 'pending' | 'closed';
    terms: string;
  };


export type JobCount = {
    month: string;
    job_count: number;
  };
