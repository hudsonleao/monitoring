import * as React from "react";
import { Admin, Resource } from 'react-admin';
import LoginPage from "./LoginPage";
import Dashboard from './Dashboard';
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import { ApplicationsList, ApplicationsEdit, ApplicationsCreate } from './applications';
import { PlansList, PlansEdit, PlansCreate } from './plans';
import { CustomersList, CustomersEdit, CustomersCreate } from './customers';
import { UsersList, UsersEdit, UsersCreate } from './users';
import { ServersList, ServersEdit, ServersCreate } from './servers';
import { SshKeyList, SshKeyEdit, SshKeyCreate } from './ssh_key';
import { TelegramList, TelegramEdit, TelegramCreate } from './telegram';
import { TriggersList, TriggersEdit, TriggersCreate } from './triggers';

import ApplicationsIcon from '@material-ui/icons/Apps';
import PlansIcon from '@material-ui/icons/LocalOffer';
import UsersIcon from '@material-ui/icons/AssignmentInd';
import CustomersIcon from '@material-ui/icons/AccountBalanceWallet';
import ServersIcon from '@material-ui/icons/Dns';
import SshKeyIcon from '@material-ui/icons/VpnKey';
import TelegramIcon from '@material-ui/icons/Telegram';
import TriggersIcon from '@material-ui/icons/SettingsEthernet';

const App = () => (
  <Admin loginPage={LoginPage} dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider}>
    {permission => [
      <Resource name="applications" list={ApplicationsList} edit={ApplicationsEdit} create={ApplicationsCreate} icon={ApplicationsIcon} />,
      permission === 'super_admin'
        ? <Resource name="plans" list={PlansList} edit={PlansEdit} create={PlansCreate} icon={PlansIcon} />
        : null,
      permission === 'super_admin'
        ? <Resource name="customers" list={CustomersList} edit={CustomersEdit} create={CustomersCreate} icon={CustomersIcon} />
        : null,
        permission === 'normal'
        ? null
        : <Resource name="users" list={UsersList} edit={UsersEdit} create={UsersCreate} icon={UsersIcon} />,
      <Resource name="userslevel" />,
      <Resource name="servers" list={ServersList} edit={ServersEdit} create={ServersCreate} icon={ServersIcon} />,
      <Resource name="ssh_key" list={SshKeyList} edit={SshKeyEdit} create={SshKeyCreate} icon={SshKeyIcon} />,
      <Resource name="telegram" list={TelegramList} edit={TelegramEdit} create={TelegramCreate} icon={TelegramIcon} />,
      <Resource name="triggers" list={TriggersList} edit={TriggersEdit} create={TriggersCreate} icon={TriggersIcon} />,
    ]}
  </Admin>
);

export default App;