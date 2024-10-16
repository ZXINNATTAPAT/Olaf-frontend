import { useNavigate } from 'react-router-dom';

export function useRedirect() {
  const navigate = useNavigate();

  const redirect = (s) => {
    if (typeof s !== 'string') {
      throw new Error('Invalid input');
    }
    navigate(`/vFeed/${s}`);
  };

  return redirect;
}

// ใช้ในคอมโพเนนต์
// function SomeComponent() {
//   const redirect = useRedirect();

//   useEffect(() => {
//     redirect('123');  // เรียก redirect ด้วยค่า s ที่ต้องการ
//   }, []);

//   return <div>Redirecting...</div>;
// }
