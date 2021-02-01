import React, { useState, useEffect } from "react";
import './style.css';
import Axios from 'axios';

function Home() {
  const [isi, setIsi] = useState('');
  const [status, setStatus] = useState('belum');
  const [nama, setNama] = useState('');
  
  const [todoList, setTodoList] = useState([]);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get/user").then((response) => {
      setUserList(response.data)
    });
  }, []);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/get/todolist`).then((response) => {
      setTodoList(response.data)
    });
  }, []);


  const addTodo = (id_user) => {
    Axios.post("http://localhost:3001/api/insert/todolist", {
      isi: isi,
      status: status,
      id_user: id_user,
    });

    setTodoList([
      ...todoList,
      { isi: isi, status: status, id_user: id_user},
    ]);
  };

  const addUser = () => {
    Axios.post("http://localhost:3001/api/insert/user", {
      nama: nama,
    });

    setUserList([
      ...userList,
      {nama: nama},
    ]);
  };

  const deleteTodo = (idTodo) => {
    Axios.delete(`http://localhost:3001/api/delete/todolist/${idTodo}`);
  };

  const deleteUser = (id_user) => {
    Axios.delete(`http://localhost:3001/api/delete/user/${id_user}`);
  };

  const updateTodo = (idTodo, status) => {
    Axios.put("http://localhost:3001/api/update/todolist", {
      id: idTodo,
      status: status,
    });
  };
  
  return (
    <div className="App">
      <br></br>
      <h1 id="center"> TO DO LIST </h1> 
      <div className="card" id="set">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <br></br>
            <input className="form-control" type="text" name="nama" placeholder="Tambah User..." onChange={(e) => {
              setNama(e.target.value)
            }} />
            <br></br>
            <center>
              <a href="/"><button className="btn btn-primary" onClick={addUser}>New User</button></a>
            </center>
          </li>
        </ul>
      </div>
      
      <div className="row">
        {userList.map((user) => {
          return (
            <div class="col-sm-3">
            <div className="card" id="todo">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-6 col-md-2"></div>
                    <div class="col-6 col-md-7" id="capital"><center><b>{user.nama}</b></center></div>
                    <div class="col-6 col-md-3">
                      <a href="/">
                        <button className="btn btn-primary" onClick={() => {deleteUser(user.id_user)}}>x</button>
                      </a>
                    </div>
                  </div>
                </li>
                <input type="hidden" name="id_user" id="id_user" value={user.id_user} />
                {todoList.filter(todo => todo.id_user === user.id_user).map((filterTodo) => {
                return (
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-sm-2">
                      <a href="/">
                        <button className="btn btn-primary" onClick={() => {deleteTodo(filterTodo.id)}}>x</button>
                      </a>
                    </div>
                    <div class="col-sm-10">
                    {filterTodo.status === 'belum'
                      ? <a href="/" onClick={() => {updateTodo(filterTodo.id, 'sudah')}} id="href">{filterTodo.isi}</a>
                      : <a href="/" onClick={() => {updateTodo(filterTodo.id, 'belum')}} id="href"><s>{filterTodo.isi}</s></a>
                    }
                    </div>
                  </div>
                </li>
                  );
                })} 
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-sm-7">
                      <input className="form-control" type="text" name="isi" placeholder="Add To Do..." onChange={(e) => {
                        setIsi(e.target.value)
                      }} />
                    </div>
                    <div class="col-sm-2">
                      <a href="/">
                        <button className="btn btn-primary" onClick={() => {addTodo(user.id_user)}}>Tambah</button>
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          );
        })}
        </div>
        <br></br>
    </div>
  );
}

export default Home;

