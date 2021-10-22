import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert.jsx";
const getLocaleStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};
function App() {
  const [name, setName] = useState(""); //name
  const [list, setList] = useState(getLocaleStorage()); //list[]
  const [isEditing, setEditing] = useState(false); //Edit
  const [editID, setEditID] = useState(null); //EditID
  const [alert, setAlert] = useState({
    msg: "",
    type: "",
    show: false,
  }); //Alert

  //handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "please enter some value");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );

      setName("");
      setEditID(null);
      setEditing(false);
      showAlert(true, "success", "value changed");
    } else {
      showAlert(true, "success", "item has been added in your list");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };
  //showAlert
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  //clearList
  const clearList = () => {
    showAlert(true, "danger ", "empty list");
    setList([]);
  };
  //removeList
  const removeList = (id) => {
    showAlert(true, "danger", " item removed");
    setList(list.filter((item) => item.id !== id));
  };

  //editMethod
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}{" "}
        <h3>grocery list</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="submit" type="submit">
            submit
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeList} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
