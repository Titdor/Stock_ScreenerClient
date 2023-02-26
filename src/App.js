import React from "react";
import Body from "./Component/Body";
import {BrowserRouter,Routes,Route} from "react-router-dom";

function App() {
  return (
   <div>
      <BrowserRouter>
        <Routes>
          <Route 
          path="/"
          element={<Body/>}>
          </Route>
        </Routes>
      </BrowserRouter>
   </div>
  );
}

export default App;


