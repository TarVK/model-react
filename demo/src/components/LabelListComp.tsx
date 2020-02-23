import React, {FunctionComponent} from "react";
import {LabelComp} from "./LabelComp";
import {Label} from "../models/Label";
import {Button, FlexLayout, Box, Icon} from "@deity/falcon-ui";
import {useDataHook} from "model-react";
import {application} from "../models/application";

export const LabelListComp: FunctionComponent = ({}) => {
    const [l] = useDataHook();

    return (
        <>
            <FlexLayout mb="sm">
                <Box flex={1} lineHeight="large">
                    All labels:
                </Box>
                <Box>
                    <Button
                        onClick={() => {
                            application.addLabel(new Label());
                        }}>
                        <Icon src="add" />
                    </Button>
                </Box>
            </FlexLayout>
            {application.getLabels(l).map(labelModel => (
                <LabelComp
                    key={labelModel.ID}
                    label={labelModel}
                    onDelete={() => application.removeLabel(labelModel)}
                    select
                />
            ))}
        </>
    );
};
