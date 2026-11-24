import mongoose, { Schema, models } from "mongoose";
const ResetTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const PasswordResetToken = models.PasswordResetToken || mongoose.model("PasswordResetToken", ResetTokenSchema);

export default PasswordResetToken;
