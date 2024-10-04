'use server';
import Classroom from '@/models/classroom';
import User from '@/models/user';

import { connectToDB } from '../../lib/database';

export const createClassroom = async ({ ownerId, name }) => {
  let success = false;
  let code = generateClassroomCode();

  while (!success) {
    try {
      await connectToDB();

      const user = await User.findById(ownerId);
      if (user.role !== 'teacher') {
        throw new Error('User must be a teacher to create a classroom');
      }

      const newClassroom = new Classroom({ owner: user, name, code });
      await newClassroom.save();

      console.log(newClassroom._id);

      user.classrooms.push(newClassroom._id);
      await user.save();

      console.log('Classroom created');

      success = true;
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.code) {
        // Duplicate key error for the "code" field, regenerate and retry
        code = generateClassroomCode();
      } else {
        console.log(error); // Handle other errors
      }
    }
  }
};

function generateClassroomCode() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

export const getClassrooms = async () => {
  try {
    await connectToDB();

    let classrooms = await Classroom.find({})
      .populate('owner')
      .populate({
        path: 'studentsEnrolled', // Populate the studentsEnrolled array
        select: 'email', // Select only the email field
        model: 'User', // Ensure this matches the User model name
      })
      .exec();

    console.log(classrooms);
    return JSON.stringify(classrooms);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const joinClassroom = async (studentId, classroomId) => {
  try {
    await connectToDB();

    const student = await User.findById(studentId);
    if (student.role !== 'student') {
      throw new Error('Only students can join a classroom');
    }

    const classroom = await Classroom.findById(classroomId);

    // Check if student is already enrolled in the classroom
    if (classroom.studentsEnrolled.includes(student._id)) {
      throw new Error('Student is already enrolled in this classroom');
    }

    // Check if classroom is already joined by the student
    if (student.joinedClassrooms.includes(classroom._id)) {
      throw new Error('Student has already joined this classroom');
    }

    classroom.studentsEnrolled.push(student._id);

    student.joinedClassrooms.push(classroom._id);

    await classroom.save();
    await student.save();

    console.log(student.email + ' enrolled in classroom ' + classroom.name);
  } catch (error) {
    console.log(error);
  }
};
