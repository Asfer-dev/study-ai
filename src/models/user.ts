import bcrypt from 'bcrypt';
import { model, models,Schema } from 'mongoose';

import { IUser } from '@/types/db';

const options = { discriminatorKey: 'role', collection: 'users' };

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
    },
    image: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    followers: {
      type: [Schema.Types.ObjectId],
      required: true,
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId],
      required: true,
      default: [],
    },
    posts: {
      type: [Schema.Types.ObjectId],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    ...options,
  }
);

// Pre-save hook to hash the password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    if (err instanceof Error) {
      next(err);
    }
  }
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;
