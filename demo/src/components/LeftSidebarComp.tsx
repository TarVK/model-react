import React, {FC} from "react";
import {Box, Input, FlexLayout} from "@deity/falcon-ui";
import {LabelListComp} from "./LabelListComp";
import {application} from "../models/application";
import {useDataHook} from "model-react";

export const LeftSidebarComp: FC = () => {
    const [h] = useDataHook();
    const user = application.getUser();
    return (
        <FlexLayout flexDirection="column">
            <Box p="md">
                <Box mb="sm">Please enter your name:</Box>
                <Input
                    value={user.getName(h)}
                    onChange={e => user.setName(e.target.value)}
                />
            </Box>
            <Box flex={1} borderTop="regular" p="md">
                <LabelListComp />
            </Box>
        </FlexLayout>
    );
};
