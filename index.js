require('dotenv').config();
require('console.table');
const io = require('inquirer');
const db = require('./db');

const {
  VIEW_ALL_DEPARTMENTS,
  ADD_DEPARTMENT,
  DELETE_DEPARTMENT,
  VIEW_ALL_ROLES,
  ADD_ROLE,
  UPDATE_ROLE_SALARY,
  DELETE_ROLE,
  VIEW_ALL_EMPLOYEES,
  VIEW_EMPLOYEES_BY_MANAGER,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE_ROLE,
  UPDATE_EMPLOYEE_MANAGER,
  DELETE_EMPLOYEE,
  VIEW_EMPLOYEES_BY_DEPARTMENT,
  VIEW_UTILIZED_DEPARTMENT_BUDGET,
} = require('./io/constants');

const {
  viewAllDepartments,
  viewUtilizedDepartmentBudget,
  addDepartment,
  deleteDepartment,
  viewAllRoles,
  addRole,
  updateRoleSalary,
  deleteRole,
  viewAllEmployees,
  viewEmployeesByManager,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  deleteEmployee,
  viewEmployeesByDepartment,
} = require('./io/handlers');

const { MAIN_MENU } = require('./io/prompts');
const { exit } = require('./io/helpers');

const main = () => {
  io.prompt(MAIN_MENU)
    .then(({ response }) => {
      switch (response) {
        case VIEW_ALL_DEPARTMENTS:
          return viewAllDepartments();

        case VIEW_UTILIZED_DEPARTMENT_BUDGET:
          return viewUtilizedDepartmentBudget();

        case ADD_DEPARTMENT:
          return addDepartment();

        case DELETE_DEPARTMENT:
          return deleteDepartment();

        case VIEW_ALL_ROLES:
          return viewAllRoles();

        case ADD_ROLE:
          return addRole();

        case UPDATE_ROLE_SALARY:
          return updateRoleSalary();

        case DELETE_ROLE:
          return deleteRole();

        case VIEW_ALL_EMPLOYEES:
          return viewAllEmployees();

        case VIEW_EMPLOYEES_BY_MANAGER:
          return viewEmployeesByManager();

        case VIEW_EMPLOYEES_BY_DEPARTMENT:
          return viewEmployeesByDepartment();

        case ADD_EMPLOYEE:
          return addEmployee();

        case UPDATE_EMPLOYEE_ROLE:
          return updateEmployeeRole();

        case UPDATE_EMPLOYEE_MANAGER:
          return updateEmployeeManager();

        case DELETE_EMPLOYEE:
          return deleteEmployee();

        default:
          return false;
      }
    })
    .then((again) => (again ? main() : exit()))
    .catch((error) => db.end(() => console.error(error.message)));
};

main();
