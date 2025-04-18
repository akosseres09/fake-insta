import { Request, Response, Router } from 'express';
import { User } from '../model/User';
import { Post } from '../model/Post';
import upload from '../middlewares/multer';

export const postRoutes = (): Router => {
    const router: Router = Router();
    router.get('/post', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        try {
            const user = await User.findById(req.user);
            if (!user) {
                res.status(404).send({
                    success: false,
                    result: 'User not found',
                });
                return;
            }
            const following = user.following;
            if (following.length === 0) {
                following.push(user.id);
            }

            const posts = await Post.find({ userId: { $in: following } })
                .sort({ createdAt: -1 })
                .populate('userId', ['username', 'profilePictureUrl']);

            if (posts) {
                res.status(200).send({
                    success: true,
                    result: posts,
                });
            } else {
                res.status(404).send({
                    success: false,
                    result: null,
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                result: 'Internal server error',
            });
        }
    });

    router.post(
        '/post',
        upload.single('media'),
        async (req: Request, res: Response) => {
            try {
                const { caption, altText, userId } = req.body;
                if (!req.file || !req.file.path) {
                    res.status(400).send('No file uploaded');
                    return;
                }

                const newPost = new Post({
                    userId: userId,
                    caption: caption,
                    altText: altText,
                    mediaUrl: req.file.path,
                    mediaType: req.file.mimetype.startsWith('video')
                        ? 'video'
                        : 'image',
                    likes: [],
                    comments: [],
                });

                const response = await newPost.save();

                if (response) {
                    res.status(200).send({
                        success: true,
                        result: newPost,
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        result: 'Error creating post',
                    });
                }
            } catch (error) {
                res.status(500).send({
                    success: false,
                    result: 'Internal server error',
                });
            }
        }
    );

    return router;
};
