import { Entity, Unique, Column, ManyToMany, JoinTable } from 'typeorm';
import { Geometry } from 'geojson';
import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsInt,
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

  @Column('text')
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Column('text')
  @IsDefined()
  @IsNotEmpty()
  password!: string;

  @Column('date')
  dob!: Date;

  @Column('point')
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  location!: Geometry;

  @Column('int', { default: 1000 })
  @IsInt()
  rating!: number;

  @Column('array')
  @IsString({ each: true })
  favouriteGenres!: string[];

  @ManyToMany(() => User)
  @JoinTable()
  favouritedUsers!: User[];

  @ManyToMany(() => User)
  @JoinTable()
  ignoredUsers!: User[];
}
