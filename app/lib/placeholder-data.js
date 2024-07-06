const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@nextmail.com',
      password: '123456',
    },
  ];
 
  const stations = [
    {
    id: 'db835c2f-642f-41df-9791-11a40e6398a7',
    station: 'Bungoma',
  },
  {
    id: "7e7b22be-4911-49a2-a857-996fb16e9e16",
    station: "Busia",
  }]

  const groups = [
    {
      id: '678bd3f4-b934-4203-bef0-1468c1297753',
      job_group: 'ICT'
    
    },
    {
      id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
      job_group: 'Monitoring and Evaluation'
    }
  ]
  
  const terms = [
    {
      id: "06cba7c1-5ea8-42dd-8457-970ba7cba6be",
      term:"The successful candidate will be employed on a 7-Months Locum basis with a competitive salary and allowances."
    },
   
  ]

  const jobs = [
    {
      id:'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
      position: 'ICT Administrator II',
      station_id: stations[0].id,
      group_id: stations[0].id,
      term_id: terms[0].id,
      period: 'SEVEN (7) MONTHS',
      startDate:'',
      endDate:'',
      status:'pending',
      date:'2024-05-22',
    },
    {
      id:'03cee662-ca4e-4523-9fa3-63462f59ce49',
      position: 'Data Officer II',
      station_id: stations[1].id,
      group_id: stations[1].id,
      term_id: terms[0].id,
      period: 'Three months',
      startDate:'',
      endDate:'',
      status:'pending',
      date:'2024-05-03',
    },

  ];


  const requirement_types = [
    {
      id:"13D07535-C59E-4157-A011-F8D2EF4E0CBB",
      requirement_type:'Multiple Select',
    }
  ]

  const requirements = [
    {
      id:'3958dc9e-742f-4377-85e9-fec4b6a6442a',
      requirement:'Bachelors Degree in Computer Science',
      position_id:jobs[0].id,
      group_id: stations[0].id,
      rqtype_id:requirement_types[0].id,

    },
    ];

    const responsibilities = [
      {
        id:'',
        responsibility:'',
        position_id:jobs[0].id,
        group_id: stations[0].id,
  
      },
      ];


  const requirement_values = [
    {
      requirement_value: 'Computer Science',
      requirement_id: requirements[0].id
    }
  ];

  module.exports = {
    users,
    stations,
    groups,
    terms,
    jobs,
    requirement_types,
    requirements,
    requirement_values,
    responsibilities,
    
  };