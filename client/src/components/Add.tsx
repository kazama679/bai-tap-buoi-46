import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AddProps {
  onClose: () => void;
  onAdd: () => void;
  currentPost?: Bai | null;
}

interface Bai {
  id: number;
  title: string;
  image: string;
  date: string;
  status: boolean;
}

export default function Add({ onClose, onAdd, currentPost }: AddProps) {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title);
      setImage(currentPost.image);
      setContent(currentPost.date);  // Assuming 'content' is stored in the 'date' field in the database
    } else {
      handleReset();
    }
  }, [currentPost]);

  const handleReset = () => {
    setTitle('');
    setImage('');
    setContent('');
  };

  const handlePublish = () => {
    if (!title || !image || !content) {
      setError('Tên bài viết, hình ảnh và nội dung không được để trống');
      return;
    }

    axios.get('http://localhost:8080/list-post')
      .then(res => {
        const isDuplicate = res.data.some((post: any) => post.title === title && (!currentPost || post.id !== currentPost.id));
        if (isDuplicate) {
          setError('Tên bài viết không được phép trùng');
          return;
        }

        const newPost = {
          id: currentPost ? currentPost.id : Date.now(),
          title,
          image,
          date: new Date().toLocaleDateString(),
          status: true
        };

        const request = currentPost
          ? axios.put(`http://localhost:8080/list-post/${currentPost.id}`, newPost)
          : axios.post('http://localhost:8080/list-post', newPost);

        request
          .then(() => {
            onAdd();
            onClose();
          })
          .catch(err => console.error(err));
      });
  };

  return (
    <div className="all-form">
      <div className="new-article-form">
        <div className="form-header">
          <h2>{currentPost ? 'Sửa bài viết' : 'Thêm mới bài viết'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="form-body">
          <div className="form-group">
            <label>Tên bài viết</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên bài viết"
            />
          </div>
          <div className="form-group">
            <label>Hình ảnh</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Nhập URL hình ảnh"
            />
          </div>
          <div className="form-group">
            <label>Nội dung</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung"
            ></textarea>
          </div>
        </div>
        <div className="form-footer">
          <button onClick={handleReset} className="reset-button">Làm mới</button>
          <button onClick={handlePublish} className="publish-button">Xuất bản</button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}
