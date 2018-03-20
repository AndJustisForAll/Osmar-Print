import React from 'react';

function InputLayout(props){
	return(
		<div>
		<br/>
		<h1>Entradas</h1>
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

export default InputLayout;
