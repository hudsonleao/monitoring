import * as React from "react";
import { Admin, Resource } from 'react-admin';
import { ApplicationsList, ApplicationsEdit, ApplicationsCreate } from './applications';
import { PlansList, PlansEdit, PlansCreate } from './plans';
import { CustomersList, CustomersEdit, CustomersCreate } from './customers';
import { UserList } from './users';
import Dashboard from './Dashboard';
import authProvider from './authProvider';
import dataProvider from './dataProvider';

import ApplicationsIcon from '@material-ui/icons/Apps';
import UserIcon from '@material-ui/icons/Group';
import CustomersIcon from '@material-ui/icons/PeopleAlt';

const App = () => (
  <Admin dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="applications" list={ApplicationsList} edit={ApplicationsEdit} create={ApplicationsCreate} icon={ApplicationsIcon} />
    <Resource name="plans" list={PlansList} edit={PlansEdit} create={PlansCreate} icon={ApplicationsIcon} />
    <Resource name="customers" list={CustomersList} edit={CustomersEdit} create={CustomersCreate} icon={CustomersIcon} />
    <Resource name="users" list={UserList} icon={UserIcon} />
  </Admin>
);

export default App;