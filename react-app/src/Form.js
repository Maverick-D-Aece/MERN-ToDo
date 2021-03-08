import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";

export default function Form(props) {
	const [text, setText] = useState("");

	const handleChange = (e) => {
		e.preventDefault();
		setText(e.target.value);
	};

	const handleKeyDown = (e) => {
		if (e.code === "Enter") {
			props.submit(text);
			setText("");
		}
	};

	return (
		<div>
			<TextField
				label="new todo..."
				value={text}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				type="text"
				autoComplete="new-todo"
				variant="outlined"
				fullWidth
			/>
		</div>
	);
}
