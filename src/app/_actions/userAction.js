'use server';
import bcrypt from 'bcrypt';

import { newPost } from '../_actions/postAction';
import { connectToDB } from '../../lib/database';
import Student from '../../models/student';
import Teacher from '../../models/teacher';
import User from '../../models/user';

export async function getUsers() {
  try {
    await connectToDB();

    const users = await User.find({});

    return JSON.stringify(users);
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getUser(email) {
  try {
    await connectToDB();

    const user = await User.find({ email: email });

    return user[0];
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getTeachers() {
  try {
    await connectToDB();

    const teachers = await Teacher.find({ role: 'teacher' });

    return JSON.stringify(teachers);
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getStudents() {
  try {
    await connectToDB();

    const students = await Student.find({ role: 'student' });

    return JSON.stringify(students);
  } catch (error) {
    console.log(error);
    return [];
  }
}

// CREATE NEW USER
export async function newUser(data) {
  const { email, password, role } = data;
  try {
    await connectToDB();

    const existingUsers = await User.find({ email: email });
    if (existingUsers[0]) {
      throw Error('User with email ' + email + ' already exists');
    }

    let newUser;
    if (role === 'teacher') {
      newUser = new Teacher({
        email,
        password,
      });
    } else if (role === 'student') {
      newUser = new Student({
        email,
        password,
      });
    } else {
      throw Error('Invalid role');
    }

    await newUser.save();

    console.log('User created successfully');
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(data) {
  try {
    await connectToDB();

    const user = await User.find({ email: data.email });

    // update user data

    user.save();

    console.log('User updated successfully');
  } catch (error) {
    console.log(error);
  }
}

export async function changePassword(uid, formData) {
  const { oldPassword, newPassword, confirmPassword } = formData;
  try {
    await connectToDB();

    const user = await User.findById(uid);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (isMatch) {
      user.password = newPassword;
      await user.save();
      console.log('new password set');
    } else {
      throw Error('old password does not match');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function addFollow(followerId, toFollowId) {
  if (followerId === toFollowId) {
    console.log('user cannot follow themself');
    return;
  }
  try {
    await connectToDB();

    const user = await User.findById(followerId);
    const toFollowUser = await User.findById(toFollowId);
    if (user.following.includes(toFollowId)) {
      console.log('user is already following ' + toFollowUser.email);
      return;
    }

    user.following.push(toFollowId);
    user.save();

    toFollowUser.followers.push(followerId);
    toFollowUser.save();

    console.log(user.email + ' followed ' + toFollowUser.email);
  } catch (error) {
    console.log(error);
  }
}

export async function addPost(userId, postData) {
  try {
    await connectToDB();

    const post = await newPost(postData);

    const user = await User.findById(userId);
    user.posts.push(post._id);
    await user.save();

    console.log('post added to user');
  } catch (error) {
    console.log(error);
  }
}
