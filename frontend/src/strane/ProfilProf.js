// TeacherProfile.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProfilProf() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // Fetch teacher profile
    axios.get(`/api/teachers/${teacherId}`)
      .then(response => setTeacher(response.data))
      .catch(error => console.error('Error fetching teacher profile:', error));

    // Fetch teacher schedule
    axios.get(`/api/teachers/${teacherId}/schedule`)
      .then(response => setSchedule(response.data))
      .catch(error => console.error('Error fetching teacher schedule:', error));
  }, [teacherId]);

  const handleScheduleClass = (timeSlot) => {
    axios.post(`/api/teachers/${teacherId}/schedule`, { timeSlot })
      .then(response => alert('Class scheduled successfully!'))
      .catch(error => console.error('Error scheduling class:', error));
  };

  return (
    <div>
      {teacher && (
        <div>
          <h2>{teacher.name}</h2>
          <p>{teacher.bio}</p>
          <table>
            <thead>
              <tr>
                <th>Ponedeljak</th>
                <th>Utorak</th>
                <th>Srijeda</th>
                <th>Četvrtak</th>
                <th>Petak</th>
                <th>Subota</th>
                <th>Nedelja</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((day, index) => (
                <tr key={index}>
                  {day.map((timeSlot, idx) => (
                    <td key={idx}>
                      {timeSlot.available ? (
                        <button onClick={() => handleScheduleClass(timeSlot.time)}>
                          {timeSlot.time}
                        </button>
                      ) : (
                        <span>{timeSlot.time}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProfilProf;
