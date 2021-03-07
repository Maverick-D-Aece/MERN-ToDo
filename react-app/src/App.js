import { gql } from "@apollo/client";
import { graphql } from "@apollo/client/react/hoc";
import Paper from "@material-ui/core/Paper";

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
		<div style={{ display: "flex" }}>
			<div style={{ margin: "auto", width: 400 }}>
				<Paper elevation={3}>
					<h1>Your Todos</h1>
					{todos.map((todo) => (
						<div key={`${todo.id}-todo-item`}>{todo.text}</div>
					))}
				</Paper>
			</div>
		</div>
	);
}

export default graphql(TodosQuery)(App);
// export default App;
