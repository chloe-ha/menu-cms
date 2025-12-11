import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ _id: false })
export class TimeWindow {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;
}
const TimeWindowSchema = SchemaFactory.createForClass(TimeWindow);

@Schema({ _id: false })
export class OpeningDay {
  @Prop({ required: true })
  day: string;

  @Prop({ required: true })
  open: boolean;

  @Prop({ type: [TimeWindowSchema], default: [] })
  windows: TimeWindow[];
}
const OpeningDaySchema = SchemaFactory.createForClass(OpeningDay);

@Schema({ timestamps: true })
export class Restaurant {
  @Prop()
  name: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  description: string;

  @Prop()
  address: string;

  @Prop({ type: [OpeningDaySchema], default: [] })
  openingHours: OpeningDay[];

  @Prop()
  phoneNumber: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
