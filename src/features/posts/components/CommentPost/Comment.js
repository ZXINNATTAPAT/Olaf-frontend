import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import useAuth from "../../../../shared/hooks/useAuth";
import Likecomment from "../Likecomment/Likecomment";
const baseUrl = process.env.REACT_APP_BASE_URL || 'https://olaf-backend.onrender.com/api';

export default function Comment({ post_id, onCommentsCountChange }) {
  let sliderRef = useRef(null);
  const [comments, setComments] = useState([]); // ตั้งค่าเริ่มต้นเป็น []
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState(""); // state สำหรับจัดเก็บคอมเมนต์ใหม่
  const [error, setError] = useState(null); // สำหรับเก็บ error ถ้ามี
  const [likesCount, setLikesCount] = useState(0);
  const { user } = useAuth();

  onCommentsCountChange(comments.length);

  const handleLikesCountChange = (comment_id, count) => {
    setLikesCount(prev => ({ ...prev, [comment_id]: count }));
  };  

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "none", background: "whitesmoke" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "none", background: "whitesmoke" }}
        onClick={onClick}
      />
    );
  }

  // const next = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.slickNext(); // เรียก slickNext() ผ่าน ref
  //   }
  // };

  // const previous = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.slickPrev(); // เรียก slickPrev() ผ่าน ref
  //   }
  // };

  const settings = {
    dots: true,
    infinite: comments.length > 3, // หากจำนวน comment มากกว่า 3 จะวนลูปได้
    speed: 500,
    slidesToShow: 3, // โชว์สูงสุด 3 card
    slidesToScroll: 1,
    // responsive: [
    //   {
    //     breakpoint: 768, // เมื่อหน้าจอมีความกว้างต่ำกว่า 768px จะโชว์ 1 card
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //     }
    //   },
    //   {
    //     breakpoint: 1024, // เมื่อหน้าจอมีความกว้างต่ำกว่า 1024px จะโชว์ 2 card
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 1,
    //     }
    //   }
    // ]

    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${baseUrl}/comments/`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          const filteredComments = data.filter(
            (comment) => comment.post === post_id
          );
          setComments(filteredComments);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [post_id]); // ทำการดึงข้อมูลเมื่อ post_id เปลี่ยนแปลง

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          post: post_id,
          user: user.id, // ใช้ user id ของผู้ใช้ปัจจุบัน
          comment_datetime: new Date().toISOString(), // กำหนดเวลาปัจจุบัน
          comment_text: newComment, // คอมเมนต์ที่ผู้ใช้กรอก
          like_count: 0, // จำนวน like เริ่มต้นเป็น 0
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data]); // เพิ่มคอมเมนต์ใหม่เข้าไปในรายการคอมเมนต์
        setNewComment(""); // ล้างฟอร์มหลังจากเพิ่มคอมเมนต์สำเร็จ
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to add comment");
    }
  };

  if (loading) {
    return <p>Loading comments...</p>;
  }

  // console.log(comments);

  return (
    <div>
      <h3 className="m-2">Comments</h3>
      <div className="row">
        {comments.length > 0 ? (
          <>
            <Slider ref={sliderRef} {...settings}>
              {comments.map((comment) => (
                <div key={comment.post_id}>
                  <div
                    className="card m-2 shadow-sm"
                    style={{ border: "none" }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <p style={{ fontSize: "16px", marginBottom: "0" }}>
                          {comment.comment_text}
                        </p>
                        <Likecomment
                          post_id={post_id}
                          comment_id={comment.comment_id}
                          onLikesCountChange={(count) => handleLikesCountChange(comment.comment_id, count)}
                        />
                        <p style={{ fontSize: "12px", marginBottom: "0" }}>{likesCount[comment.comment_id] || 0}</p>
                      </div>
                      <small style={{ fontSize: "12px" }}>
                        {new Date(comment.comment_datetime).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
            <br />
          </>
        ) : (
          <p>No comments available</p>
        )}
      </div>
      <br />

      {/* <div style={{ textAlign: "center" }}>
          <button className="btn btn-dark" onClick={previous}>
            Previous
          </button>
          <button className="btn btn-dark" onClick={next}>
            Next
          </button>
    </div> */}

      {/* แบบฟอร์มสำหรับเพิ่มคอมเมนต์ใหม่ */}
      <div className="m-2">
        <form onSubmit={handleSubmit}>
          <textarea
            className="form-control "
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <br />
          <button className="btn btn-dark" type="submit">
            Comment
          </button>
        </form>
        <br />
      </div>

      {/* แสดงข้อความ error ถ้ามี */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
