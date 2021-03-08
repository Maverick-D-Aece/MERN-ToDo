import { gql } from "@apollo/client";
import { graphql } from "@apollo/client/react/hoc";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

import produce from "immer";
import Form from "./Form";

const TodosQuery = gql`
	{
		todos {
			id
			text
			complete
		}
	}
`;

const UpdateMutation = gql`
	mutation($id: ID!, $complete: Boolean!) {
		updateTodo(id: $id, complete: $complete)
	}
`;

const RemoveMutation = gql`
	mutation($id: ID!) {
		removeTodo(id: $id)
	}
`;

const CreateMutation = gql`
	mutation($text: String!) {
		createTodo(text: $text) {
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

	const updateTodo = async (todo) => {
		await props.updateTodo({
			variables: {
				id: todo.id,
				complete: !todo.complete,
			},
			refetchQueries: [{ query: TodosQuery }],
		});
	};

	const removeTodo = async (todo) => {
		await props.removeTodo({
			variables: {
				id: todo.id,
			},
			refetchQueries: [{ query: TodosQuery }],
		});
	};

	const createTodo = async (text) => {
		await props.createTodo({
			variables: {
				text,
			},
			// refetchQueries: [{ query: TodosQuery }],

			update: (store, { data }) => {
				// may wanna catch the potential error here, 'cause sometimes ... may not be in the cache
				const todoData = store.readQuery({
					query: TodosQuery,
				});
				store.writeQuery({
					query: TodosQuery,
					data: produce(todoData, (x) => {
						x.todos.unshift(data); //* Unshift is not adding the new todo to the top of the list
					}),
				});
			},
		});
	};

	return (
		<div style={{ display: "flex" }}>
			<div style={{ margin: "auto", width: 400 }}>
				<h1
					style={{
						textAlign: "center",
						fontFamily: "Roboto, sans-serif",
						fontWeight: "normal",
					}}
				>
					Your Todos
				</h1>
				<Paper elevation={3}>
					<Form submit={createTodo} />
					<List>
						{todos.map((todo) => {
							const labelId = `checkbox-list-label-${todo.id}`;

							return (
								<ListItem
									key={todo.id}
									role={undefined}
									dense
									button
									onClick={() => updateTodo(todo)}
								>
									<ListItemIcon>
										<Checkbox
											edge="start"
											checked={todo.complete}
											tabIndex={-1}
											disableRipple
											inputProps={{ "aria-labelledby": labelId }}
										/>
									</ListItemIcon>
									<ListItemText primary={todo.text} />
									<ListItemSecondaryAction>
										<IconButton edge="end" onClick={() => removeTodo(todo)}>
											<CancelIcon />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							);
						})}
					</List>
				</Paper>
			</div>
		</div>
	);
}

export default graphql(CreateMutation, { name: "createTodo" })(
	graphql(RemoveMutation, { name: "removeTodo" })(
		graphql(UpdateMutation, { name: "updateTodo" })(graphql(TodosQuery)(App))
	)
);
// export default App;
