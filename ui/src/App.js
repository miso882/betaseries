import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import MoviesPages from './pages/MoviesPages';
import ShowDetails from './pages/ShowDetails';
// import MovieHeaders from './pages/MovieHeaders.Js';
// import NavBarTop from './pages/NavBarTop.Js';
import ProfilePage from './pages/ProfilePape';
import Show from './pages/Show'
const router = createBrowserRouter([
  {
    element: <HomePage />,
    path: "/"
  },
  {
    element: <TestPage />,
    path: "/testpage"
  },
  {
    element: <ProfilePage />,
    path: "/profile"
  },
  {
    element: <MoviesPages />,
    path: "/movies"
  },
  {
    element: <ShowDetails />,
    path: "/series/:id"
  },
  {
    element: <Show />,
    path: "/show"
  },
  // {
  //   element: <MovieHeaders />,
  //   path: "/"
  // }


]);

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}
export default App;
