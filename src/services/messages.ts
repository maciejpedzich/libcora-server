import { NextFunction, Response } from 'express';
import { getRepository } from 'typeorm';

import RequestWithUser from '../types/request-with-user';
import Message from '../models/message';
import User from '../models/user';
import UnauthorisedError from '../errors/unauthorised';

export default class MessagesService {
  public async getMessages(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const messageRepository = getRepository(Message);
    const currentUser = req.user as User;

    try {
      const PAGE_SIZE = 15;
      const offset = req.query.page ? +req.query.page * PAGE_SIZE : 0;

      const [messages, numAllMessages] = await messageRepository.findAndCount({
        where: [
          { authorId: currentUser.id, recipientId: req.params.recipientId },
          { authorId: req.params.recipientId, recipientId: currentUser.id }
        ],
        take: PAGE_SIZE,
        skip: offset,
        order: {
          dateCreated: 'DESC'
        }
      });
      const numPages = Math.floor(numAllMessages / PAGE_SIZE);

      messages.reverse();

      return res.status(200).json({ messages, numPages });
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
    const currentUser = req.user as User;

    try {
      const messageToRemove = await messageRepository.findOneOrFail(
        req.params.messageId
      );

      if (messageToRemove.authorId === currentUser.id) {
        await messageRepository.softRemove([messageToRemove]);
        return res.sendStatus(204);
      }

      throw new UnauthorisedError();
    } catch (error) {
      return next(error);
    }
  }
}
