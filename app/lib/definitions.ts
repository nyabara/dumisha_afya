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
    startDate: string;
    endDate: string;
    status: 'Open' | 'Closed';
    date: string;
    term: string;
};

export type Responsibility = {
  id: string;
  responsibility: string;
  position_id : string;
  group_id : string;
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
    status: 'Open' | 'Closed';
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
    job_group: string;
    period : string;
    requirement: Requirement[];
    responsibility: Responsibility[];
    startdate: string;
    enddate: string;
    status: 'Open' | 'Closed';
    terms: string;
  };


export type JobCount = {
    month: string;
    job_count: number;
  };


  //Job applicant design

  export type ApplicantForm = {
    id: string;
    genderid: string;
    fullname: string;
    firstname: string;
    permanentaddress: string;
    postalcode: string;
    city: string;
    countryofresidence: string;
    phone: string;
    email: string;
    languageid1: string;
    languageid2: string;
    applicationoriginid: string;
    positionid: string;
    created_at: string;
    updated_at: string;
    app_educations: ApplicantEducation[];
    app_experiences: Experience[];
    app_resumes: Resumes[];
    app_cover_letters: CoverLetters[];
    position_applied: string;
    gender: string;
    country:string;
   

  };

  export type Gender = {
    id: string;
    name: string;
    description: string;
  };

  export type Country = {
    id: string;
    name: string;
    country_code: string; 
    continent: string; 
    region: string;
  }


  export type Languages = {
    id: string;
    name: string;
    language_code: string;
    native_name: string;
  };


  export type EducationLevel = {
    id: string;
    level: string;
    abbreviation: string; 
    description: string;
  };

  export type DegreeName = {
    id: string;
    name: string;
  };

  export type SubjectName = {
    id: string;
    name: string;
  };

  export type ApplicantEducation = {
    id: string;
    applicant_id: string;
    education_level_id: string;
    degree_name_id: string;
    subject_id: string;
    start_date: string;
    end_date: string;
    institution_name: string;
    is_highest_level: boolean;
  };


  export type Experience = {
    id: string;
    applicant_id: string;
    job_title: string;
    company_name: string;
    start_date: string;
    end_date: string|null;
    description: string;
    current_workplace: boolean;
  };


  export type ApplicationOrigin = {
    id: string;
    source: string;
    description: string;
  };


  export type CandidateInformation = {
    id: string;
    positionid: string;
    genderid: string;
    fullname: string;
    firstname: string;
    permanentaddress: string;
    postalcode: string;
    city: string;
    countryofresidence: string;
    email: string;
    phone: string;
    languageid1: string;
    languageid2: string;
    educationid: string;
    experienceid: string;
    applicationoriginid: string;
  };

  export type CandidateNationality = {
    id: string;
    countryid: string;
    applicant_id: string;
  };



  export type Resumes = {
    id: string;
    name: string;
    url: string;
    applicant_id: string;
  };


  

  export type CoverLetters = {
    id: string;
    name: string;
    url: string;
    applicant_id: string;
  };


  export type ViewJob = {
    id: string;
    position: string;
    station: string;
    job_group: string;
    requirement: Requirement[];
    responsibility: Responsibility[];
    startdate: string;
    enddate: string;
    status: 'Open' | 'Closed';
    date_created: string;
  };