const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@nextmail.com',
      password: '123456',
    },
  ];

  const vacancies = [
    {
      id:'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
      name: 'ICT Administrator II',
      place: 'Bungoma',
      status:'pending',
      date:'2024-04-17',
    },
  ];

  const requirements = [
    {
      id:'3958dc9e-742f-4377-85e9-fec4b6a6442a',
      name:'Level of Education',
      vacancy_id:vacancies[0].id,
    },
  ];

  const requirement_types = [

    {
      id:'3958dc9e-737f-4377-85e9-fec4b6a6442a',
      name:'Bachelors Degree',
      requirement_id: requirements[0].id
    }
  ];

  const requirement_values = [
    {
      name: 'Computer Science',
      requirement_type_id: requirement_types[0].id
    }
  ];

  module.exports = {
    users,
    vacancies,
    requirements,
    requirement_types,
    requirement_values,
  };