import {
  Entity,
  Unique,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert
} from 'typeorm';
import { Geometry } from 'geojson';

import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsLatLong,
  IsDateString,
  IsString
} from 'class-validator';

import BaseModel from './base';

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
  password?: string;

  @Column('text')
  @IsNotEmpty()
  @MaxLength(300)
  bio!: string;

  @Column('date')
  @IsDateString({ strict: false })
  dob!: Date;

  @Column('point')
  @IsLatLong()
  location!: Geometry;

  @Column('int', { default: 1000 })
  rating!: number;

  @Column('simple-array')
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
