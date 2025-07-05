import React, { useContext, useEffect, useState } from "react";
import classes from "./home.module.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward, IoMdContact } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { AppState } from "../../Context/DataContext";
import axios from "../../Api/axios";
import Loader from "../../Components/Loader/Loader";

function Home() {
  // Destructure user and setUser from AppState context
  const { user, setUser } = useContext(AppState);
  // Retrieve token from local storage
  const token = localStorage.getItem("token");

  // Define state variables
  const [questions, setquestions] = useState([]); // To store fetched questions
  const [isloading, setIsLoading] = useState(false); // To manage loading state
  const [searchItem, setSearchItem] = useState(""); // To manage search input
  const [filteredQuestions, setFilteredQuestions] = useState(questions); // To store filtered questions
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to load questions from the API
  async function Loadquestions() {
    try {
      // Make GET request to fetch questions
      const { data } = await axios.get("/question", {
        headers: {
          authorization: "Bearer " + token, // Include authorization token in headers
        },
      });
      console.log(data?.questions); // Log fetched questions to console
      setIsLoading(false); // Set loading state to false
      setquestions(() => data.questions); // Update questions state with fetched data
    } catch (error) {
      setIsLoading(false); // Set loading state to false in case of error
      console.log(error.response.data.msg); // Log error message
      navigate("/login"); // Redirect to login page if there's an error
    }
  }

  // Function to check if the user is authenticated
  async function checkuser() {
    try {
      // Make GET request to check user authentication
      const { data } = await axios.get("/users/check", {
        headers: {
          authorization: "Bearer " + token, // Include authorization token in headers
        },
      });
      console.log(data); // Log user data to console
      setUser(data.username); // Set user state with fetched username
      navigate("/"); // Navigate to home page
    } catch (error) {
      console.log(error); // Log error
      navigate("/login"); // Redirect to login page if there's an error
    }
  }

  // useEffect to load questions and check user on component mount
  useEffect(() => {
    setIsLoading(true); // Set loading state to true
    checkuser(); // Check if user is authenticated
    Loadquestions(); // Load questions from API
  }, []);

  // useEffect to filter questions based on search input
  useEffect(() => {
    // Filter questions based on search term
    const filtered = questions.filter((question) =>
      question.title.toLowerCase().includes(searchItem.toLowerCase())
    );
    setFilteredQuestions(filtered); // Update filteredQuestions state
  }, [searchItem, questions]); // Dependencies: searchItem and questions

  // Render component
  return (
    <>
      {isloading ? ( // Conditional rendering based on loading state
        <Loader /> // Show Loader component if loading
      ) : (
        <section className={classes.home__container}>
          <div className={classes.home__topcontainer}>
            <div>
              <Link to="/question">Ask Question</Link>{" "}
              {/* Link to Ask Question page */}
            </div>
            <div style={{ fontSize: "20px", fontWeight: "300" }}>
              <p>
                WELCOME:<span style={{ color: " #DA7229" }}>{user}</span>{" "}
                {/* Display welcome message with username */}
              </p>
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "300",
              marginBottom: "20px",
            }}
          >
            Questions
            <div className={classes.search}>
              <input
                type="text"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)} // Update searchItem state on input change
                placeholder="Search questions..."
              />
            </div>
          </div>
          <div>
            {filteredQuestions?.map((question, i) => {
              return (
                <div className={classes.question__outercontainer} key={i}>
                  <hr />
                  <div className={classes.home__questioncontainer}>
                    <div className={classes.home__iconandusernamecontainer}>
                      <div>
                        <div>
                          <IoMdContact size={80} /> {/* User icon */}
                        </div>
                        <div className={classes.home__questionusename}>
                          <p>{question?.user_name}</p>{" "}
                          {/* Display question's username */}
                        </div>
                      </div>
                      <div className={classes.home__questiontitle}>
                        <p>{question?.title}</p>{" "}
                        {/* Display question's title */}
                      </div>
                    </div>
                    <div style={{ marginTop: "30px" }}>
                      <Link to={`/home/answers/${question.question_id}`}>
                        <IoIosArrowForward size={30} color="black" />{" "}
                        {/* Link to question's answers page */}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}

export default Home; // Export Home component as default
