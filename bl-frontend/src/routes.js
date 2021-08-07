import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import NotificationsPage from './pages/NotificationsPage'
import MyPostPage from './pages/MyPostPage'
import MyFollowUpPage from './pages/MyFollowUpPage'
import TermsofServicePage from './pages/TermsofServicePage'
import AboutupPage from './pages/AboutupPage'
import ForDeveloperPage from './pages/ForDeveloperPage'
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import RegisterPage from './pages/RegisterPage';

export default [
    { path: "/", name: "หน้าหลัก", Component: HomePage },
    { path: "/register", name: "สมัครสมาชิก", Component: RegisterPage },
    { path: "/forget-password", name: "ลืมรหัสผ่าน", Component: ForgetPasswordPage },
    { path: "/detail/:nid", name: "รายละเอียด", Component: DetailPage },
    { path: "/my-profile", name: "My Profile", Component: ProfilePage },
    { path: "/my-profile/my-post", name: "My Post", Component: MyPostPage },
    { path: "/my-profile/my-followup", name: "My follow up", Component: MyFollowUpPage },
    { path: "/my-profile/my-post/:nid", name: "รายละเอียด", Component: DetailPage },
    { path: "/my-profile/my-followup/:nid", name: "รายละเอียด", Component: DetailPage },
    // { path: "/my-profile/detail/:nid", name: "รายละเอียด", Component: DetailPage },
    // /my-profile/detail/70287
    { path: "/settings", name: "Settings", Component: SettingsPage },
    { path: "/notifications", name: "Notifications", Component: NotificationsPage },
    { path: "/terms-of-service", name: "Terms of Service", Component: TermsofServicePage },
    { path: "/about-up", name: "About up", Component: AboutupPage },
    { path: "/for-developer", name: "For Developer", Component: ForDeveloperPage },
];
