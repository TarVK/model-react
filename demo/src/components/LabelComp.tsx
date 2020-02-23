import React, {FunctionComponent, useRef} from "react";
import {Label} from "../models/Label";
import {Button, Input, Icon, FlexLayout} from "@deity/falcon-ui";
import {useDataHook} from "model-react";

export const LabelComp: FunctionComponent<{
    label: Label;
    onDelete?: () => void;
    select?: boolean;
}> = ({label: labelModel, onDelete, select}) => {
    const [l] = useDataHook();
    const ref = useRef(null);

    return (
        <FlexLayout mb="xs">
            <Input
                flex={1}
                value={labelModel.getText(l)}
                mr="sm"
                ref={input => {
                    if (!ref.current && select) {
                        ref.current = input;
                        input.focus();
                    }
                }}
                onChange={e => labelModel.setText(e.target.value)}
            />
            {onDelete && (
                <Button onClick={onDelete} css={{height: 37, verticalAlign: "bottom"}}>
                    <Icon src="trash" />
                </Button>
            )}
        </FlexLayout>
    );
};
