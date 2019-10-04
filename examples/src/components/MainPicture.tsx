import React, {FunctionComponent} from "react";
import {ApplicationModel} from "../models/ApplicationModel";
import {useModel} from "model-react";
import {theme} from "../theme";
import {Box, FlexLayout} from "@deity/falcon-ui";

const Img: FunctionComponent<{src: string; onClick?: () => void}> = ({src, onClick}) => (
    <Box
        onClick={onClick}
        flex={1}
        bg="black"
        css={{
            width: "100%",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${src})`,
        }}
    />
);

export const MainPicture: FunctionComponent = ({}) => {
    const application = useModel(ApplicationModel);
    const selectedPicture = useModel(application.getSelectedPicture());
    return (
        <Box
            css={{width: "100%", height: "100%"}}
            borderLeft="regular"
            bg="secondary"
            borderRight="regular">
            {selectedPicture ? (
                <FlexLayout flexDirection="column" css={{height: "100%"}}>
                    <Box p="md">{selectedPicture.getTitle()}</Box>
                    <Img src={selectedPicture.getPicture()} />
                </FlexLayout>
            ) : (
                <Box p="lg">Please select a picture on the right</Box>
            )}
        </Box>
    );
};
