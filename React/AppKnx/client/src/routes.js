// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import test from "views/test/test.js";
import Typography from "views/Typography/Typography.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/user", //! CHANGER LE PATH !
    name: "Chenillard",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/test", //! CHANGER LE PATH !
    name: "Jeu de pari",
    icon: "content_paste",
    component: test,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Test TRISTAN",
    icon: LibraryBooks,
    component: Typography,
    layout: "/admin"
  }
];

export default dashboardRoutes;
