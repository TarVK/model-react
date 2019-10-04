import React, {FunctionComponent, useRef} from "react";
import {useModel} from "model-react";
import {LabelModel} from "../models/LabelModel";
import {Box, Button, Input, Icon, FlexLayout} from "@deity/falcon-ui";

export const Label: FunctionComponent<{
    labelModel: LabelModel;
    onDelete?: () => void;
    select?: boolean;
}> = ({labelModel, onDelete, select}) => {
    const label = useModel(labelModel);
    const ref = useRef(null);

    return (
        <FlexLayout mb="xs">
            <Input
                flex={1}
                value={label.getText()}
                mr="sm"
                ref={input => {
                    if (!ref.current && select) {
                        ref.current = input;
                        input.focus();
                    }
                }}
                onChange={e => label.setText(e.target.value)}
            />
            {onDelete && (
                <Button onClick={onDelete} css={{height: 37, verticalAlign: "bottom"}}>
                    <Icon src="trash" />
                </Button>
            )}
        </FlexLayout>
    );
};
