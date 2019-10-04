import React, {FunctionComponent, useCallback, Fragment, memo} from "react";
import {useModel} from "model-react";
import {ApplicationModel} from "../models/ApplicationModel";
import {theme} from "../theme";
import {Box, Backdrop, Input, Icon, FlexLayout, Button} from "@deity/falcon-ui";

const Img: FunctionComponent<{src: string; onClick: () => void}> = ({src, onClick}) => (
    <Box
        onClick={onClick}
        css={{
            width: 500,
            height: 500,
            backgroundColor: theme.colors.black,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${src})`,
            cursor: "pointer",
        }}
    />
);

// Using memo as an example to show this element isn't rerendered by the model when the search changes
// (It is rerendered by PictureSearch, the component, when it rerenders because of a search though, when not using memo)
const Results: FunctionComponent = memo(() => {
    const pictureSearch = useModel(ApplicationModel.getPictureSearch());

    // Display an error if an error occured
    const error = pictureSearch.getError();
    if (error) return <Box m="md">{error}</Box>;

    // Display a loading indicator if results are loading
    const loading = pictureSearch.isLoading();
    if (loading) return <Icon m="md" src="loader" />;

    // Return the results
    return (
        <Box flex={1} css={{width: "100%", overflowY: "auto", overflowX: "hidden"}}>
            {/* uncomment this to show rerenders: {Math.random()} */}
            {pictureSearch.getPictures().map((picture, i) => (
                <Img
                    key={picture.name}
                    src={picture.picture}
                    onClick={() => {
                        pictureSearch.selectPicture(i);
                        ApplicationModel.setPictureSearchOpened(false);
                    }}
                />
            ))}
        </Box>
    );
});

export const PictureSearch: FunctionComponent = ({}) => {
    const application = useModel(ApplicationModel);
    const pictureSearch = useModel(application.getPictureSearch());
    return (
        <>
            <FlexLayout
                boxShadow="strong"
                flexDirection="column"
                bg="white"
                border="regular"
                borderRadius="medium"
                css={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    height: "calc(100% - 100px)",
                    width: 500,
                    transform: "translate(-50%, -50%)",
                    zIndex: 1000,
                }}>
                <FlexLayout css={{width: "100%"}} flexBasis="1">
                    <Input
                        placeholder="Search Rick and Morty characters, E.G. Rick"
                        flex={1}
                        value={pictureSearch.getSearch()}
                        onChange={e => pictureSearch.setSearch(e.target.value)}
                        ref={input => input && input.focus()}
                        onKeyUp={e => {
                            // Only search on enter press
                            if (e.keyCode == 13) pictureSearch.performSearch();
                        }}
                    />
                    <Button
                        css={{height: 37}}
                        onClick={() => pictureSearch.performSearch()}>
                        Search
                    </Button>
                </FlexLayout>
                <Results />
            </FlexLayout>
            <Backdrop
                visible
                onClick={() => application.setPictureSearchOpened(false)}></Backdrop>
        </>
    );
};
