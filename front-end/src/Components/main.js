import React from 'react';
import {StoreAPIToken, setupSpotify, getCategoriesList} from '../utilityFunctions/util.js';


class Main extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        token: '',
      }
    }
    componentDidMount() {
        let token = StoreAPIToken();
        let expiration = Date.now() + 3600 * 1000; // add one hour in millaseconds
        if (token !== undefined){
            localStorage.setItem('token', token);
            localStorage.setItem('expiration', expiration);
        } else if ((((localStorage.getItem('expiration') - Date.now()) / 1000)) < 60) {
            console.log(1)
            localStorage.setItem('token', '');
            localStorage.setItem('expiration', 0);
            setupSpotify();
        }
        else {
            this.setState({
                ...this.state,
                token: localStorage.getItem('token')
            })
        }
        //getCategoriesList().then(data => console.log(data)); 
        }
  
    render() {

      return (
          <div className="main">{ this.state.token}</div>
      );
    }
  }

export default Main