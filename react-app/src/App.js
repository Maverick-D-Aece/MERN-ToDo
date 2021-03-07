import "./App.css";
import { gql } from "@apollo/client";
import { graphql } from "@apollo/client/react/hoc";

const TodosQuery = gql`
	{
		todos {
			id
			text
			complete
		}
	}
`;

function App(props) {
	console.log(props);
	const {
		data: { loading, todos },
	} = props;
	if (loading) {
		return null;
	}
	return (
		<div className="App">
			<h1>Your Todos</h1>
			{todos.map((todo) => (
				<div className="todo-container">{todo.text}</div>
			))}
		</div>
	);
}

export default graphql(TodosQuery)(App);
// export default App;
