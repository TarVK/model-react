import React, {FunctionComponent} from "react";
import {useModel} from "model-react";
import {PictureModel} from "../models/PictureModel";
import {Label} from "./Label";
import {ApplicationModel} from "../models/ApplicationModel";
import {Box, Input, Button, FlexLayout, Icon} from "@deity/falcon-ui";

const Img: FunctionComponent<{src: string; onClick?: () => void}> = ({src, onClick}) => (
    <Box
        onClick={onClick}
        bg="black"
        css={{
            width: 200,
            height: 200,
            cursor: "pointer",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${src})`,
        }}
    />
);

export const Picture: FunctionComponent<{pictureModel: PictureModel}> = ({
    pictureModel,
}) => {
    const application = useModel(ApplicationModel);
    const picture = useModel(pictureModel);
    return (
        <Box mb="sm" bg="secondary" border="regular" borderRadius="medium">
            <FlexLayout>
                {/* name */}
                <Input
                    flex={1}
                    css={{cursor: "pointer"}}
                    value={picture.getName()}
                    onChange={e => picture.setName(e.target.value)}
                />

                <Box>
                    <Button
                        css={{height: 37}}
                        onClick={() => application.removePicture(picture)}>
                        <Icon src="trash" />
                    </Button>
                </Box>
            </FlexLayout>

            <FlexLayout>
                {/* image */}
                <Img
                    src={picture.getPicture()}
                    onClick={() => application.selectPicture(picture)}
                />

                {/* labels */}
                <Box flex={1} p="sm">
                    <FlexLayout mb="sm">
                        <Box flex={1} lineHeight="large">
                            Labels:
                        </Box>
                        <Box>
                            <Button onClick={() => application.setLabelTarget(picture)}>
                                <Icon src="add" />
                            </Button>
                        </Box>
                    </FlexLayout>
                    {picture.getLabels().map(labelModel => (
                        <Label
                            key={labelModel.$getID()}
                            labelModel={labelModel}
                            onDelete={() => picture.removeLabel(labelModel)}
                        />
                    ))}
                    Total label characters: {picture.getLabelLengthSum()}
                </Box>
            </FlexLayout>
        </Box>
    );
};
