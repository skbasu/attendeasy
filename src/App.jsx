import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';

const App = () => {
  return (
    <div className='bg-[#000000] min-h-screen'>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/signin" element={<SignInScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
