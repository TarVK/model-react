import React, {FunctionComponent} from "react";
import {ApplicationModel} from "../models/ApplicationModel";
import {useModel} from "model-react";
import {Label} from "./Label";
import {LabelModel} from "../models/LabelModel";
import {Button, FlexLayout, Box, Icon} from "@deity/falcon-ui";

export const LabelList: FunctionComponent = ({}) => {
    const application = useModel(ApplicationModel);

    return (
        <>
            <FlexLayout mb="sm">
                <Box flex={1} lineHeight="large">
                    All labels:
                </Box>
                <Box>
                    <Button
                        onClick={() => {
                            application.addLabel(new LabelModel());
                        }}>
                        <Icon src="add" />
                    </Button>
                </Box>
            </FlexLayout>
            {application.getLabels().map(labelModel => (
                <Label
                    key={labelModel.$getID()}
                    labelModel={labelModel}
                    onDelete={() => application.removeLabel(labelModel)}
                    select
                />
            ))}
        </>
    );
};
