import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LayoutDefault } from "../LayoutDefault";
import { Children } from "react";

export const routes= [
{
    path: '/',
    element: <LayoutDefault/> ,
    children: [
  { index: true, element: <Home /> },  // trang mặc định /
  { path: 'login', element: <Login /> }
]
}
];