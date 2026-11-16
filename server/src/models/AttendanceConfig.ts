import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceConfig extends Document {
  key: string;
  officeName: string;
  officeLat: number;
  officeLng: number;
  maxDistanceMeters: number;
  allowedIps: string[];
  office2Name?: string;
  office2Lat?: number;
  office2Lng?: number;
  allowedIps2?: string[];
  office1Domain?: string;
  office2Domain?: string;
  requireGps: boolean;
  requireIp: boolean;
  handoverWeeklySchedule?: Record<string, string[]>;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceConfigSchema = new Schema<IAttendanceConfig>(
  {
    key: { type: String, required: true, unique: true, default: 'DEFAULT' },
    officeName: {
      type: String,
      required: true,
      default: 'Cơ sở 1: Showroom 11Sport - 24 Tố Hữu, Hoà Cường, Đà Nẵng',
    },
    officeLat: { type: Number, required: true, default: 16.0352 },
    officeLng: { type: Number, required: true, default: 108.2185 },
    maxDistanceMeters: { type: Number, required: true, default: 50 },
    allowedIps: {
      type: [String],
      default: ['127.0.0.1', '::1', 'localhost'],
    },
    office2Name: {
      type: String,
      default: 'Cơ sở 2: Văn phòng 11Sport - 89 Lê Thanh Nghị, Hòa Cường, Đà Nẵng',
    },
    office2Lat: { type: Number, default: 16.0678 },
    office2Lng: { type: Number, default: 108.2208 },
    allowedIps2: {
      type: [String],
      default: [],
    },
    office1Domain: { type: String, default: '' },
    office2Domain: { type: String, default: '' },
    requireGps: { type: Boolean, default: false },
    requireIp: { type: Boolean, default: true },
    handoverWeeklySchedule: { type: Schema.Types.Mixed, default: {} },
    updatedBy: { type: String, default: '' },
  },
  { timestamps: true }
);

export const AttendanceConfigModel =
  mongoose.models.AttendanceConfig ||
  mongoose.model<IAttendanceConfig>('AttendanceConfig', AttendanceConfigSchema);
