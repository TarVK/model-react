import React, {FunctionComponent} from "react";
import {Picture} from "../models/Picture";
import {LabelComp} from "./LabelComp";
import {Box, Input, Button, FlexLayout, Icon} from "@deity/falcon-ui";
import {useDataHook} from "model-react";
import {application} from "../models/application";

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

export const PictureComp: FunctionComponent<{picture: Picture}> = ({picture}) => {
    const [l] = useDataHook();
    return (
        <Box mb="sm" bg="secondary" border="regular" borderRadius="medium">
            <FlexLayout>
                {/* name */}
                <Input
                    flex={1}
                    css={{cursor: "pointer"}}
                    value={picture.getName(l)}
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
                    src={picture.getPicture(l)}
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
                    {picture.getLabels(l).map(label => (
                        <LabelComp
                            key={label.ID}
                            label={label}
                            onDelete={() => picture.removeLabel(label)}
                        />
                    ))}
                    Total label characters: {picture.getLabelLengthSum(l)}
                </Box>
            </FlexLayout>
        </Box>
    );
};
