import React from 'react';
import ReactDOM from 'react-dom';
<<<<<<< HEAD
//import '../index.css';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import store from './Store';
import App from './App.js';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<CookiesProvider>
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
	</CookiesProvider>,

=======
import App from './App';
import { Provider } from 'react-redux';
import store from './Store';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
>>>>>>> antony
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
