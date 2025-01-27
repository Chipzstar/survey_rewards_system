import { Submission } from '~/app/api/webhook/fillout/types';

export const getUserDetails = (form: Submission) => {
  let email, name;
  email = form.questions.find(q => q.id === '75vZ')?.value;
  if (!email) email = '';
  name = form.questions.find(q => q.id === 'dpQC')?.value;
  if (!name) name = '';
  return { email: String(email), name: String(name) };
};
