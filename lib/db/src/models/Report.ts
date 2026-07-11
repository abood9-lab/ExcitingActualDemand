import mongoose, { Schema, type Document } from "mongoose";

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  targetType: "user" | "post";
  targetUserId?: mongoose.Types.ObjectId;
  targetPostId?: mongoose.Types.ObjectId;
  reason: string;
  details?: string;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["user", "post"], required: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    targetPostId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    reason: { type: String, required: true },
    details: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Report = mongoose.models.Report ?? mongoose.model<IReport>("Report", ReportSchema);
