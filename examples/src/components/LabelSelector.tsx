import React, {FunctionComponent} from "react";
import {ApplicationModel} from "../models/ApplicationModel";
import {useModel} from "model-react";
import {LabelModel} from "../models/LabelModel";
import {FlexLayout, Box, Backdrop} from "@deity/falcon-ui";

const LabelChoice: FunctionComponent<{labelModel: LabelModel; onClick: () => void}> = ({
    labelModel,
    onClick,
}) => {
    const label = useModel(labelModel);
    return (
        <Box mb="xs" css={{cursor: "pointer"}} onClick={onClick}>
            {label.getText()}
        </Box>
    );
};

export const LabelSelector: FunctionComponent = () => {
    const application = useModel(ApplicationModel);
    const labels = application.getLabels();

    return (
        <>
            <Box
                boxShadow="strong"
                flexDirection="column"
                bg="white"
                p="sm"
                border="regular"
                borderRadius="medium"
                display="inline-block"
                css={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1000,
                }}>
                {labels.length ? (
                    <>
                        <Box mb="md">Select one of the available labels:</Box>
                        {labels.map(labelModel => (
                            <LabelChoice
                                key={labelModel.$getID()}
                                labelModel={labelModel}
                                onClick={() => application.addLabelToPicture(labelModel)}
                            />
                        ))}
                    </>
                ) : (
                    <Box>
                        No labels are present yet, please create a label on the left
                    </Box>
                )}
            </Box>
            <Backdrop visible onClick={() => application.setLabelTarget(null)}></Backdrop>
        </>
    );
};
