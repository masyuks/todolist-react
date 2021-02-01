import React, { useState, useEffect } from "react";
import './style.css';
import Axios from 'axios';
import { Button } from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
import moment from 'moment';
function Report() {
  const [show, setShow] = useState(false);
  const [showTambah, setShowTambah] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [tanggal, setTanggal] = useState('');
  const [id_laporan, setidLaporan] = useState('');
  const [chat_masuk, setChatMasuk] = useState('');
  const [chat_closing, setChatClosing] = useState('');
  const [cm_edit, setCmEdit] = useState('');
  const [cc_edit, setCcEdit] = useState('');
  const [id_user, setIdUser] = useState('');
  // const handleClose = () => setShow(false);
  const handleClose2 = () => setShowTambah(false);
  const handleClose1 = () => setShowEdit(false);
  // let Open = () => setShow(true);
  const ModalTambah = () => setShowTambah(true);
  const ModalEdit = () => setShowEdit(true);
  
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

  const getLaporanChatById = (id_laporan) => {
    Axios.get(`http://localhost:3001/api/getbyid/laporanChat/${id_laporan}`).then((response) => {
      setReportById(response.data)
    });
    ModalEdit();
  };
  
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

  const updateReport = (id, cm, cc) => {
    if (cm_edit=="" && cc_edit=="") {
      Axios.put("http://localhost:3001/api/update/laporanChat", {
        id_laporan: id,
        chat_masuk: cm,
        chat_closing: cc,
      });
      window.location.reload(false);
    }
    else if (cm_edit=="") {
      Axios.put("http://localhost:3001/api/update/laporanChat", {
        id_laporan: id,
        chat_masuk: cm,
        chat_closing: cc_edit,
      });
      window.location.reload(false);
    }
    else if (cc_edit=="") {
      Axios.put("http://localhost:3001/api/update/laporanChat", {
        id_laporan: id,
        chat_masuk: cm_edit,
        chat_closing: cc,
      });
      window.location.reload(false);
    }
    else {
      Axios.put("http://localhost:3001/api/update/laporanChat", {
        id_laporan: id,
        chat_masuk: cm_edit,
        chat_closing: cc_edit,
      });
      window.location.reload(false);
    }
  };
  
  return (
    <div className="App">
      <br></br><br></br>
      <h1 id="center"> <b>Laporan Chat</b> </h1> 
      <div className="container">
      <div className="float-right m-4">
      <button className="btn btn-primary" onClick={ModalTambah}>Tambah</button>
      </div> 
    <table className="table table-bordered bg-white">
    <thead>
      <tr>
        <th><center>Nama</center></th>
        <th><center>Tanggal</center></th>
        <th><center>Chat Masuk</center></th>
        <th><center>Chat Closing</center></th>
        <th><center>Action</center></th>
      </tr>
    </thead>
    <tfoot>
    <tr>
        <th><center>Nama</center></th>
        <th><center>Tanggal</center></th>
        <th><center>Chat Masuk</center></th>
        <th><center>Chat Closing</center></th>
        <th><center>Action</center></th>
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
        <td><center>{report.nama}</center></td>
        <td><center>{moment(report.tanggal).format("LL")}</center></td>
        <td><center>{report.chat_masuk}</center></td>
        <td><center>{report.chat_closing}</center></td>
        <td>
          <center>
          <button className="btn btn-primary" onClick={() => {getLaporanChatById(report.id_laporan)}}>Update</button>
          &nbsp; &nbsp;
          <button className="btn btn-danger" onClick={() => {deleteReport(report.id_laporan)}}>&nbsp;&nbsp; X &nbsp;&nbsp;</button>
          </center>
        </td>
      </tr>
      );
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
        <option selected disabled>--- Pilih User ---</option>
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
            <input className="form-control" type="number" name="chat_masuk" min="0" placeholder="Chat Masuk..." onChange={(e) => {
              setChatMasuk(e.target.value)
            }}/>
            </div>
            <div class="form-group">
              <label>Chat Closing</label>
            <input className="form-control" type="number" name="chat_closing" min="0" placeholder="Chat Closing..." onChange={(e) => {
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

      {reportById.map((rbi) => {
        return(
      <Modal show={showEdit} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <label>Nama</label>   
        <select name="id_user" className="form-control" onClick={(e) => {setIdUser(e.target.value)}} readOnly>
            <option selected disabled>{rbi.nama}</option>
        </select>   
            <div class="form-group">
              <label>Tanggal</label>
            {/* <input className="form-control" type="date" name="tanggal" defaultValue={moment(rbi.tanggal).format("L")} onChange={(e) => {
              setTanggal(e.target.value)
            }} /> */}
            <input className="form-control" type="text" name="tanggal" maxLength="10" defaultValue={moment(rbi.tanggal).format("L")} onChange={(e) => {
              setTanggal(e.target.value)
            }} readOnly />
            </div>
              <div class="form-group">
                <label>Chat Masuk</label>
            <input className="form-control" type="number" name="chat_masuk" defaultValue={rbi.chat_masuk} min="0" placeholder="Chat Masuk..." onChange={(e) => {
              setCmEdit(e.target.value)
            }}/>
            </div>
            <div class="form-group">
              <label>Chat Closing</label>
            <input className="form-control" type="number" name="chat_closing" defaultValue={rbi.chat_closing} min="0" placeholder="Chat Closing..." onChange={(e) => {
              setCcEdit(e.target.value)
            }} />
            </div> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {updateReport(rbi.id_laporan, rbi.chat_masuk, rbi.chat_closing)}}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      );
    })} 
    </div>
  );
}
export default Report;