import React from "react";
import ReactDOM from "react-dom";
import {Example} from "./components/Example";
import {AppLayout} from "./components/AppLayout";

import quickStart from "./quickStart/quickStart?example";
import field from "./examples/field/Field?example";
import dataLoader from "./examples/dataLoader/DataLoader?example";
import loaderSwitch from "./examples/loaderSwitch/LoaderSwitch?example";
import loader from "./examples/loader/Loader?example";
import loadableField from "./examples/loadableField/LoadableField?example";
import refreshData from "./examples/refreshData/refreshData?example";
import exceptions from "./examples/exceptions/exceptions?example";
import virtualDataSource from "./examples/virtualDataSource/virtualDataSource?example";
import dataCacher from "./examples/dataCacher/DataCacher?example";
import executionState from "./examples/executionState/ExecutionState?example";
import getAsync from "./examples/getAsync/getAsync?example";
import observer from "./examples/observer/Observer?example";
import waitFor from "./examples/waitFor/waitFor?example";
import getState from "./examples/getState/getState?example";
import proxyHook from "./examples/proxyHook/proxyHook?example";
import ManualSourceHelper from "./examples/manualSourceHelper/ManualSourceHelper?example";
import hookErrorHandler from "./examples/hookErrorHandler/hookErrorHandler?example";

import transform from "./advancedExamples/transform/transform?example";
import alterableApi from "./advancedExamples/alterableApi/alterableAPI?example";
import api from "./advancedExamples/api/API?example";

ReactDOM.render(
    <AppLayout
        items={[
            {name: "QuickStart", content: <Example {...quickStart} showCodeInitial />},
            {
                name: "examples",
                children: [
                    {name: "Field", content: <Example {...field} />, apiLink: ["@Field"]},
                    {
                        name: "DataLoader",
                        content: <Example {...dataLoader} />,
                        apiLink: ["@DataLoader"],
                    },
                    {
                        name: "LoaderSwitch",
                        content: <Example {...loaderSwitch} />,
                        apiLink: ["@LoaderSwitch"],
                    },
                    {
                        name: "Loader",
                        content: <Example {...loader} />,
                        apiLink: ["@Loader"],
                    },
                    {
                        name: "LoadableField",
                        content: <Example {...loadableField} />,
                        apiLink: ["@LoadableField"],
                    },
                    {name: "Force refresh time", content: <Example {...refreshData} />},
                    {name: "Exceptions", content: <Example {...exceptions} />},
                    {
                        name: "Virtual data sources",
                        content: <Example {...virtualDataSource} />,
                    },
                    {
                        name: "DataCacher",
                        content: <Example {...dataCacher} />,
                        apiLink: ["@DataCacher"],
                    },
                    {
                        name: "ExecutionState",
                        content: <Example {...executionState} />,
                        apiLink: ["@ExecutionState"],
                    },
                    {
                        name: "GetAsync",
                        content: <Example {...getAsync} />,
                        apiLink: ["@getAsync"],
                    },
                    {
                        name: "Observer",
                        content: <Example {...observer} />,
                        apiLink: ["@Observer"],
                    },
                    {
                        name: "WaitFor",
                        content: <Example {...waitFor} />,
                        apiLink: ["@waitFor"],
                    },
                    {
                        name: "GetState",
                        content: <Example {...getState} />,
                        apiLink: ["@getExceptions", "@isLoading"],
                    },
                    {
                        name: "ProxyHook",
                        content: <Example {...proxyHook} />,
                        apiLink: ["@proxyHook"],
                    },
                    {
                        name: "ManualSourceHelper",
                        content: <Example {...ManualSourceHelper} />,
                        apiLink: ["@ManualSourceHelper"],
                    },
                    {
                        name: "HookErrorHandler",
                        content: <Example {...hookErrorHandler} />,
                        apiLink: ["@hookErrorHandler"],
                    },
                ],
            },
            {
                name: "Advanced examples",
                children: [
                    {
                        name: "Transforming data",
                        content: <Example {...transform} />,
                    },
                    {
                        name: "Alterable remote API",
                        content: <Example {...alterableApi} />,
                    },
                    {name: "Remote API", content: <Example {...api} />},
                ],
            },
        ]}
    />,
    document.getElementById("root")
);
