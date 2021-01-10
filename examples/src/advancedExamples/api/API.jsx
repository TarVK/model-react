import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    Container,
    IconButton,
    Modal,
    Paper,
    Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {Skeleton} from "@material-ui/lab";
import {
    DataLoader,
    DataCacher,
    useDataHook,
    LoaderSwitch,
    Loader,
    Field,
} from "model-react";
import React, {useCallback, useRef, useState} from "react";

// Fake api provided by: https://jsonplaceholder.typicode.com/

/*************************
 *       Data model      *
 *************************/
class Cache {
    items = new Map();
    constructor(creator) {
        this.create = creator;
    }
    get(ID, ...rest) {
        if (!this.items.has(ID)) this.items.set(ID, this.create(ID, ...rest));
        return this.items.get(ID);
    }
}
class DataFetcher extends DataLoader {
    constructor(path, init) {
        super(async () => {
            const raw = await fetch(`https://jsonplaceholder.typicode.com/${path}`);
            return await raw.json();
        }, init);
    }
}

const initPost = {
    id: -1,
    userId: -1,
    title: "Not found",
    body: "The post could not be found",
};
class Post {
    data = new DataFetcher(`posts/${this.ID}`, initPost);
    commentsRaw = new DataFetcher(
        `posts/${this.ID}/comments`,
        []
    );
    comments = new DataCacher(h =>
        this.commentsRaw.get(h).map(({id}) => Comment.get(id))
    );
    constructor(ID) {
        this.ID = ID;
    }

    getTitle = h => this.data.get(h).title;
    getBody = h => this.data.get(h).body;
    getAuthor = h => User.get(this.data.get(h).userId);
    getComments = h => this.comments.get(h);

    static cache = new Cache(ID => new Post(ID));
    static get(ID) {
        return this.cache.get(ID);
    }
}

const initComment = {
    id: -1,
    postId: -1,
    name: "Not found",
    body: "The comment couldn't be found",
    email: "not@found.com",
};
class Comment {
    data = new DataFetcher(`comments/${this.ID}`, initComment);
    constructor(ID) {
        this.ID = ID;
    }

    getName = h => this.data.get(h).name;
    getBody = h => this.data.get(h).body;
    getEmail = h => this.data.get(h).email;
    getPost = h => Post.get(this.data.get(h).postId);

    static cache = new Cache(ID => new Comment(ID));
    static get(ID) {
        return this.cache.get(ID);
    }
}
const initUser = {
    id: -1,
    name: "Not found",
    username: "Not found",
    email: "not@found.com",
    phone: "0 000 000 0000",
    website: "notFound.com",
};
class User {
    data = new DataFetcher(`users/${this.ID}`, initUser);
    postsRaw = new DataFetcher(
        `users/${this.ID}/posts`,
        []
    );
    posts = new DataCacher(h =>
        this.postsRaw.get(h).map(({id}) => Post.get(id))
    );
    constructor(ID) {
        this.ID = ID;
    }

    getName = h => this.data.get(h).name;
    getUsername = h => this.data.get(h).username;
    getEmail = h => this.data.get(h).email;
    getPhone = h => this.data.get(h).phone;
    getWebsite = h => this.data.get(h).website;
    getPosts = h => this.posts.get(h);

    static cache = new Cache(ID => new User(ID));
    static get(ID) {
        return this.cache.get(ID);
    }
}
class App {
    usersRaw = new DataFetcher("users", []);
    users = new DataCacher(h =>
        this.usersRaw.get(h).map(({id}) => User.get(id))
    );
    getUsers = h => this.users.get(h);

    postsRaw = new DataFetcher("posts", []);
    posts = new DataCacher(h =>
        this.postsRaw
            .get(h)
            .sort(() => Math.random() - 0.5) // Shitty randomization, to see some different users
            .map(({id}) => Post.get(id))
    );
    getPosts = h => this.posts.get(h);

    commentsRaw = new DataFetcher("comments", []);
    comments = new DataCacher(h =>
        this.commentsRaw.get(h).map(({id}) => Comment.get(id))
    );
    getComments = h => this.comments.get(h);

    selectedUser = new Field(null);
    selectUser = user => this.selectedUser.set(user);
    getSelectedUser = h => this.selectedUser.get(h);
}

/*************************
 *  App visualization    *
 *************************/
const PostView = ({
    post,
    onClickAuthor,
}) => {
    const [commentsShown, setCommentsShown] = useState(false);
    const commentsLoaded = useRef(commentsShown);
    if (commentsShown) commentsLoaded.current = true; // Makes comments persistent after initially loaded
    return (
        <Box marginBottom={2}>
            <Paper>
                <Box padding={2}>
                    <Typography gutterBottom variant="h5" component="h2">
                        <Loader
                            onLoad={<Skeleton variant="rect" width="100%" height={30} />}>
                            {h => post.getTitle(h)}
                        </Loader>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        By{" "}
                        <Loader
                            onLoad={
                                <Skeleton
                                    variant="rect"
                                    style={{display: "inline-block"}}
                                    width={200}
                                    height={20}
                                />
                            }>
                            {h => (
                                <a
                                    href="#"
                                    onClick={useCallback(
                                        e => {
                                            onClickAuthor(post.getAuthor());
                                            e.preventDefault();
                                        },
                                        [post]
                                    )}>
                                    {post.getAuthor(h).getUsername(h)}
                                </a>
                            )}
                        </Loader>
                    </Typography>

                    <Typography variant="body2" color="textSecondary" component="p">
                        <Loader
                            onLoad={
                                <Skeleton variant="rect" width="100%" height={120} />
                            }>
                            {h => post.getBody(h)}
                        </Loader>
                    </Typography>

                    <Box display="flex" alignItems="center">
                        <Box flex={1}>Comments</Box>
                        <IconButton
                            onClick={useCallback(() => setCommentsShown(s => !s), [])}>
                            <ExpandMoreIcon
                                style={{
                                    transform: commentsShown ? "rotate(180deg)" : "",
                                }}
                            />
                        </IconButton>
                    </Box>
                    <Collapse in={commentsShown} timeout="auto" unmountOnExit>
                        {commentsLoaded && (
                            <Loader onLoad={<CircularProgress />}>
                                {h =>
                                    post
                                        .getComments(h)
                                        .map(comment => (
                                            <CommentView
                                                key={comment.ID}
                                                comment={comment}
                                            />
                                        ))
                                }
                            </Loader>
                        )}
                    </Collapse>
                </Box>
            </Paper>
        </Box>
    );
};

const CommentView = ({comment}) => (
    <Box marginTop={2}>
        <Typography gutterBottom variant="h6" component="h3">
            <Loader onLoad={<Skeleton variant="rect" width={200} height={25} />}>
                {h => comment.getName(h)}
            </Loader>
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
            <Loader onLoad={<Skeleton variant="rect" width="100%" height={70} />}>
                {h => comment.getBody(h)}
            </Loader>
        </Typography>
    </Box>
);

const AppView = ({app}) => {
    const [limit, setLimit] = useState(3);

    const [h, c] = useDataHook();
    const posts = app.getPosts(h);
    const selectedUser = app.getSelectedUser(h);
    const selectUser = useCallback(user => app.selectUser(user), [app]);

    return (
        <Container maxWidth="md" style={{maxHeight: "100vh", overflow: "auto"}}>
            <LoaderSwitch onLoad={<CircularProgress />} {...c}>
                {posts.length > limit && (
                    <Button onClick={() => setLimit(l => l + 5)}>Load more</Button>
                )}
                {posts
                    .slice(0, limit)
                    .reverse()
                    .map(post => (
                        <PostView key={post.ID} post={post} onClickAuthor={selectUser} />
                    ))}
            </LoaderSwitch>

            <Modal
                open={selectedUser != null}
                onClose={useCallback(() => selectUser(null), [selectUser])}>
                <Container
                    maxWidth="md"
                    style={{
                        maxHeight: "100vh",
                        overflow: "auto",
                        backgroundColor: "#DDD",
                    }}>
                    <Loader onLoad={<CircularProgress />}>
                        {h =>
                            selectedUser
                                ?.getPosts(h)
                                .map(post => (
                                    <PostView
                                        key={post.ID}
                                        post={post}
                                        onClickAuthor={selectUser}
                                    />
                                ))
                        }
                    </Loader>
                </Container>
            </Modal>
        </Container>
    );
};

/***********************
 *  Show the result    *
 ***********************/
const app = new App();
export default <AppView app={app} />;
