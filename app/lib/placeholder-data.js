const users = [
    {
      id: 0,
      name: 'User',
      email: 'user@nextmail.com',
      password: '123456',
    },
  ];

  const vacancies = [
    {
        id: 0,
        name: 'ICT Administrator II',
        place: 'Bungoma',
        status:'pending',
        date:'2024-04-17',
    },
  ];

  const requirements = [
    {
        id: 0,
        name:'Level of Education',
        vacancy_id:vacancies[0],
    },
  ];

  const requirement_types = [

    {
        id: 0,
        name:'Bachelors Degree',
        requirement_id: requirements[0]
    }
  ];

  const requirement_values = [
    {
        id: 0,
        name: 'Computer Science',
        requirement_type_id: requirement_types[0]
    }
  ];

  module.exports = {
    users,
    vacancies,
    requirements,
    requirement_types,
    requirement_values,
  };