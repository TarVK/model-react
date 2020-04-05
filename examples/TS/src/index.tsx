import React from "react";
import ReactDOM from "react-dom";
import {HashRouter as Router, Switch, Route, Link} from "react-router-dom";

import quickStart from "./quickStart";
import field from "./examples/Field";
import dataLoader from "./examples/DataLoader";
import loaderSwitch from "./examples/LoaderSwitch";
import loader from "./examples/Loader";
import loadableField from "./examples/LoadableField";
import combiningData from "./examples/combiningData";
import dataCacher from "./examples/DataCacher";
import getAsync from "./examples/getAsync";
import getState from "./examples/getState";
import exceptions from "./examples/Exceptions";
import actionState from "./examples/ActionState";
import useActionState from "./examples/useActionState";

const pages = [
    {name: "QuickStart", element: quickStart},
    {name: "Field", element: field},
    {name: "DataLoader", element: dataLoader},
    {name: "LoaderSwitch", element: loaderSwitch},
    {name: "Loader", element: loader},
    {name: "LoaderField", element: loadableField},
    {name: "combiningData", element: combiningData},
    {name: "DataCacher", element: dataCacher},
    {name: "getAsync", element: getAsync},
    {name: "Exceptions", element: exceptions},
    {name: "getState", element: getState},
    {name: "ActionState", element: actionState},
    {name: "useActionState", element: useActionState},
];

// Renders the available pages
ReactDOM.render(
    <Router>
        <div style={{display: "flex"}}>
            {/* The index */}
            <div style={{backgroundColor: "#9db8e6", padding: 5, marginRight: 5}}>
                <Link to={`/about`}>
                    <h3>About</h3>
                </Link>
                {pages.map(({name}) => (
                    <div key={name}>
                        <Link to={`/${name}`}>{name}</Link>
                    </div>
                ))}
            </div>

            {/* The page contents */}
            <div style={{flexGrow: 1, padding: 10, backgroundColor: "#add8e6"}}>
                <Switch>
                    {pages.map(({name, element}) => (
                        <Route key={name} path={`/${name}`}>
                            {element}
                        </Route>
                    ))}
                    <Route path={["/", "/about"]}>
                        <p>
                            These are purely example files to show capabilities of the
                            library.
                            <br />
                            Please have a look at the source code since the examples
                            results are rather meaningless on their own. <br />
                            <a href="https://github.com/TarVK/model-react/tree/master/examples/src/examples">
                                Source code
                            </a>
                        </p>
                    </Route>
                </Switch>
            </div>
        </div>
    </Router>,
    document.getElementById("root")
);
