import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Private } from "./pages/Private";
import { Favorites } from "./pages/Favorites"; 
import { Demo } from "./pages/Demo";
import { Single } from "./pages/Single";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/private" element={<Private />} />
            <Route path="/favorites" element={<Favorites />} /> 
            <Route path="/demo" element={<Demo />} />
            <Route path="/single/:theId" element={<Single />} />
        </Route>
    )
);
