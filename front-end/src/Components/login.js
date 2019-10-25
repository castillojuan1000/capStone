import React from 'react';
import {StoreAPIToken, setupSpotify, getCategoriesList} from '../utilityFunctions/util.js';



class Login extends React.Component {
    constructor(props){
      super(props)
      this.state = {
      
      }
    }
    handleClick = () => {
        setupSpotify()
    }
  
    render() {
      return (
          <div className="main">
              <button onClick={this.handleClick}className="btn btn-primary">Login</button>
              </div>
      );
    }
  }

export default Login