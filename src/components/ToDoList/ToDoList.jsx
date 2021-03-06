import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { deleteRequest, getRequest, putRequest } from '../../store/thunk/mockApiThunk'
import { NewToDo } from './NewToDo'
import { DeleteModal } from '../DeleteModal/DeleteModal'
import './style.css'

export const ToDoList = () => {
  const { loading, toDo } = useSelector((store) => store.toDoReducer)
  const dispatch = useDispatch()
  const [input, setInput] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState(null)

  useEffect(() => {
    if (!toDo) {
      dispatch(getRequest('toDoList'))
    }
  }, [])

  const checkboxHandler = (item) => {
    dispatch(putRequest('toDoList', { ...item, done: !item.done }))
  }

  const deleteHandler = (id) => {
    dispatch(deleteRequest('toDoList', deleteItemId))
    setDeleteItemId(null)
  }

  return (
    <div className="todo__container">
      {loading && <div className="loading">Loading...</div>}
      <button className="button button__create" onClick={() => setInput(!input)}>
        Add New ToDo
      </button>
      {input && <NewToDo setInput={setInput} />}
      <ul className="todo__list">
        {toDo &&
          toDo
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .map((item) => {
              return (
                <li key={item.id} className="todo__item">
                  <input
                    className="todo__checkbox"
                    type="checkbox"
                    checked={item.done}
                    onChange={() => checkboxHandler(item)}
                  />
                  <div className={item.done ? 'todo__content todo__done' : 'todo__content'}>
                    <p className="todo__text">{item.text}</p>
                    <p className="todo__date">Deadline: {item.deadline}</p>
                  </div>
                  <button
                    className="button button__delete"
                    onClick={() => setDeleteItemId(item.id)}
                  >
                    Delete
                  </button>
                </li>
              )
            })}
      </ul>
      {deleteItemId && <DeleteModal onAgree={deleteHandler} onCancel={setDeleteItemId} />}
    </div>
  )
}
