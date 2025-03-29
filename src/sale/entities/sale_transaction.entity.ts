import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Sale } from './sale.entity'

@Entity()
export class SaleTransaction {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Sale)
  @JoinColumn({ name: 'saleId' })
  sale: Sale

  @Column()
  saleId: number

  @Column()
  buyer: string

  @Column()
  amount: string

  @Column()
  txHash: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
