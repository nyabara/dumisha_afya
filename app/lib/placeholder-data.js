

const users = [
    {
      name: 'User',
      email: 'user@nextmail.com',
      password: '123456',
    },
  ];
 
  const stations = [
    {
    station: 'Bungoma',
  },
  {
   
    station: "Busia",
  }]

  const groups = [
    {
      job_group: 'ICT'
    
    },
    {
      job_group: 'Monitoring and Evaluation'
    }
  ]
  


const jobs = [
  {
    position: 'ICT Administrator II',
    station_id: '9bbdd578-aa02-45be-9383-8c4a8f8014c3',
    group_id: 'f8a74315-d8eb-4f11-9256-cdc92e79c200',
    startDate: '2024-04-01', // Assuming the job starts on April 1, 2024
    endDate: '2024-12-31',   // Assuming a contract end date on December 31, 2024
    status: 'pending',
    date: '2024-05-22',      // Job creation or posting date
  },
  {
    position: 'Data Officer II',
    station_id: '9e9839ef-985b-4406-800c-e6de4719d2d7',
    group_id: '7d16f95a-0cfd-4a8a-b30e-7e543864f094',
    startDate: '2024-03-15', // Assuming the job starts on March 15, 2024
    endDate: '2024-11-30',   // Assuming a contract end date on November 30, 2024
    status: 'pending',
    date: '2024-05-03',      // Job creation or posting date
  },
];



  const requirements = [
    {
      
      requirement:'Bachelors Degree in Computer Science',
      position_id:'aa250d39-7d5d-4427-bcd4-1d5e2ced95b9',
      group_id:'b366a6af-033d-4b77-8130-56817d750062'

    },
    ];

    const responsibilities = [
      {
        responsibility:'Participate in the development and standardization of forms and tools, to collect relevant disaggregated data on program monitoring indicators, effects, and impacts.',
        position_id:'aa250d39-7d5d-4427-bcd4-1d5e2ced95b9',
        group_id:'b366a6af-033d-4b77-8130-56817d750062'
  
      },
      ];




  const gender_values = [
    {
      
      name: 'Male',
      description: 'Identifies as male'
    },
    {
      id: '',
      name: 'Female',
       description: 'Identifies as female'
    },
    {
      
      name: 'Non-binary',
       description: 'Identifies as neither exclusively male nor female'
    }
  ]



  const application_origin_values = [
    {
     
      source: 'Online Job Portal', 
      description: 'Applied through an online job portal'
    },
    {
     
      source: 'Employee Referral',
      description: 'Referred by a current employee'
    },
    {
      source: 'Company Website',
      description: 'Applied directly through the company website'
    }
  ]


  const country_values = [
    {
      name: 'Kenya',
      country_code: 'KEN', 
      continent: 'Africa', 
      region: 'East Africa'
    },
    {
      name: 'Uganda',
      country_code: 'UG', 
      continent: 'Africa', 
      region: 'East Africa'
    },
    {
      name: 'United States',
      country_code: 'USA', 
      continent: 'North America', 
      region: 'Northern America'
    }
  ]


  const education_level_values = [
    {
      
      level: 'High School',
      abbreviation: 'HS',
      description: 'Completed high school education'
    },

    {
      
      level: 'Associate Degree',
      abbreviation: 'AD',
      description: 'Completed an associate degree'
    },
    {
      
      level: 'Bachelor\'s Degree',
      abbreviation: 'B.A.',
      description: 'Completed a bachelor\'s degree'
    },
    {
      
      level: 'Master\'s Degree',
      abbreviation: 'M.A.',
      description: 'Completed a master\'s degree'
    },
    {
      
      level: 'Doctorate',
      abbreviation: 'Ph.D.',
      description: 'Completed a doctorate degree'
    },

  ]



  const languages_values = [
    {
      
      name: 'English',
      language_code: 'en', 
      native_name: 'English'
      
    },
    {
      name: 'Swahili',
      language_code: 'sw', 
      native_name: 'Kiswahili'
    },
    {
      name: 'French',
      language_code:'fr', 
      native_name: 'Français'
    },
    {
      name: 'Spanish',
      language_code:'sp', 
      native_name:'Español'
    }
  ]


 

  const candidate_information_values = [
    {
      positionid:'c2756cb4-5f4a-4e3c-ba4d-a68ca131132d',
      genderid: '51581131-91ff-46e5-a7ee-4cd0f8f9db09',
      fullname: 'Gilbert Ayoma',
      firstname: 'Gilbert',
      permanentaddress: 'Kisii',
      postalcode: '40200',
      city: 'Nairobi',
      countryofresidence: 'f523b2dd-7768-4974-a062-c02a69b86995',
      phone: '0741453868',
      email: 'nyabarayoma1@gmail.com',
      languageid:'cbb6c0a5-b8c2-4d27-bf5e-30555243fd81',
      applicationoriginid: '10cd32e3-f5e5-4a40-9ec8-0de0ba99c3e9'
    }
  ]


    const degree_name_values = [
    {
      name: 'Bachelor of Science in Statistics'
    },
    {

      name: 'Bachelor of Science in Computer Science',
    },

    {
      name: 'Bachelor of Science in Information Technology'
    },
    {

      name: 'Bachelor of Science in Business Information Technology',
    },

    {
      name: 'Associate of Arts'
    },
    {

      name: 'Bachelor of Arts',
    },

    {
      name: 'Master of Arts'
    },
    {

      name: 'Doctor of Philosophy',
    },
  ]



    const applicant_education_values = [
    {
      applicant_id: '1cf09d9c-9808-41c9-8d39-15b8301738bf',
      education_level_id: '31c451e0-5aeb-4045-8eec-8aada1624d73',
      degree_name_id: '7f671516-c70e-45b5-b91b-49ecb1ba6c48',
      start_date: '2018-01-01',
      end_date: '2020-12-31',
      institution_name : 'Kibabii University.',
      is_highest_level : true,
    }
  ]


  const experience_values = [
    {
      
      applicant_id: '1cf09d9c-9808-41c9-8d39-15b8301738bf',
      job_title: 'Software Developer',
      company_name: 'Tech Company',
      start_date: '2018-01-01',
      end_date: '2020-12-31',
      description: 'Developed software applications.',
      current_workplace: false
    },
    {
    
      applicant_id: '1cf09d9c-9808-41c9-8d39-15b8301738bf',
      job_title: 'Senior Developer',
      company_name: 'Another Tech Company',
      start_date: '2021-01-01',
      end_date: null,
      description: 'Leading development teams.',
      current_workplace: true
    },
  ]
  




  const resume_values = [
    {
     
      name: 'Gilbert-Resume',
      url: '/assets/resumes/Gilbert Ayoma CV USAID (2).docx	',
      applicant_id:'1cf09d9c-9808-41c9-8d39-15b8301738bf'
    }
  ]


  const cover_letter_values = [
    {
      
      name: 'Gilbert',
      url: '/assets/resumes/Gilbert Ayoma CV USAID.docx	',
      applicant_id: '1cf09d9c-9808-41c9-8d39-15b8301738bf'
    }
  ]


  



  module.exports = {
    users,
    stations,
    groups,
    jobs,
    requirements,
    responsibilities,
    gender_values,
    application_origin_values,
    country_values,
    education_level_values,
    languages_values,
    candidate_information_values,
    degree_name_values,
    applicant_education_values,
    experience_values,
    resume_values,
    cover_letter_values
   
  };