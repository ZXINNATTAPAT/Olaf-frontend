import { useNavigate } from "react-router-dom";

export function useRedirect() {
  const navigate = useNavigate();

  const redirect = (id, title = "") => {
    let target = String(id);
    if (title) {
      const slug = title
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\u0E00-\u0E7F-]+/g, "") // Remove special chars (keep Thai & English)
        .replace(/-+/g, "-") // Remove multiple -
        .toLowerCase();

      if (slug) {
        target = `${id}-${slug}`;
      }
    }
    navigate(`/vFeed/${target}`);
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
