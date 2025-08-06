
import { Student, ExamGrade, Course } from './types';

interface ProcessedCourse {
  name: string;
  credits: number;
  grades: { [key in ExamGrade['examType']]?: number };
  average: number;
  result: 'Validé' | 'Rattrapage';
}

export interface ProcessedStudent {
  id: string;
  name: string;
  department: string;
  level: string;
  courses: ProcessedCourse[];
  totalCredits: number;
  gpa: number;
  finalDecision: {
    text: 'Validé' | 'Validé avec dette' | 'Rattrapage';
    icon: '✅' | '⚠️' | '❌';
  };
}

export interface GroupedResults {
  [groupKey: string]: ProcessedStudent[];
}

export function processStudentResults(
  students: Student[],
  grades: ExamGrade[],
  courses: Course[]
): ProcessedStudent[] {
  return students.map(student => {
    const studentGrades = grades.filter(g => g.studentId === student.id);
    const studentCourses: { [courseName: string]: { grades: ExamGrade[], courseInfo?: Course } } = {};

    studentGrades.forEach(grade => {
      if (!studentCourses[grade.courseName]) {
        studentCourses[grade.courseName] = { 
            grades: [], 
            courseInfo: courses.find(c => c.code === grade.courseCode) 
        };
      }
      studentCourses[grade.courseName].grades.push(grade);
    });

    const processedCourses: ProcessedCourse[] = Object.entries(studentCourses).map(([courseName, data]) => {
      const { grades: courseGrades, courseInfo } = data;
      const gradesByType: { [key in ExamGrade['examType']]?: number } = {};
      courseGrades.forEach(g => {
        gradesByType[g.examType] = g.grade;
      });

      const gradeValues = Object.values(gradesByType).filter(g => g !== undefined) as number[];
      const average = gradeValues.length > 0 ? gradeValues.reduce((sum, g) => sum + g, 0) / gradeValues.length : 0;
      
      const result: 'Validé' | 'Rattrapage' = average >= 10 ? 'Validé' : 'Rattrapage';

      return {
        name: courseName,
        credits: courseInfo?.credits || 0,
        grades: gradesByType,
        average,
        result,
      };
    });

    let totalCredits = 0;
    let weightedGpaSum = 0;
    let hasDebt = false;

    processedCourses.forEach(course => {
      totalCredits += course.credits;
      weightedGpaSum += course.average * course.credits;
      if (course.result === 'Rattrapage') {
        hasDebt = true;
      }
    });

    const gpa = totalCredits > 0 ? weightedGpaSum / totalCredits : 0;
    
    let finalDecision: ProcessedStudent['finalDecision'];
    if (gpa < 10) {
      finalDecision = { text: 'Rattrapage', icon: '❌' };
    } else {
      if (hasDebt) {
        finalDecision = { text: 'Validé avec dette', icon: '⚠️' };
      } else {
        finalDecision = { text: 'Validé', icon: '✅' };
      }
    }
    
    // Find student level from courses, assuming it's consistent
    const studentLevel = courses.find(c => processedCourses.some(pc => pc.name === c.name))?.level || `Année ${student.year}`;


    return {
      id: student.id,
      name: student.name,
      department: student.department,
      level: studentLevel,
      courses: processedCourses,
      totalCredits,
      gpa,
      finalDecision,
    };
  });
}
