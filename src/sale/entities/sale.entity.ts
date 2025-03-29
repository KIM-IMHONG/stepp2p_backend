import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  saleId: number

  @Column()
  seller: string

  @Column()
  totalAmount: string

  @Column()
  remaining: string

  @Column({ type: 'enum', enum: ['active', 'cancelled', 'ended'] })
  status: 'active' | 'cancelled' | 'ended'

  @Column()
  txHash: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
