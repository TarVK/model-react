import React, {FunctionComponent} from "react";
import {ApplicationModel} from "../models/ApplicationModel";
import {useModel} from "model-react";
import {Picture} from "./Picture";
import {Box, FlexLayout, Button, Icon} from "@deity/falcon-ui";

export const PictureList: FunctionComponent = ({}) => {
    const application = useModel(ApplicationModel);

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
            {application.getPictures().map(pictureModel => (
                <Picture key={pictureModel.$getID()} pictureModel={pictureModel} />
            ))}
        </Box>
    );
};
