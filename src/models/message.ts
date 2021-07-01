import { Column, Entity, DeleteDateColumn } from 'typeorm';
import BaseModel from './base';

@Entity({ name: 'messages' })
export default class Message extends BaseModel {
  @Column('text', { nullable: true })
  content!: string | null;

  @Column('text')
  authorId!: string;

  @Column('text')
  recipientId!: string;
}
