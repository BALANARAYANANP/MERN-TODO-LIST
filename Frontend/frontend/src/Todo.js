import React, { useEffect, useState } from 'react'

const Todo = () => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [todo, setTodo] = useState([])
    const [error, setError] = useState('')
    const [msg, setmsg] = useState('')
    const [editId, setEditId] = useState(0)
    const [edittitle, setEditTitle] = useState('')
    const [editdesc, seteditdesc] = useState('')

    const apiURL = 'http://localhost:8000'

    const handleUpdate = () => {
        setError('')
        if (edittitle.trim() !== '' && editdesc.trim() !== '') {
            fetch(apiURL + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: edittitle, desc: editdesc })
            }).then((res) => {
                if (res.ok) {
                    const UpdatededItem = todo.map((item) => {
                        if (item._id == editId) {
                            item.title = edittitle;
                            item.desc = editdesc;
                        }
                        return item;
                    })
                    setTodo(UpdatededItem)
                    setmsg('Item Updated SuccessFully')
                    setTitle('')
                    setDesc('')
                    setTimeout(() => {
                        setmsg('')
                    }, 3000)

                    setEditId(0)
                }
                else
                    setError('Unable to Update Todo Item')
            }).catch(() => {
                setError("Unable to Update Todo Item")
            })

        }



    }

    const handleEdit = (item) => {
        setEditId(item._id)
        setEditTitle(item.title)
        seteditdesc(item.desc)
    }

    const handleDelete = (id) => {
        if (window.confirm("Are You Want To Delete This Item")) {
            fetch(apiURL + "/todos/" + id, {
                method: "DELETE"
            })
                .then(() => {
                    const DeletedTodos = todo.filter((item) => item._id !== id)
                    setTodo(DeletedTodos)
                })


        }
    }

    const handleCancel = () => {
        setEditId(0)
    }
    const handleSubmit = () => {
        setError('')
        if (title.trim() !== '' && desc.trim() !== '') {
            fetch(apiURL + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, desc })
            }).then((res) => {
                if (res.ok) {

                    setTodo([...todo, { title, desc }])
                    setmsg('Item Added SuccessFully')
                    setTitle('')
                    setDesc('')
                    setTimeout(() => {
                        setmsg('')
                    }, 3000)
                }
                else
                    setError('Unable to Create Todo Item')
            }).catch(() => {
                setError("Unable to Create Todo Item")
            })

        }


    }

    useEffect(() => {
        getItem()
    }, [])

    const getItem = () => {
        fetch(apiURL + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodo(res)
                // console.log(todo)
            })

    }
    return (
        <>
            <div className='row p-3 bg-success text-light'>
                <h1>Todo List</h1>
            </div>
            <div className='row'>
                <h3>Add Item</h3>
                {msg && <p className='text-success'>{msg}</p>}
                <div className='form-group d-flex gap-2' >
                    <input className='form-control' onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Title' />
                    <input className='form-control' onChange={(e) => setDesc(e.target.value)} value={desc} type="text" placeholder='Description' />
                    <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
                </div>
                {error && <p className='text-danger'>{error}</p>}

            </div>
            <div className='row mt-3'> </div>
            <ul className='list-group'>
                {
                    todo.map((item) =>
                        <li className='list-group-item d-flex justify-content-between bg-info align-items-center my-3' >
                            <div className='d-flex flex-column'>
                                {editId == 0 || editId !== item._id ?
                                    <>
                                        <span className='fw-bold' >{item.title}</span>
                                        <span  >{item.desc}</span> </> :
                                    <>
                                        <div className='form-group d-flex gap-2' >
                                            <input className='form-control' onChange={(e) => setEditTitle(e.target.value)} value={edittitle} type="text" placeholder='Title' />
                                            <input className='form-control' onChange={(e) => seteditdesc(e.target.value)} value={editdesc} type="text" placeholder='Description' /></div>
                                    </>}
                            </div>
                            {editId == 0 || editId !== item._id ? <>
                                <div className='d-flex gap-2'>

                                    <button className='btn btn-warning' onClick={() => handleEdit(item)} >Edit</button>
                                    <button className='btn btn-danger' onClick={() => handleDelete(item._id)}>Delete</button></div> </> : <>
                                <div className='d-flex gap-2'>

                                    <button className='btn btn-warning' onClick={handleUpdate}>Update</button>
                                    <button className='btn btn-danger' onClick={() => handleCancel()}>Cancel</button></div>
                            </>}
                        </li>
                    )
                }





            </ul>
        </>
    )
}


export default Todo;
