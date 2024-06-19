import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Mess from './Mess';
import Loading from './Loading';
import Add from './Add';

interface Bai {
  id: number;
  title: string;
  image: string;
  date: string;
  status: boolean;
}

export default function App() {
  const [baiHoc, setBaihoc] = useState<Bai[]>([]);
  const [filteredBaihoc, setFilteredBaihoc] = useState<Bai[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<Bai | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [blockId, setBlockId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const block = (id: number) => {
    setBlockId(id);
    setShow(true);
  };

  const cancel = () => {
    setShow(false);
  };

  const fetchPosts = () => {
    axios.get('http://localhost:8080/list-post')
      .then(res => {
        setTimeout(()=>{
          setBaihoc(res.data);
          setFilteredBaihoc(res.data);
          setLoading(false);
        }, 1000)
      })
      .catch(err => {
        console.log(err);
        setTimeout(()=>{
          setLoading(false);
        }, 1000)
      });
  };

  const handleEdit = (post: Bai) => {
    setCurrentPost(post);
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    setBlockId(id);
    setShow(true);
  };

  const handleBlockConfirm = () => {
    if (blockId !== null) {
      const post = baiHoc.find(bai => bai.id === blockId);
      if (post) {
        const updatedPost = { ...post, status: !post.status };
        axios.put(`http://localhost:8080/list-post/${blockId}`, updatedPost)
          .then(() => {
            fetchPosts();
            setShow(false);
          })
          .catch(err => console.error(err));
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value === '') {
      setFilteredBaihoc(baihoc);
    } else {
      const filtered = baiHoc.filter(bai => bai.title.toLowerCase().includes(value.toLowerCase()));
      setFilteredBaihoc(filtered);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className="container">
        <div className="header">
          <input
            type="text"
            placeholder="Nhập từ khóa tìm kiếm"
            className='inputSearch'
            value={searchTerm}
            onChange={handleSearch}
          />
          <select name="" id="">
            <option value="">Lọc bài viết</option>
          </select>
          <button className="add-new" onClick={() => { setShowAddForm(true); setCurrentPost(null); }}>Thêm mới bài viết</button>
        </div>
        <div className="table-container">
          {loading ? <Loading /> : (
            filteredBaihoc.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tiêu đề</th>
                    <th>Hình ảnh</th>
                    <th>Ngày viết</th>
                    <th>Trạng thái</th>
                    <th>Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBaihoc.map(bai => (
                    <tr key={bai.id}>
                      <td>{bai.id}</td>
                      <td>{bai.title}</td>
                      <td><img src={bai.image} alt={bai.title} /></td>
                      <td>{bai.date}</td>
                      <td><span className="status">{bai.status ? 'Đã xuất bản' : 'Ngừng xuất bản'}</span></td>
                      <td>
                        <button className="block" onClick={() => block(bai.id)}>{bai.status ? 'Ngừng xuất bản' : 'Xuất bản'}</button>
                        <button className="edit" onClick={() => handleEdit(bai)}>Sửa</button>
                        <button className="delete" onClick={() => handleDelete(bai.id)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Không có kết quả tìm kiếm</p>
            )
          )}
        </div>
      </div>

      {show && <Mess title="Thông báo" message="Bạn có chắc chắn muốn thực hiện hành động này không?" onCancel={cancel} onConfirm={handleBlockConfirm} />}
      {showAddForm && <Add onClose={() => setShowAddForm(false)} onAdd={fetchPosts} currentPost={currentPost} />}
    </>
  );
}
