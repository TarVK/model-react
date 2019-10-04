import ReactDOM from "react-dom";
import React from "react";
import {Application} from "./components/Application";
import {ThemeProvider} from "@deity/falcon-ui";
import {theme} from "./theme";
import {renderTodo} from "./TodoListExample";

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Application />
    </ThemeProvider>,
    document.getElementById("root")
);

// Uncomment the line below to show the todo example
// renderTodo();
