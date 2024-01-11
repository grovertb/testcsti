import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Exchange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column('float')
  rate: number;
}
