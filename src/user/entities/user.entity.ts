import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  phoneNumber: string

  @Column()
  walletAddress: string

  @Column()
  encryptedPrivateKey: string

  @Column({ nullable: true })
  referralCode?: string

  @Column({ nullable: true })
  recommenderCode?: string

  @CreateDateColumn()
  createdAt: Date
}
