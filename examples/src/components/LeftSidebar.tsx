import React, {FunctionComponent} from "react";
import {ApplicationModel} from "../models/ApplicationModel";
import {useModel} from "model-react";
import {Box, Input, FlexLayout} from "@deity/falcon-ui";
import {LabelList} from "./LabelList";

export const LeftSidebar: FunctionComponent = ({}) => {
    const application = useModel(ApplicationModel);
    const user = useModel(application.getUser());
    return (
        <FlexLayout flexDirection="column">
            <Box p="md">
                <Box mb="sm">Please enter your name:</Box>
                <Input
                    value={user.getName()}
                    onChange={e => user.setName(e.target.value)}
                />
            </Box>
            <Box flex={1} borderTop="regular" p="md">
                <LabelList />
            </Box>
        </FlexLayout>
    );
};
