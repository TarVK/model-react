import React, {FunctionComponent} from "react";
import {ApplicationModel} from "../models/ApplicationModel";
import {useModel} from "model-react";
import {PictureSearch} from "./PictureSearch";
import {MainPicture} from "./MainPicture";
import {PictureList} from "./PictureList";
import {LabelSelector} from "./LabelSelector";
import {Box, FlexLayout} from "@deity/falcon-ui";
import {LeftSidebar} from "./LeftSidebar";

export const Application: FunctionComponent = ({}) => {
    const application = useModel(ApplicationModel);
    return (
        <Box css={{height: "100%"}}>
            {application.isPictureSearchOpened() && <PictureSearch />}
            {application.isLabeling() && <LabelSelector />}
            <FlexLayout css={{height: "100%"}}>
                <Box css={{width: 300}}>
                    <LeftSidebar />
                </Box>
                <Box flex={1}>
                    <MainPicture />
                </Box>
                <Box css={{width: 500}}>
                    <PictureList />
                </Box>
            </FlexLayout>
        </Box>
    );
};
