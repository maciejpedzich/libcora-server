import Message from '@/models/message';
import User from '@/models/user';
import RequestWithUser from '@/types/request-with-user';
import { NextFunction, Response } from 'express';
import { getRepository } from 'typeorm';

export default class MessagesService {
  public async getMessages(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const messageRepository = getRepository(Message);
    const currentUser = req.user as User;

    try {
      const take = req.query.take ? +req.query.take : 15;
      const skip = req.query.page ? +req.query.page * take : 0;

      const messages = await messageRepository.find({
        where: [
          { authorId: currentUser.id, recipientId: req.params.contactId },
          { authorId: req.params.contactId, recipientId: currentUser.id }
        ],
        take,
        skip,
        withDeleted: true
      });

      return res.status(200).json(messages);
    } catch (error) {
      return next(error);
    }
  }

  public async createMessage(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const userRepository = getRepository(User);
    const messageRepository = getRepository(Message);
    const currentUser = req.user as User;

    try {
      const recipient = await userRepository.findOneOrFail(
        req.params.recipientId
      );

      const message = messageRepository.create(req.body) as unknown as Message;
      message.authorId = currentUser.id;
      message.recipientId = recipient.id;

      return res.status(201).json(await messageRepository.save(message));
    } catch (error) {
      return next(error);
    }
  }

  public async removeMessage(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const messageRepository = getRepository(Message);

    try {
      await messageRepository.update(req.params.messageId, { content: null });
      await messageRepository.softDelete(req.params.messageId);

      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }
}
