import { useRecoilValue } from 'recoil';
import { isLoggedInAtom } from '../atom';
export default function Board() {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  return (
    <div>{isLoggedIn ? '로그인 되었습니다.' : '로그인이 필요합니다.'}</div>
  );
}
