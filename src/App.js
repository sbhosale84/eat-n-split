import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showFriends, setShowFriends] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriends] = useState(null);
  function showAddFriends() {
    setShowFriends(!showFriends);
  }
  function handleAddFriends(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowFriends(false);
  }

  function handleSelection(friend) {
    // setSelectedFriends(friend);
    setSelectedFriends((curr) => (curr?.id === friend.id ? null : friend));
    setShowFriends(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriends(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showFriends && <FormAddFriend onAddFriend={handleAddFriends} />}
        <Button onClick={showAddFriends}>
          {!showFriends ? "Add friend" : "cancel"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={(e) => onSelection(friend)}>
        {!isSelected ? "Select" : "Cancel"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [imageName, setImageName] = useState("https://i.pravatar.cc/48");
  // if (friendName || setFriendName) return;
  const id = crypto.randomUUID();
  function handleFormSubmit(e) {
    e.preventDefault();
    const newFriend = {
      id,
      name: friendName,
      image: `${imageName}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setFriendName("");
    setImageName("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label>👨🏾‍🤝‍👨🏻Friend name</label>
      <input
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
        type="text"
      />
      <label>🌆 Image URL</label>
      <input
        value={imageName}
        onChange={(e) => setImageName(e.target.value)}
        type="text"
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>$ Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>$ Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill
              ? paidByFriend
              : Number(e.target.value)
          )
        }
      />
      <label>$ {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}></input>
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value={"user"}>you</option>
        <option value={"friend"}>{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
