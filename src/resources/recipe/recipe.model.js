import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    time: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    convenience: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    style: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    notes: String,
    score: Number,
    description: String,
    prepTimeMinutes: Number,
    cookTimeMinutes: Number,
    ingredientList: Array
  },
  { timestamps: true }
);

recipeSchema.index({ title: 1 }, { unique: true });

export const Recipe = mongoose.model("recipe", recipeSchema);
