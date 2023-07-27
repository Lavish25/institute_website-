import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import swal from 'sweetalert';

export default function Dashboard() {
  var navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [userData, setUserData] = useState([]);
  const [specificUserData, setSpecificUserData] = useState([]);

  if (
    email === null ||
    email === undefined ||
    email === "undefined" ||
    email === ""
  ) {
    navigate("/login");
  }

  const userLogout = async () => {
    console.log("user called logout");

    var isUser = localStorage.removeItem("email");
    const email = localStorage.getItem("email");

    if(email == null || email == undefined || email == "undefined" || email == ""){
      navigate("/login");
    }

    console.log("isuser", isUser);
  };

  const getUserData = async () => {
    axios
      .get("http://localhost:8000/api/users")
      .then((response) => {
        console.log("backend response :", response);
        var stringData = JSON.stringify(response);
        console.log("stringData", stringData);
        var parseData = JSON.parse(stringData);
        console.log("parsedata", parseData);
        setUserData(parseData.data.data);

        if (parseData.data.status === "1") {
          swal("you successfully fetched");
        } else {
          swal("something went wrong");
        }
      })
      .catch((error) => {
        console.log("backend error :", error);
      });
  };

  //specific user data
  const getSpecificUserData = async (email) => {
    axios
      .get(`http://localhost:8000/api/user/${email}`)
      .then((response) => {
        console.log("backend response: ", response);
        var stringData = JSON.stringify(response);
        console.log("stringData", stringData);
        var parseData = JSON.parse(stringData);
        console.log("parseData", parseData);
        setSpecificUserData(parseData.data.data[0]);

        if (parseData.data.status === "1") {
          swal("you successfully fetched");
        } else {
          swal("something went wrong");
        }
      })
      .catch((error) => {
        console.log("backend error :", error);
      });
  };

  // userDelete
  const userDelete = async (email) => {
    console.log("delete", email);
    const isDelete = window.confirm("Are you sure you want to delete");
    if (isDelete) {
      axios.post(`http://localhost:8000/api/delete/${email}`).then((response) => {
        console.log("backend response :", response);
        var stringData = JSON.stringify(response);
        console.log("stringData", stringData);
        var parseData = JSON.parse(stringData);
        console.log("parseData", parseData);

        if (parseData.data.status === "1") {
          setTimeout(() => {
            getUserData();
          }, 4000);

          swal("user deleted successfully");
        } else {
          swal("user not deleted");
        }
      })
      .catch((error) => {
        console.log("backend error", error);
      });
    } else {
      // User canceled the deletion
    }
  };

  // userUpdate
  const userUpdate = async (email) => {
    console.log("update", email);
  };

  useEffect(() => {
    getUserData();
  }, [email]);

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Welcome, User! {email}</h1>
        <img id="imgprofile" src={`upload/images/image1685371675407-818613671.png`} alt="Profile" />
        <nav>
          <ul id="wi">
            <li>Home</li>
            <li>Courses</li>
            <li>Internship</li>
            <li>Settings</li>
          </ul>
        </nav>
        <button className="usericon">
          <UserOutlined />User Profile
        </button>
        <button className="logout" onClick={userLogout}>
          Logout
        </button>
      </div>
      <div className="content">
        <div className="widget">
          <h2>Course Offerings</h2>
          <p>Choose from a variety of courses to enhance your skills:</p>
          <ul>
            <li>Web Development</li>
            <li>Data Science</li>
            <li>Mobile App Development</li>
            <li>UI/UX Design</li>
            <li>Machine Learning</li>
          </ul>
        </div>
        <div className="widget">
          <h2>Course Details</h2>
          <p>Learn more about our popular courses:</p>
          <ul>
            <li>Web Development: HTML, CSS, JavaScript</li>
            <li>Data Science: Python, R, Data Visualization</li>
            <li>Mobile App Development: iOS, Android, React Native</li>
            <li>UI/UX Design: User Research, Prototyping, Wireframing</li>
            <li>Machine Learning: Algorithms, Neural Networks, TensorFlow</li>
          </ul>
        </div>
      </div>
      <table>
  <thead>
    <tr id="table">
      <th>Name</th>
      <th>Email</th>
      <th>Password</th>
      <th>Delete</th>
      <th>Update</th>
    </tr>
  </thead>
  <tbody id="data">
    {userData.map((data, i) => {
      return (
        <tr key={i}>
          <td id="red">{data.name}</td>
          <td>{data.email}</td>
          <td>{data.password}</td>
          <td id="del"><button onClick={() => userDelete(data.email)}>Delete</button></td>
          <td id="upd"><button onClick={() => userUpdate(data.email)}>Update</button></td>
        </tr>
      );
    })}
  </tbody>
</table>

      <button onClick={getUserData}>get</button>
      <div className="footer">
        <p>© 2023 UNIVERSAL Informatics</p>
      </div>
    </div>
  );
}
