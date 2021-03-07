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
	const {
		data: { loading, todos },
	} = props;
	if (loading) {
		return null;
	}
	return (
		<div>
			<h1>Your Todos</h1>
			{todos.map((todo) => (
				<div key={`${todo.id}-todo-item`}>{todo.text}</div>
			))}
		</div>
	);
}

export default graphql(TodosQuery)(App);
// export default App;
