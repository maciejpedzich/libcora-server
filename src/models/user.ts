import {
  Entity,
  Unique,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert
} from 'typeorm';

import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsLatLong,
  ArrayNotEmpty,
  IsDateString,
  IsString
} from 'class-validator';

import BaseModel from './base';
import LocationObject from '@/types/location-object';

@Entity({ name: 'users' })
@Unique(['email'])
export default class User extends BaseModel {
  @Column('text')
  @IsNotEmpty()
  firstname!: string;

  @Column('text')
  @IsNotEmpty()
  lastname!: string;

  @Column('text', { select: false })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @Column('text', { select: false })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password?: string;

  @Column('text')
  avatarUrl!: string;

  @Column('text')
  @IsNotEmpty()
  @MaxLength(300)
  bio!: string;

  @Column('date')
  @IsDateString({ strict: false })
  dob!: Date;

  @Column('point')
  @IsLatLong()
  location!: string | LocationObject;

  @Column('float', { default: 1000 })
  rating!: number;

  @Column('text', { array: true })
  @ArrayNotEmpty()
  @IsString({ each: true })
  favouriteGenres!: string[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  favouritedUsers!: User[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  ignoredUsers!: User[];

  @BeforeInsert()
  setBaseRating() {
    this.rating = 1000;
  }
}
