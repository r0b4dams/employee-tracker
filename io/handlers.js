const io = require('inquirer');
const db = require('../db');
const { getChoices, loop } = require('./helpers');

module.exports = {
  viewAllDepartments: () => {
    return db
      .getAllDepartments()
      .then(([rows]) => console.table(rows))
      .then(loop);
  },

  viewUtilizedDepartmentBudget: () => {
    return db
      .viewUtilizedDepartmentBudget()
      .then(([rows]) => console.table(rows))
      .then(loop);
  },

  addDepartment: () => {
    return io
      .prompt([
        {
          name: 'name',
          message: 'What is the new department called?',
        },
      ])
      .then((department) => db.addDepartment(department))
      .then(loop);
  },

  deleteDepartment: () => {
    return db
      .getAllDepartments()
      .then(getChoices)
      .then((choices) =>
        io.prompt([
          {
            name: 'id',
            message: 'Which department would you like to delete?',
            type: 'list',
            choices,
          },
        ])
      )
      .then(({ id }) => db.deleteDepartment(id))
      .then(loop);
  },

  viewAllRoles: () => {
    return db
      .getAllRoles()
      .then(([rows]) => console.table(rows))
      .then(loop);
  },

  addRole: () => {
    return db
      .getAllDepartments()
      .then(getChoices)
      .then((choices) =>
        io.prompt([
          {
            name: 'title',
            message: 'What is the title of the new role?',
          },
          {
            name: 'salary',
            message: "What is this role's salary?",
          },
          {
            name: 'department_id',
            message: 'Which department does this role belong to?',
            type: 'list',
            choices,
          },
        ])
      )
      .then((role) => db.addRole(role))
      .then(loop);
  },

  updateRoleSalary: () => {
    return db
      .getAllRoles()
      .then(getChoices)
      .then((choices) =>
        io.prompt([
          {
            name: 'id',
            message: 'Which role would you like to update?',
            type: 'list',
            choices,
          },
          {
            name: 'salary',
            message: 'What is the new salary?',
          },
        ])
      )
      .then(({ id, salary }) => db.updateRoleSalary(id, salary))
      .then(loop);
  },

  deleteRole: () => {
    return db
      .getAllRoles()
      .then(getChoices)
      .then((choices) =>
        io.prompt([
          {
            name: 'id',
            message:
              'Which role should be deleted? \n(Warning: this will also delete any employees with this role)',
            type: 'list',
            choices,
          },
        ])
      )
      .then(({ id }) => db.deleteRole(id))
      .then(loop);
  },

  viewAllEmployees: () => {
    return db
      .viewAllEmployees()
      .then(([rows]) => console.table(rows))
      .then(loop);
  },

  viewEmployeesByManager: () => {
    return db
      .viewAllEmployees()
      .then(getChoices)
      .then((choices) =>
        io.prompt([
          {
            name: 'manager_id',
            message: 'Please select a manager',
            type: 'list',
            choices,
          },
        ])
      )
      .then(({ manager_id }) => db.viewEmployeesByManager(manager_id))
      .then(([rows]) => {
        rows.length
          ? console.table(rows)
          : console.log(`This employee does not manage anyone`);
      })
      .then(loop);
  },

  viewEmployeesByDepartment: () => {
    return db
      .getAllDepartments()
      .then(getChoices)
      .then((choices) =>
        io.prompt([
          {
            name: 'department_id',
            message: 'Please select a department',
            type: 'list',
            choices,
          },
        ])
      )
      .then(({ department_id }) => db.viewEmployeesByDepartment(department_id))
      .then(([rows]) => console.table(rows))
      .then(loop);
  },

  addEmployee: () => {
    return Promise.all([db.getAllRoles(), db.viewAllEmployees()])
      .then(([roles, employees]) => [getChoices(roles), getChoices(employees)])
      .then(([roleChoices, managerChoices]) =>
        io.prompt([
          {
            name: 'first_name',
            message: "Enter the employee's first name",
          },
          {
            name: 'last_name',
            message: "Enter the employee's last name",
          },
          {
            name: 'role_id',
            message: "What is the employee's role?",
            type: 'list',
            choices: roleChoices,
          },
          {
            name: 'manager_id',
            message: "Who is the employee's manager?",
            type: 'list',
            choices: managerChoices,
          },
        ])
      )
      .then((employee) => db.addEmployee(employee))
      .then(loop);
  },

  updateEmployeeRole: () => {
    return Promise.all([db.getAllEmployees(), db.getAllRoles()])
      .then(([employees, roles]) => [getChoices(employees), getChoices(roles)])
      .then(([employeeChoices, roleChoices]) =>
        io.prompt([
          {
            name: 'id',
            message: 'Which employee should be updated?',
            type: 'list',
            choices: employeeChoices,
          },
          {
            name: 'role_id',
            message: "What is the employee's new role?",
            type: 'list',
            choices: roleChoices,
          },
        ])
      )
      .then(({ id, role_id }) => db.updateEmployeeRole(id, role_id))
      .then(loop);
  },

  updateEmployeeManager: () => {
    return db
      .getAllEmployees()
      .then(getChoices)
      .then((employees) =>
        io
          .prompt([
            {
              name: 'id',
              message: 'Which employee should be updated?',
              type: 'list',
              choices: employees,
            },
          ])
          // nested chain in order to to use id to filter employees
          .then(({ id }) =>
            io
              .prompt([
                {
                  name: 'manager_id',
                  message: "Who is the employee's new manager?",
                  type: 'list',
                  // filter out the selected employee and add additional choice
                  choices: employees
                    .filter((emp) => emp.value !== id)
                    .concat([
                      {
                        name: 'No manager',
                        value: null,
                      },
                    ]),
                },
              ])
              // return selected employee and manager to the outer chain
              .then(({ manager_id }) => ({
                id,
                manager_id,
              }))
          )
      )
      .then(({ id, manager_id }) => db.updateEmployeeManager(id, manager_id))
      .then(loop);
  },

  deleteEmployee: () => {
    return db
      .getAllEmployees()
      .then(getChoices)
      .then((choices) =>
        io.prompt([
          {
            name: 'id',
            message: 'Which employee should be deleted?',
            type: 'list',
            choices,
          },
        ])
      )
      .then(({ id }) => db.deleteEmployee(id))
      .then(loop);
  },
};
