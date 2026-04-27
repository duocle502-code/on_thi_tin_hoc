import { Subject, Question } from './types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'mos-word',
    name: 'MOS Word 2019',
    icon: 'FileText',
    questionsCount: 15,
    description: 'Kỹ năng soạn thảo văn bản chuyên nghiệp theo chuẩn Microsoft.'
  },
  {
    id: 'mos-excel',
    name: 'MOS Excel 2019',
    icon: 'Grid',
    questionsCount: 15,
    description: 'Phân tích dữ liệu và quản lý bảng tính hiệu quả.'
  },
  {
    id: 'ic3-gs6',
    name: 'IC3 GS6 Level 1',
    icon: 'Monitor',
    questionsCount: 10,
    description: 'Kiến thức cơ bản về phần cứng, phần mềm và mạng máy tính.'
  }
];

export const SAMPLE_QUESTIONS: Question[] = [
  // MOS Word
  {
    id: 'w1',
    subjectId: 'mos-word',
    content: 'Để chèn một bảng mục lục tự động trong Word, bạn nên sử dụng tab nào?',
    type: 'multiple-choice',
    options: ['Home', 'Insert', 'References', 'Layout'],
    correctAnswer: 2,
    explanation: 'Tab References chứa nhóm Table of Contents để tạo mục lục tự động dựa trên các Heading.',
    difficulty: 'medium'
  },
  {
    id: 'w2',
    subjectId: 'mos-word',
    content: 'Phím tắt nào dùng để kiểm tra lỗi chính tả và ngữ pháp?',
    type: 'multiple-choice',
    options: ['F1', 'F5', 'F7', 'F12'],
    correctAnswer: 2,
    explanation: 'F7 là phím tắt tiêu chuẩn để mở trình kiểm tra Spelling & Grammar.',
    difficulty: 'easy'
  },
  // MOS Excel
  {
    id: 'e1',
    subjectId: 'mos-excel',
    content: 'Hàm nào dùng để đếm các ô không trống trong một phạm vi?',
    type: 'multiple-choice',
    options: ['COUNT', 'COUNTA', 'COUNTBLANK', 'COUNTIF'],
    correctAnswer: 1,
    explanation: 'COUNTA đếm tất cả các ô có chứa dữ liệu (số, văn bản, lỗi...).',
    difficulty: 'medium'
  },
  {
    id: 'e2',
    subjectId: 'mos-excel',
    content: 'Để cố định một ô trong công thức (tạo tham chiếu tuyệt đối), bạn sử dụng ký tự nào?',
    type: 'multiple-choice',
    options: ['%', '&', '$', '#'],
    correctAnswer: 2,
    explanation: 'Ký tự $ được dùng để cố định hàng hoặc cột (ví dụ: $A$1).',
    difficulty: 'easy'
  },
  // IC3
  {
    id: 'i1',
    subjectId: 'ic3-gs6',
    content: 'Thiết bị nào sau đây được coi là "bộ não" của máy tính?',
    type: 'multiple-choice',
    options: ['RAM', 'HDD', 'CPU', 'GPU'],
    correctAnswer: 2,
    explanation: 'CPU (Central Processing Unit) thực hiện hầu hết các phép tính và điều khiển máy tính.',
    difficulty: 'easy'
  }
];
