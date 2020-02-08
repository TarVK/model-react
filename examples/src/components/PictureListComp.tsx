import React, {FunctionComponent} from "react";
import {PictureComp} from "./PictureComp";
import {Box, FlexLayout, Button, Icon} from "@deity/falcon-ui";
import {application} from "../models/application";
import {useDataHook} from "model-react";

export const PictureListComp: FunctionComponent = ({}) => {
    const [l] = useDataHook();

    return (
        <Box p="md">
            <FlexLayout mb="sm">
                <Box flex={1} lineHeight="large">
                    Pictures:
                </Box>
                <Box>
                    <Button onClick={() => application.setPictureSearchOpened()}>
                        <Icon src="add" />
                    </Button>
                </Box>
            </FlexLayout>
            {application.getPictures(l).map(picture => (
                <PictureComp key={picture.ID} picture={picture} />
            ))}
        </Box>
    );
};
