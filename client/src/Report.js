import React, { useState, useEffect } from "react";
import './style.css';
import Axios from 'axios';
import { Button } from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
function Report() {
  const [show, setShow] = useState(false);
  const [showTambah, setShowTambah] = useState(false);
  const [tanggal, setTanggal] = useState('');
  const [id_laporan, setidLaporan] = useState('');
  const [chat_masuk, setChatMasuk] = useState('');
  const [chat_closing, setChatClosing] = useState('');
  const [id_user, setIdUser] = useState('');
  // const handleClose = () => setShow(false);
  const handleClose2 = () => setShowTambah(false);
  // let Open = () => setShow(true);
  const ModalTambah = () => setShowTambah(true);
  
  const [reportList, setReportList] = useState([]);
  const [reportById, setReportById] = useState([]);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get/user").then((response) => {
      setUserList(response.data)
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get/laporanChat").then((response) => {
      setReportList(response.data)
    });
  }, []);

  useEffect((id_laporan) => {
    Axios.get(`http://localhost:3001/api/getbyid/laporanChat/${id_laporan}`).then((response) => {
      setReportById(response.data)
    });
  }, []);
  
  const addLaporanChat = () => {
    Axios.post("http://localhost:3001/api/insert/laporanChat", {
      tanggal: tanggal,
      chat_masuk: chat_masuk,
      chat_closing:chat_closing,
      id_user: id_user,
    })
    window.location.reload(false);
  };

  const deleteReport = (id_laporan) => {
    Axios.delete(`http://localhost:3001/api/delete/laporanChat/${id_laporan}`);
    window.location.reload(false);
  };

  const updateReport = (id_laporan, chat_masuk, chat_closing) => {
    Axios.put("http://localhost:3001/api/update/laporanChat", {
      id_laporan: id_laporan,
      chat_masuk: chat_masuk,
      chat_closing: chat_closing,
    });
    window.location.reload(false);
  };
  
  return (
    <div className="App">
      <br></br><br></br>
      <h1 id="center"> <b>Laporan Chat</b> </h1> 
      <div className="container">
      <div className="float-right m-4">
      <button className="btn btn-primary" onClick={ModalTambah}>tambah</button>
      </div> 
    <table className="table table-bordered bg-white">
    <thead>
      <tr>
        <th>Nama</th>
        <th>Tanggal</th>
        <th>Chat Masuk</th>
        <th>Chat Closing</th>
        <th>Action</th>
      </tr>
    </thead>
    <tfoot>
    <tr>
        <th>Nama</th>
        <th>Tanggal</th>
        <th>Chat Masuk</th>
        <th>Chat Closing</th>
        <th>Action</th>
      </tr>
    </tfoot>
    <tbody>
    {reportList.map((report) => {
      return(
        // {setChatMasuk(report.chat_masuk);}
        // {setChatClosing(report.chat_closing);}
        <tr>
          <input className="form-control" type="hidden" name="id_laporan" placeholder="" onChange={(e) => {
              setidLaporan(e.target.value) }} defaultValue={report.id_laporan}/>
        <td>{report.nama}</td>
        <td>{report.tanggal}</td>
        <td>
        <input className="form-control" type="number" name="chat_masuk" placeholder="0" onChange={(e) => {
              setChatMasuk(e.target.value) }} defaultValue={report.chat_masuk}/>
        </td>
        <td>
        <input className="form-control" type="number" name="chat_closing" placeholder="0" onChange={(e) => {
              setChatClosing(e.target.value) }} defaultValue={report.chat_closing}/>
        </td>
        <td width="150">
        {/* {chat_masuk === ''
          ? <a href="/" onClick={() => {updateTodo(filterTodo.id, 'sudah')}} id="href">{filterTodo.isi}</a>
          : <a href="/" onClick={() => {updateTodo(filterTodo.id, 'belum')}} id="href"><s>{filterTodo.isi}</s></a>
        } */}
          <button className="btn btn-primary m-1" onClick={() => {updateReport(report.id_laporan, chat_masuk, chat_closing)}}>update</button>
          <button className="btn btn-primary m-1" onClick={() => {deleteReport(report.id_laporan)}}>x</button>
        </td>
      </tr>
      )
       })}
    </tbody>
  </table>
</div>   
      <Modal show={showTambah} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <label>Nama</label>   
        <select name="id_user" className="form-control" onChange={(e) => {setIdUser(e.target.value)}}>
        {userList.map((user) => {
          return (
            <option value={user.id_user} >{user.nama}</option>          
            );
        })} 
        </select>   

            <div class="form-group">
              <label>Tanggal</label>
            <input className="form-control" type="date" name="tanggal" placeholder="Tanggal..." onChange={(e) => {
              setTanggal(e.target.value)
            }} />
            </div>
              <div class="form-group">
                <label>Chat Masuk</label>
            <input className="form-control" type="number" name="chat_masuk" placeholder="Chat Masuk..." onChange={(e) => {
              setChatMasuk(e.target.value)
            }}/>
            </div>
            <div class="form-group">
              <label>Chat CLosing</label>
            <input className="form-control" type="number" name="chat_closing" placeholder="Chat Closing..." onChange={(e) => {
              setChatClosing(e.target.value)
            }} />
            </div>
         
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary" onClick={addLaporanChat}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Report;