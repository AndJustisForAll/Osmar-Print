import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'


class Login extends Component {
	constructor(props){
		super(props);
		this.state={Log:3};
	}

login (event) {
	event.preventDefault();
	var form = new FormData(event.target);
	fetch('./login', {
		method: 'POST',
		credentials: "same-origin",
		body: form
	})
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      // Examine the text in the response
      response.json().then(function(data) {
				if(data.respuesta != "success")
				  alert("Parece que no escribiste correctamente tu correo nombre de usuario o contraseña")
				if(data.level == 1) window.location='/_admin'
				if(data.level == 2) window.location='/_inputs'
				if(data.level == 3) window.location='/_outputs'
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

	render(){
		return(
			<div className="container" id="login">
				<form id="form" onSubmit={this.login} className="jumbotron">
					<br/>
					<h1>Iniciar Sesión</h1>
					<div className="form-group">
					<input className="form-control" type="text" placeholder="Usuario" name="username" id="username"/>
					</div>
					<div className="form-group">
					<input className="form-control" type="password" placeholder="Contraseña" name="password" id="password"/>
					</div>
					<button className="btn btn-primary">Ingresar</button>
				</form>
			</div>

		);
	}
}

export default Login;
