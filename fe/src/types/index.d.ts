export interface Subject {
  _id: string;
  name: string;
  code: string;
  tuitionFee: number,
  description: string;
  credits: number;
  majorId: any;
  prerequisite: string[];
}

