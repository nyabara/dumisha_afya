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
    id: "db835c2f-642f-41df-9791-11a40e6398a7",
    station: "Bungoma"
  },
  {
    id: "7e7b22be-4911-49a2-a857-996fb16e9e16",
    station: "Busia"
  }]

  const vacancies = [
    {
      id:'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
      position: 'ICT Administrator II',
      station_id: stations[0].id,
      period: 'SEVEN (7) MONTHS',
      status:'pending',
      date:'2024-05-22',
      terms: 'The successful candidate will be employed on a 7-Months Locum basis with a competitive salary and allowances.',
    },
    {
      id:'678bd3f4-b934-4203-bef0-1468c1297753',
      position: 'Locum HTS Counsellor',
      station_id: stations[1].id,
      period: 'SEVEN (7) MONTHS',
      status:'pending',
      date:'2024-05-03',
      terms: 'The successful candidate will be employed on a 7-Months Locum basis with a competitive salary and allowances.',
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
      position_id:vacancies[0].id,
      rqtype_id:requirement_types[0].id,

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
    vacancies,
    requirements,
    stations,
    requirement_values,
    requirement_types,
  };