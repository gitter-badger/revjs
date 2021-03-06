import {
    ModelManager, InMemoryBackend,
    IntegerField, TextField, BooleanField, DateTimeField,
    RelatedModel, RelatedModelList, AutoNumberField
} from 'rev-models';

export class User {
    @AutoNumberField({ primaryKey: true })
        id: number;
    @TextField()
        name: string;
    @RelatedModelList({ model: 'Post', field: 'user' })
        posts: Post[];

    constructor(data?: Partial<User>) {
        Object.assign(this, data);
    }
}

export class Post {
    @AutoNumberField({ primaryKey: true })
        id: number;
    @TextField()
        title: string;
    @TextField()
        body: string;
    @BooleanField({ required: false })
        published: boolean;
    @DateTimeField({ required: false })
        post_date: string;
    @RelatedModel({ model: 'User', required: false })
        user: User;
    @RelatedModelList({ model: 'Comment', field: 'post' })
        comments: Comment[];

    constructor(data?: Partial<Post>) {
        Object.assign(this, data);
    }
}

export class Comment {
    @IntegerField({ primaryKey: true })
        id: number;
    @RelatedModel({ model: 'Post' })
        post: Post;
    @TextField()
        comment: string;
    @RelatedModel({ model: 'User' })
        user: User;

    constructor(data?: Partial<Comment>) {
        Object.assign(this, data);
    }
}

export function getModelManager() {
    const modelManager = new ModelManager();
    modelManager.registerBackend('default', new InMemoryBackend());
    modelManager.register(User);
    modelManager.register(Post);
    modelManager.register(Comment);
    return modelManager;
}
