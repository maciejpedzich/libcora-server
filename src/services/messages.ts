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
      const take = req.query.pageSize ? +req.query.pageSize : 15;
      const skip = req.query.currentPage ? +req.query.currentPage * take : 0;

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
