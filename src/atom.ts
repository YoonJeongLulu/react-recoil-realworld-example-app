import { atom } from 'recoil';

export const isLoggedInAtom = atom<boolean>({
  key: 'isLoggedInAtom',
  default: false,
});

export interface IUser {
  id: string;
  pwd: string;
  email: string;
  name: string;
}

export const testUserAtom = atom({
  key: 'testUserAtom',
  default: {
    id: 'lulu',
    pwd: 'lulu123',
    email: 'abc@name.com',
    name: '윤정',
  },
});

export const userAtom = atom({
  key: 'userAtom',
  default: {
    email: '',
    username: '',
    bio: '',
    image: '',
  },
});

export const pageAtom = atom({
  key: 'pageAtom',
  default: 1,
});
