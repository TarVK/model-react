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
    IDataHook,
    DataCacher,
    useDataHook,
    LoaderSwitch,
    Loader,
    Field,
} from "model-react";
import React, {FC, useCallback, useRef, useState} from "react";

// Fake api provided by: https://jsonplaceholder.typicode.com/

/*************************
 *       Data model      *
 *************************/
class Cache<T, Args extends any[]> {
    protected items: Map<number, T> = new Map();
    protected create: (ID: number, ...rest: Args) => T;
    public constructor(creator: (ID: number, ...rest: Args) => T) {
        this.create = creator;
    }
    public get(ID: number, ...rest: Args): T {
        if (!this.items.has(ID)) this.items.set(ID, this.create(ID, ...rest));
        return this.items.get(ID) as T;
    }
}
class DataFetcher<T> extends DataLoader<T> {
    public constructor(path: string, init: T) {
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
    protected data = new DataFetcher(`posts/${this.ID}`, initPost);
    protected commentsRaw = new DataFetcher(
        `posts/${this.ID}/comments`,
        [] as typeof initComment[]
    );
    protected comments = new DataCacher(h =>
        this.commentsRaw.get(h).map(({id}) => Comment.get(id))
    );
    public constructor(public ID: number) {}

    public getTitle = (h?: IDataHook) => this.data.get(h).title;
    public getBody = (h?: IDataHook) => this.data.get(h).body;
    public getAuthor = (h?: IDataHook) => User.get(this.data.get(h).userId);
    public getComments = (h?: IDataHook) => this.comments.get(h);

    protected static cache = new Cache(ID => new Post(ID));
    public static get(ID: number): Post {
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
    protected data = new DataFetcher(`comments/${this.ID}`, initComment);
    public constructor(public ID: number) {}

    public getName = (h?: IDataHook) => this.data.get(h).name;
    public getBody = (h?: IDataHook) => this.data.get(h).body;
    public getEmail = (h?: IDataHook) => this.data.get(h).email;
    public getPost = (h?: IDataHook) => Post.get(this.data.get(h).postId);

    protected static cache = new Cache(ID => new Comment(ID));
    public static get(ID: number): Comment {
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
    protected data = new DataFetcher(`users/${this.ID}`, initUser);
    protected postsRaw = new DataFetcher(
        `users/${this.ID}/posts`,
        [] as typeof initPost[]
    );
    protected posts = new DataCacher(h =>
        this.postsRaw.get(h).map(({id}) => Post.get(id))
    );
    public constructor(public ID: number) {}

    public getName = (h?: IDataHook) => this.data.get(h).name;
    public getUsername = (h?: IDataHook) => this.data.get(h).username;
    public getEmail = (h?: IDataHook) => this.data.get(h).email;
    public getPhone = (h?: IDataHook) => this.data.get(h).phone;
    public getWebsite = (h?: IDataHook) => this.data.get(h).website;
    public getPosts = (h?: IDataHook) => this.posts.get(h);

    protected static cache = new Cache(ID => new User(ID));
    public static get(ID: number): User {
        return this.cache.get(ID);
    }
}
class App {
    protected usersRaw = new DataFetcher("users", [] as typeof initUser[]);
    protected users = new DataCacher(h =>
        this.usersRaw.get(h).map(({id}) => User.get(id))
    );
    public getUsers = (h?: IDataHook) => this.users.get(h);

    protected postsRaw = new DataFetcher("posts", [] as typeof initPost[]);
    protected posts = new DataCacher(h =>
        this.postsRaw
            .get(h)
            .sort(() => Math.random() - 0.5) // Shitty randomization, to see some different users
            .map(({id}) => Post.get(id))
    );
    public getPosts = (h?: IDataHook) => this.posts.get(h);

    protected commentsRaw = new DataFetcher("comments", [] as typeof initComment[]);
    protected comments = new DataCacher(h =>
        this.commentsRaw.get(h).map(({id}) => Comment.get(id))
    );
    public getComments = (h?: IDataHook) => this.comments.get(h);

    protected selectedUser = new Field(null as null | User);
    public selectUser = (user: User | null) => this.selectedUser.set(user);
    public getSelectedUser = (h?: IDataHook) => this.selectedUser.get(h);
}

/*************************
 *  App visualization    *
 *************************/
const PostView: FC<{post: Post; onClickAuthor: (author: User) => void}> = ({
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

const CommentView: FC<{comment: Comment}> = ({comment}) => (
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

const AppView: FC<{app: App}> = ({app}) => {
    const [limit, setLimit] = useState(3);

    const [h, c] = useDataHook();
    const posts = app.getPosts(h);
    const selectedUser = app.getSelectedUser(h);
    const selectUser = useCallback((user: User | null) => app.selectUser(user), [app]);

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
