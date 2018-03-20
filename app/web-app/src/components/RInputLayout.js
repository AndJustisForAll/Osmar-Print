import React from 'react';

function RInputLayout(props){
	return(
		<div>
		<br/>
		<h1>Reporte Entradas</h1>
		<table className="table table-hover">
			<thead>
			    <tr>
						<th>Id</th>
			      <th>Producto</th>
			      <th>Quantity</th>
			      <th>Date</th>
						<th>Usuario</th>
			    </tr>
		  	</thead>
		  	<tbody>
			{props.children}
			</tbody>
		</table>
		</div>
	)
}

export default RInputLayout;
