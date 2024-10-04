'use client';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';

import {
  createClassroom,
  getClassrooms,
  joinClassroom,
} from '@/app/_actions/classroomAction';

const ClassroomsPage = () => {
  const { data: session } = useSession();
  const [classroomName, setClassroomName] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    // Fetch classrooms only if session is available and user ID is present
    async function fetchclassrooms() {
      try {
        const fetchedclassrooms = JSON.parse(await getClassrooms());
        // console.log(fetchedclassrooms);

        setClassrooms(fetchedclassrooms);
      } catch (error) {
        console.error('Failed to fetch classrooms:', error);
      }
    }
    // if (session && session.user && session.user._id) {
    // }
    fetchclassrooms();
  }, []);

  const handleSubmit = async () => {
    createClassroom({ ownerId: session?.user?._id, name: classroomName });
  };

  // Reference to the dialog element
  const dialogRef = useRef(null);

  // Open the dialog
  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal(); // Opens the dialog
    }
  };

  // Close the dialog
  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close(); // Closes the dialog
    }
  };

  if (session) {
    return (
      <div>
        <h2>Classrooms</h2>
        {session?.user?.role === 'teacher' && (
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              name='name'
              placeholder='Classroom Name'
              onChange={(e) => setClassroomName(e.target.value)}
            />
            <button type='submit'>Create Classroom</button>
          </form>
        )}
        <div>
          {classrooms?.map((classroom) => (
            <div className='flex justify-between'>
              <p key={classroom._id}>{classroom.name}</p>
              <p key={classroom._id}>{classroom.owner?.email}</p>
              <p key={classroom._id}>{classroom.code}</p>
              {/* Button to open the dialog */}
              <button
                onClick={() => {
                  openDialog();
                }}
              >
                Enrolled Students
              </button>
              <div>
                {/* The dialog element */}
                <dialog ref={dialogRef}>
                  <h2>Enrolled Students List</h2>
                  <ul>
                    {classroom.studentsEnrolled?.map((stu) => (
                      <li key={stu.email}>{stu.email}</li>
                    ))}
                  </ul>
                  <button onClick={closeDialog}>Close</button>
                </dialog>
              </div>
              {session?.user?.role === 'student' && (
                <button
                  onClick={() =>
                    joinClassroom(session?.user?._id, classroom._id)
                  }
                >
                  Join
                </button>
              )}
            </div>
          ))}
          {classrooms?.length == 0 && <div>No Classrooms found</div>}
        </div>
      </div>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default ClassroomsPage;
