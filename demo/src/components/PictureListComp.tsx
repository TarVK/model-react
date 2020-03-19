import React, {FC} from "react";
import {PictureComp} from "./PictureComp";
import {Box, FlexLayout, Button, Icon} from "@deity/falcon-ui";
import {application} from "../models/application";
import {useDataHook} from "model-react";

export const PictureListComp: FC = () => {
    const [h] = useDataHook();

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
            {application.getPictures(h).map(picture => (
                <PictureComp key={picture.ID} picture={picture} />
            ))}
        </Box>
    );
};
