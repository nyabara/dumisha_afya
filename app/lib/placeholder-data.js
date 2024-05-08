const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@nextmail.com',
      password: '123456',
    },
  ];
 
  const locations = [
    {
    id: "db835c2f-642f-41df-9791-11a40e6398a7",
    name: "Bungoma"
  },
  {
    id: "7e7b22be-4911-49a2-a857-996fb16e9e16",
    name: "Busia"
  }]
  const vacancies = [
    {
      id:'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
      name: 'ICT Administrator II',
      location_id: locations[0].id,
      status:'pending',
      date:'2024-04-17',
    },
    {
      id:'678bd3f4-b934-4203-bef0-1468c1297753',
      name: 'Locum HTS Counsellor',
      location_id: locations[1].id,
      status:'pending',
      date:'2024-05-03',
    },
  ];

  const requirements = [
    {
      id:'3958dc9e-742f-4377-85e9-fec4b6a6442a',
      name:'Bachelors Degree in Computer Science',
      vacancy_id:vacancies[0].id,
    },
  ];

  const requirement_values = [
    {
      name: 'Computer Science',
       requirement_id: requirements[0].id
    }
  ];

  module.exports = {
    users,
    vacancies,
    requirements,
    locations,
    requirement_values,
  };