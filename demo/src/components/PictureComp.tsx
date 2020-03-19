import React, {FC} from "react";
import {Picture} from "../models/Picture";
import {LabelComp} from "./LabelComp";
import {Box, Input, Button, FlexLayout, Icon} from "@deity/falcon-ui";
import {useDataHook} from "model-react";
import {application} from "../models/application";

const Img: FC<{src: string; onClick?: () => void}> = ({src, onClick}) => (
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

export const PictureComp: FC<{picture: Picture}> = ({picture}) => {
    const [h] = useDataHook();
    return (
        <Box mb="sm" bg="secondary" border="regular" borderRadius="medium">
            <FlexLayout>
                {/* name */}
                <Input
                    flex={1}
                    css={{cursor: "pointer"}}
                    value={picture.getName(h)}
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
                    src={picture.getPicture(h)}
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
                    {picture.getLabels(h).map(label => (
                        <LabelComp
                            key={label.ID}
                            label={label}
                            onDelete={() => picture.removeLabel(label)}
                        />
                    ))}
                    Total label characters: {picture.getLabelLengthSum(h)}
                </Box>
            </FlexLayout>
        </Box>
    );
};
