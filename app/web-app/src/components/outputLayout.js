import React from 'react';

function OutputLayout(props){
	return(
		<div>
		<br/>
		<h1>Salidas</h1>
		<table className="table table-hover">
			<thead>
			    <tr>
			      <th>Producto</th>
			      <th>Existencia</th>
			      <th>Cantidad</th>
			      <th><button onClick={props.listar} className="btn btn-primary">Actualizar</button></th>
			    </tr>
		  	</thead>
		  	<tbody>
			{props.children}
			</tbody>
		</table>
		</div>
	)
}

export default OutputLayout;
