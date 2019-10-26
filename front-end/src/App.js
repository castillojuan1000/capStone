import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar'
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SideDrawer from './components/Navbar/SideDrawer/SideDrawer'
import Backdrop from './components/Navbar/Backdrop/Backdrop';
import CarouselContainer from './components/CarouselContainer';

function App() {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const style = {
    marginTop: '8vh',
    color: 'black',
    width: '100%',
  }

  const drawerToggleClickHandler = () => {
    setSideDrawerOpen((prevState) => {
      return !sideDrawerOpen;
    });
  }

  const closeSideDrawerHandler = () => {
    setSideDrawerOpen(false);
  }


  let backdrop;

  if (sideDrawerOpen) {

    backdrop = <Backdrop click={closeSideDrawerHandler} />;
  }

  return (

    <Router>
      <div className="App" style={{ height: '100vh' }}>
        <Navbar draweronClick={drawerToggleClickHandler} />
        <SideDrawer click={closeSideDrawerHandler} show={sideDrawerOpen} />;
        {backdrop}
        <main style={style}>

          <Route exact path='/' component={CarouselContainer} />
        </main>
      </div>

    </Router >
  );
}

export default App;
