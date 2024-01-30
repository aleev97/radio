import { Request, Response } from 'express';
import pool from '../db';

const handleServerError = (res: Response<any, Record<string, any>>, error: unknown) => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
};

const CommentController = {
    addComment: async (req: Request, res: Response) => {
        try {
            const { publication_id, user_id, parent_comment_id, content } = req.body;

            if (!publication_id || !user_id || !content) {
                return res.status(400).json({ error: 'Invalid data. Make sure publication_id, user_id, and content are provided.' });
            }

            const result = await pool.query(
                'INSERT INTO comments(publication_id, user_id, parent_comment_id, content) VALUES($1, $2, $3, $4) RETURNING *',
                [publication_id, user_id, parent_comment_id, content]
            );

            res.json(result.rows[0]);
        } catch (error) {
            handleServerError(res, error);
        }
    },

    getCommentsForPublication: async (req: Request, res: Response) => {
        try {
            const publicationId = parseInt(req.params.publication_id, 10);

            const result = await pool.query(
                'SELECT * FROM comments WHERE publication_id = $1',
                [publicationId]
            );

            res.json(result.rows);
        } catch (error) {
            handleServerError(res, error);
        }
    },

    editComment: async (req: Request, res: Response) => {
        try {
            const commentId = parseInt(req.params.id, 10);
            const { content } = req.body;

            const existingComment = await pool.query(
                'SELECT * FROM comments WHERE id = $1',
                [commentId]
            );

            if (existingComment.rows.length === 0) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            const result = await pool.query(
                'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *',
                [content, commentId]
            );

            res.json(result.rows[0]);
        } catch (error) {
            handleServerError(res, error);
        }
    },

    deleteComment: async (req: Request, res: Response) => {
        try {
            const commentId = parseInt(req.params.id, 10);

            const result = await pool.query(
                'DELETE FROM comments WHERE id = $1 RETURNING *',
                [commentId]
            );

            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Comment not found' });
            } else {
                res.json({ message: 'Comment deleted successfully', deletedComment: result.rows[0] });
            }
        } catch (error) {
            handleServerError(res, error);
        }
    },
};

export default CommentController;