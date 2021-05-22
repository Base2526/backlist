// import { Pizza, EditPizza, Toppings, AnotherRoute } from "./Components/index";
import React, { Component } from 'react';
import { Link } from "react-router-dom";

import HomePage from './Components/Home/HomePage';
// import DepositPage from './Components/Members/DepositPage';
// import WithdrawPage from './Components/Members/WithdrawPage';
import ContactUsPage from './Components/Members/ContactUsPage';
// import AddBankPage from './Components/Members/AddBankPage';
import LoginPage from './Components/Setting/LoginPage';

import DetailPage from './Components/Home/DetailPage'
import ProfilePage from './Components/Home/ProfilePage'
import SettingsPage from './Components/Home/SettingsPage'
import NotificationsPage from './Components/Home/NotificationsPage'

import MyPostPage from './Components/Home/MyPostPage'
import MyFollowUpPage from './Components/Home/MyFollowUpPage'

import TermsofServicePage from './Components/Home/TermsofServicePage'
import AboutupPage from './Components/Home/AboutupPage'
import ForDeveloperPage from './Components/Home/ForDeveloperPage'


// import AddBanlistPage from './Components/Home/AddBanlistPage'

// import AffiliatePage from './Components/Members/AffiliatePage'
// import StatementPage from './Components/Members/StatementPage'
// import RequestAllPage from './Components/Members/RequestAllPage'

// import LotteryListPage from './Components/Lottery/LotteryListPage';
// import GovernmentPage from './Components/Lottery/GovernmentPage';

// import SettingDealers from './Components/Dealers/SettingDealers';
// import ListDealers from './Components/Dealers/ListDealers';
// import LotteryDistribute from './Components/Dealers/LotteryDistribute';
// import LotterySuppress from './Components/Dealers/LotterySuppress'

// import YeekeeListPage from './Components/Lottery/YeekeeListPage';
// import ChitPage from './Components/Lottery/ChitPage';
// import RewardPage from './Components/Lottery/RewardPage'

// import ProfilePage from './Components/Setting/ProfilePage';
import ForgetPasswordPage from './Components/Setting/ForgetPasswordPage';
import RegisterPage from './Components/Setting/RegisterPage';

import HelpPage from './Components/Help/HelpPage';

// import LotteryListChitsPage from './Components/Lottery/LotteryListChitsPage'

const toppings = [
  { id: "1", name: "Cheese" },
  { id: "2", name: "Pepperoni" },
  { id: "3", name: "Ham" },
  { id: "4", name: "Pineapple" }
];

const pizza = [
  { id: "1", name: "Pepperoni", toppings: [toppings[0], toppings[1]] },
  { id: "2", name: "Cheese", toppings: [toppings[0]] },
  { id: "3", name: "Ham and Pineapple", toppings: [...toppings.slice(2)] }
];

const Pizza = () => (
  <div>
    <h1 className="bold text-6xl">List Of Pizza</h1>
    <ul>
      {pizza.map(({ id, name }) => (
        <li className="underline text-blue-500" key={id}>
          <Link to={`pizza/${id}`}>{name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const EditPizza = ({
  match: {
    params: { pizzaId }
  }
}) => (
  <div>
    <h1 className="bold text-6xl">
      Edit Pizza: {pizza.find(({ id }) => id === pizzaId).name}
    </h1>
    <Link className="underline text-blue-500" to="/pizza/1/toppings">
      View Toppings
    </Link>
  </div>
);

const Toppings = ({
  match: {
    params: { pizzaId }
  }
}) => (
  <div>
    <h1 className="bold text-6xl">
      Toppings for {pizza.find(({ id }) => id === pizzaId).name}
    </h1>
    <ul>
      {pizza
        .find(({ id }) => id === pizzaId)
        .toppings.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
    </ul>
  </div>
);

const AnotherRoute = () => <h1>Another One</h1>;

export default [
//   { path: "/", name: "Pizza", Component: Pizza },
    // { path: "/pizza/:pizzaId", name: "Edit Pizza", Component: EditPizza },
    // {
    //     path: "/pizza/:pizzaId/toppings",
    //     name: "Pizza Toppings",
    //     Component: Toppings
    // },
    // { path: "/another", name: "Another", Component: AnotherRoute },
    // { path: "/one", name: "One", Component: AnotherRoute },

    { path: "/", name: "หน้าหลัก", Component: HomePage },
    { path: "/login", name: "เข้าสู่ระบบ", Component: LoginPage },
    { path: "/register", name: "สมัครสมาชิก", Component: RegisterPage },
    { path: "/forget-password", name: "ลืมรหัสผ่าน", Component: ForgetPasswordPage },
    { path: "/detail/:nid", name: "รายละเอียด", Component: DetailPage },
    { path: "/my-profile", name: "My Profile", Component: ProfilePage },
    { path: "/my-profile/my-post", name: "My Post", Component: MyPostPage },
    { path: "/my-profile/my-followup", name: "My follow up", Component: MyFollowUpPage },
    { path: "/settings", name: "Settings", Component: SettingsPage },
    { path: "/notifications", name: "Notifications", Component: NotificationsPage },
    { path: "/terms-of-service", name: "Terms of Service", Component: TermsofServicePage },
    { path: "/about-up", name: "About up", Component: AboutupPage },
    { path: "/for-developer", name: "For Developer", Component: ForDeveloperPage },

        
    // { path: "/affiliate-page", name: "แนะนำเพือน", Component: AffiliatePage },
    // { path: "/statement", name: "รายงานการเงิน", Component: StatementPage },
    // { path: "/request-all", name: "สถานะ ฝาก/ถอนเงิน", Component: RequestAllPage },

    // { path: "/lottery-list", name: "แทงหวย", Component: LotteryListPage },
    // { path: "/lottery-list/:type/:id", name: "โพย", Component: ChitPage },
    // { path: "/lottery/government", name: "หวยรัฐบาลไทย", Component: GovernmentPage },

    // { path: "/lottery-list/yeekee-list", name: "จับยี่กี VIP", Component: YeekeeListPage },
    // { path: "/lottery-list/yeekee-list/:type/:id", name: "โพย", Component: ChitPage },
    // { path: "/lottery-list/yeekee-list/chit", name: "โพย", Component: ChitPage },

    // // /lottery/yeekee
    // { path: "/lottery-list/reward/:type/:id", name:"ผลรางวัล", Component: RewardPage },
    // { path: "/lottery-list/reward", name:"ผลรางวัล", Component: RewardPage },

    // { path: "/deposit", name: "ฝากเงิน", Component: DepositPage },
    // { path: "/withdraw", name: "ถอนเงิน", Component: WithdrawPage },
    // { path: "/add-bank", name: "เพิ่มบัญชีธนาคาร", Component: AddBankPage },
    { path: "/contact-us", name: "ติดต่อเรา", Component: ContactUsPage},

    { path: "/help", name:"วิธีการใช้งาน", Component: HelpPage},
    // { path: "/list-chit-customer", name:"รายการโพยทั้งหมด (สำหรับลูกค้า)", Component: LotteryListChitsPage},

    // { path: "/setting-dealers", name:"ตั้งค่าสำหรับเจ้ามือหวย", Component: SettingDealers},
    // { path: "/setting-dealers/list-dealers", name:"รายการโพยทั้งหมด", Component: ListDealers},
    // { path: "/setting-dealers/lottery-distribute", name:"รายการหวยที่รับซื้อ", Component: LotteryDistribute},
    // { path: "/setting-dealers/lottery-suppress", name:"อั้นหวย", Component: LotterySuppress},
];
