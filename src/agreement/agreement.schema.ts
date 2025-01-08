import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Agreement{
  @Prop({ required: true })
  Description: string

  @Prop({required:true})
  Title: string
}