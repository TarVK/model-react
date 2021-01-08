import React from "react";
import ReactDOM from "react-dom";
import {Example} from "./components/Example";
import {AppLayout} from "./components/AppLayout";

import quickStart from "./quickStart/quickStart?example";
import field from "./examples/field/Field?example";
import dataLoader from "./examples/dataLoader/DataLoader?example";
import loaderSwitch from "./examples/loaderSwitch/LoaderSwitch?example";
import loader from "./examples/loader/Loader?example";
import refreshData from "./examples/refreshData/refreshData?example";
import virtualDataSource from "./examples/virtualDataSource/virtualDataSource?example";
import dataCacher from "./examples/dataCacher/DataCacher?example";
import getAsync from "./examples/getAsync/getAsync?example";
import getState from "./examples/getState/getState?example";
import exceptions from "./examples/exceptions/exceptions?example";
import actionState from "./examples/actionState/ActionState?example";
import useActionState from "./examples/useActionState/useActionState?example";

ReactDOM.render(
    <AppLayout
        items={[
            {name: "QuickStart", content: <Example {...quickStart} showCodeInitial />},
            {
                name: "examples",
                children: [
                    {name: "Field", content: <Example {...field} />},
                    {name: "DataLoader", content: <Example {...dataLoader} />},
                    {name: "LoaderSwitch", content: <Example {...loaderSwitch} />},
                    {name: "Loader", content: <Example {...loader} />},
                    {name: "Force refresh time", content: <Example {...refreshData} />},
                    {
                        name: "Virtual data sources",
                        content: <Example {...virtualDataSource} />,
                    },
                    {name: "DataCacher", content: <Example {...dataCacher} />},
                    {name: "getAsync", content: <Example {...getAsync} />},
                    {name: "exceptions", content: <Example {...exceptions} />},
                    {name: "getState", content: <Example {...getState} />},
                    {name: "actionState", content: <Example {...actionState} />},
                    {name: "useActionState", content: <Example {...useActionState} />},
                ],
            },
        ]}
    />,
    document.getElementById("root")
);
