import React from 'react';
import { Link } from 'react-router-dom'
import data from './../lenguage/menu.json';
import { createPortal } from 'react-dom';

export default class Example extends React.Component {
  constructor(props){
		super(props);
    this.state={
      len: data.espanol  //Lenguage
    }
	}
  componentWillMount(){
    if(this.props.len == "spanish")
    {
      this.setState({
        len: data.espanol
      })
    }else{
      this.setState({
        len: data.ingles
      })
    }
	}

  render() {
    return (
      createPortal(
        <nav className="navbar navbar-expand-lg navbar-inverse bg-inverse">
          <a className="navbar-brand" href="#">{this.state.len.home}</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={{pathname:'/_users', state: {len : 'english' } }}  className="nav-link" href="#">{this.state.len.users}<span className="sr-only">(current)</span></Link>
              </li>
              <li className="nav-item active">
                <Link to="/_products" className="nav-link" href="#">{this.state.len.products}<span className="sr-only">(current)</span></Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.state.len.reports}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link to="/_rInputs" className="dropdown-item" href="#">{this.state.len.rep.inputs}</Link>
                  <Link to="/_rOutputs" className="dropdown-item" href="#">{this.state.len.rep.outputs}</Link>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.state.len.lenguage}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#" onClick={this.props.ingles}>{this.state.len.len.en}</a>
                  <a className="dropdown-item" href="#" onClick={this.props.espanol}>{this.state.len.len.esp}</a>
                </div>
              </li>
            </ul>
            <div className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="search" onChange={this.props.search} placeholder={this.state.len.search} aria-label="Search"/>
              <button className="btn btn-outline-success my-2 my-sm-0" onClick={this.props.listar}>{this.state.len.search}</button>
            </div>
          </div>
        </nav>,
    document.getElementById('menu')
    )
  );
  }
}
