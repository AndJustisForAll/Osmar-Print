import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './Login';
import Admin from './Admin';
import Products from './Products';
import Inputs from './../containers/Inputs';
import Outputs from './../containers/Outputs';
import ROutputs from './../containers/ROutputs';
import RInputs from './../containers/RInputs';
import $ from 'jquery';
import Usuarios from './../containers/usuarios.js';

class App extends Component {

	render(){
		return(
				<BrowserRouter>
					<Switch>
						<Route path="/" exact render={()=><Login/>}/>
						<Route path="/_admin" exact render={()=><Admin/>}/>
						<Route path="/_products" exact render={()=><Products/>}/>
						<Route path="/_users" exact render={()=><Usuarios/>}/>
						<Route path="/_inputs" exact render={()=><Inputs/>}/>
						<Route path="/_outputs" exact render={()=><Outputs/>}/>
						<Route path="/_rOutputs" exact render={()=><ROutputs/>}/>
						<Route path="/_rInputs" exact render={()=><RInputs/>}/>
					</Switch>
				</BrowserRouter>
		)
	}
}

export default App;
