import { Router } from 'express';
import MessagesService from '@/services/messages';

const messagesRouter = Router();
const messagesService = new MessagesService();

messagesRouter.get('/:recipientId', messagesService.getMessages);

messagesRouter.post('/:recipientId', messagesService.createMessage);

messagesRouter.delete('/:messageId/remove', messagesService.removeMessage);

export default messagesRouter;
