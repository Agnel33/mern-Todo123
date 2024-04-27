import React, { useState, useEffect } from 'react'

function Main() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todo, setTodo] = useState([]);
    const [error, setError] = useState("");
    const [editId, setEditId] = useState(-1);
    const [message, setMessage] = useState("");

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const apiUrl = "http://localhost:8000"
    const handleSubmit = () => {
        setError("")
        //check inputs
        if (title.trim() !== '' && description.trim() !== '') {
            
            fetch(apiUrl + "/todo", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    //add item  to list
                    setTodo([...todo, { title, description }])
                    setTitle("")
                    setDescription("")
                    setMessage("Item Added Successfully")
                    setTimeout(() => {
                        setMessage("")
                    }, 3000)
                } else {
                    setError("Unable To create Todo Item")
                }
            }).catch(() => {
                setError("Unable To create Todo Item")
            })
        }
    }
    useEffect(() => {
        getItem()

    }, []);

    const getItem = () => {
        fetch(apiUrl + '/todo')
            .then((res) => res.json())
            .then((res) => {
                setTodo(res)
            })
    }
    const handleEdit = (item)=>{
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description)
    }

    const handleUpdate = ()=>{
        setError("")
        //check inputs
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            
            fetch(apiUrl + "/todos/"+editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title:editTitle, description:editDescription })
            }).then((res) => {
                if (res.ok) {
                    //update item  to list
                   const updatedTodos  = todo.map((item)=>{
                        if (item._id == editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;

                    });
                    setTodo(updatedTodos)
                    setEditTitle("")
                    setEditDescription("")
                    setMessage("Item Updated  Successfully")
                    setTimeout(() => {
                        setMessage("")
                    }, 3000)
                     setEditId(-1)

                } else {
                    setError("Item Not Updated")
                    
                }
            }).catch(() => {
                setError("Unable To create Todo Item")
            })
        }

    }
    const handelEditCancel = ()=>{
        setEditId(-1);
    }
    const deleteItem = (id)=>{
        if (window.confirm('Are You Sure For Delete')) {
            fetch(apiUrl+'/todos/'+id,{
                method:"DELETE"
            }).
            then(()=>{
               const updatedTodos = todo.filter((item)=>item._id !==id)
               setTodo(updatedTodos)
            })
        }

    }
    return (

        <>
            <div className='row p-3 bg-success text-light'>
                <h1>TODO Project With MERN Stack</h1>
            </div>
            <div className='row'>
                <h3>Add Items</h3>
                {message && <p className='text-success'>{message}</p>}
                <div className='form-group d-flex gap-2'>
                    <input placeholder='Title' onChange={(e) => setTitle(e.target.value)} value={title} type="text" className='form-control' />
                    <input placeholder='Description' onChange={(e) => setDescription(e.target.value)} type="text" value={description} className='form-control' />
                    <button className='btn btn-dark' onClick={handleSubmit}>Submmit</button>
                </div>
                {error && <p className='text-danger'>{error}</p>}
            </div>
            <div className='row mt-3'>
                <h3>Taskes</h3>
                <div className='col-md-6'>
                <ul className='list-group'>
                    {
                        todo.map((item) => <li className='list-group-item bg-info d-flex justify-content-between align-items-center my-2'>
                            <div className='d-flex flex-column me-2'>
                                {
                                    editId == -1 || editId!== item._id ?
                                        <>
                                            <span className='fw-bold'>{item.title}</span>
                                            <span >{item.description}</span>
                                        </>
                                        :
                                        <>
                                            <div className='form-grop d-flex gap-2'>
                                                <input placeholder='Title' onChange={(e) => setEditTitle(e.target.value)} value={editTitle} type="text" className='form-control' />
                                                <input placeholder='Description' onChange={(e) => setEditDescription(e.target.value)} type="text" value={editDescription} className='form-control' />
                                            </div>
                                        </>
                                }

                            </div>
                            <div className='d-flex gap-2'>
                               { editId == -1 ? <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button>: <button  className="btn btn-warning" onClick = {handleUpdate}>Update</button>}
                               { editId == -1 ? <button className='btn btn-danger' onClick={()=>deleteItem(item._id)}>Delete</button>:
                                <button className='btn btn-danger' onClick={handelEditCancel}>Cancel</button>}
                            </div>
                        </li>)
                    }

                </ul>
                </div>
            </div>

        </>
    )
}

export default Main