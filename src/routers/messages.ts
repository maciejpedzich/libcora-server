import { Router } from 'express';
import MessagesService from '../services/messages';
import authMiddleware from '../middleware/auth';

const messagesRouter = Router();
const messagesService = new MessagesService();

messagesRouter.use(authMiddleware);

messagesRouter.get('/to/:recipientId', messagesService.getMessages);

messagesRouter.post('/to/:recipientId', messagesService.createMessage);

messagesRouter.delete('/:messageId/remove', messagesService.removeMessage);

export default messagesRouter;
