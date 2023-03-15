import { isLoggedInAtom, testUserAtom, IUser } from '../atom';
import { useRecoilState } from 'recoil';
import { useState, useEffect } from 'react';

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState<boolean>(isLoggedInAtom);
  const [user, setUser] = useRecoilState<IUser>(testUserAtom);
  const [account, setAccount] = useState<IUser>(user);

  const { id, pwd, email, name } = account;

  const onToggle = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAccount({ ...account, [name]: value });
  };

  const onSubmit = () => {
    setUser(account);
  };

  useEffect(() => {
    console.log(account);
  }, [account]);

  useEffect(() => {
    console.log('store');
    console.log(user);
  }, [user]);

  return (
    <div>
      <div onClick={onToggle}>여기는 토글</div>
      {isLoggedIn ? <p>로그인 되었습니다.</p> : <p>로그인이 필요합니다.</p>}
      <p>id : {user.id}</p>
      <p>pwd : {user.pwd}</p>
      <p>name : {user.name}</p>
      <p>email : {user.email}</p>
      <div> 회원 정보 수정을 원하면 입력 후 엔터를 쳐주세요.</div>
      <p>
        Id :{' '}
        <input
          type="text"
          placeholder={'id'}
          name="id"
          value={id}
          onChange={onChange}
        />
      </p>
      <p>
        pwd :{' '}
        <input
          type="text"
          placeholder={'pwd'}
          name="pwd"
          value={pwd}
          onChange={onChange}
        />
      </p>
      <p>
        name:{' '}
        <input
          type="text"
          placeholder={'name'}
          name="name"
          value={name}
          onChange={onChange}
        />
      </p>
      <p>
        email:
        <input
          type="text"
          placeholder="email"
          name="email"
          value={email}
          onChange={onChange}
        />
      </p>
      <button onClick={onSubmit}>변경하기</button>
    </div>
  );
}
